const elk = new ELK();

fetch('demo.json')
   .then((response) => response.json())
   .then((data) => {
      const instance = jsPlumb.getInstance({
         connector: ['Flowchart', { cornerRadius: 5 }],
         PaintStyle: { stroke: '#999', strokeWidth: 1 },
         Endpoint: 'Dot',
         EndpointStyle: { fill: '#999', radius: 3 },
         Container: 'canvas',
      });

      // ⭐ 노드 생성
      data.nodes.forEach((node) => {
         const div = document.createElement('div');
         div.id = node.id;
         div.className = node.type;
         div.style.position = 'absolute';
         div.style.left = node.x + 'px';
         div.style.top = node.y + 'px';
         div.style.width = node.width + 'px';
         div.style.height = node.height + 'px';
         div.classList.add('flow-node');

         div.innerHTML =
            node.type === 'diamond' ? `<span>${node.label}</span>` : node.label;

         document.getElementById('canvas').appendChild(div);

         instance.draggable(div, {
            grid: [5, 5],
         });
      });

      // ⭐ ELK 설정
      const elkGraph = {
         id: 'root',
         layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.layered.nodePlacement.strategy': 'SIMPLE',
            'elk.edgeRouting': 'ORTHOGONAL',
         },
         children: data.nodes.map((node) => ({
            id: node.id,
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
         })),
         edges: data.connections.map((conn) => ({
            id: `${conn.source}-${conn.target}`,
            sources: [conn.source],
            targets: [conn.target],
            layoutOptions: {
               'elk.direction': getElkDirection(conn.anchors),
               'elk.edgeRouting': 'ORTHOGONAL',
            },
         })),
      };

      elk.layout(elkGraph).then((graph) => {
         const nodes = Array.from(document.querySelectorAll('.flow-node'));
         const obstacles = getObstacles(nodes);

         // ⭐⭐ Edge 순회
         graph.edges.forEach((edge) => {
            const src = edge.sources[0];
            const tgt = edge.targets[0];

            const connData = data.connections.find(
               (c) => c.source === src && c.target === tgt
            );
            const connType = connData?.type || '';
            const connLabel = connData?.label || '';
            const connLabelType = connData?.labelType || '';

            const sourceBox = document
               .getElementById(src)
               .getBoundingClientRect();
            const targetBox = document
               .getElementById(tgt)
               .getBoundingClientRect();

            const canvasBox = document
               .getElementById('canvas')
               .getBoundingClientRect();

            const sourceVertex = getAnchorPoint(
               {
                  left: sourceBox.left - canvasBox.left,
                  top: sourceBox.top - canvasBox.top,
                  width: sourceBox.width,
                  height: sourceBox.height,
               },
               connData?.anchors?.[0] || 'Continuous'
            );

            const targetVertex = getAnchorPoint(
               {
                  left: targetBox.left - canvasBox.left,
                  top: targetBox.top - canvasBox.top,
                  width: targetBox.width,
                  height: targetBox.height,
               },
               connData?.anchors?.[1] || 'Continuous'
            );

            const approxDistance =
               Math.abs(sourceVertex.x - targetVertex.x) +
               Math.abs(sourceVertex.y - targetVertex.y);

            let DIST_LIMIT, GRID_SPACING, MARGIN_XY;

            if (approxDistance > 800) {
               GRID_SPACING = 50;
               DIST_LIMIT = 1200;
               MARGIN_XY = 600;
            } else if (approxDistance > 400) {
               GRID_SPACING = 30;
               DIST_LIMIT = 800;
               MARGIN_XY = 400;
            } else {
               GRID_SPACING = 20;
               DIST_LIMIT = 600;
               MARGIN_XY = 300;
            }

            const vertices = [
               ...extractObstacleVertices(obstacles),
               sourceVertex,
               targetVertex,
            ];

            const edgesVG = computeVisibilityEdges(
               vertices,
               obstacles,
               DIST_LIMIT
            );

            // 1️⃣ slope 계산
            const dx = Math.abs(sourceVertex.x - targetVertex.x);
            const dy = Math.abs(sourceVertex.y - targetVertex.y);
            const slope = dy / (dx + 1e-6);

            // 2️⃣ intersects 검사
            let intersectsFlag = intersectsAnyObstacle(
               sourceVertex,
               targetVertex,
               obstacles
            );

            // 3️⃣ slope 보정 적용
            if (slope > 2.0) {
               intersectsFlag = false;
            }

            // 🔸 overlays 통일 적용
            const overlays = [];

            if (connType === 'current') {
               overlays.push([
                  'Custom',
                  {
                     create: makeCurrentSvg,
                     location: 0.5,
                  },
               ]);
            }

            overlays.push(['Arrow', { width: 7, length: 8, location: 1 }]);

            if (connLabel) {
               overlays.push([
                  'Label',
                  {
                     label: connLabel,
                     location: 0.5,
                     cssClass: `label-${connLabelType}`,
                  },
               ]);
            }

            // 🔸 최종 분기
            if (!intersectsFlag) {
               // 직선 연결
               const connection = instance.connect({
                  source: src,
                  target: tgt,
                  anchors: connData?.anchors || ['Continuous', 'Continuous'],
                  connector: ['Flowchart', { cornerRadius: 5 }],
                  paintStyle: { stroke: '#999', strokeWidth: 1 },
                  overlays: overlays,
               });

               const connSvg = connection.getConnector().canvas;
               const pathEl = connSvg.querySelector('path');
               if (pathEl) {
                  const d = pathEl.getAttribute('d');
                  const bgPath = document.createElementNS(
                     'http://www.w3.org/2000/svg',
                     'path'
                  );
                  bgPath.setAttribute('d', d);
                  bgPath.setAttribute('stroke', 'white');
                  bgPath.setAttribute('stroke-width', '5');
                  bgPath.setAttribute('fill', 'none');
                  connSvg.insertBefore(bgPath, pathEl);
               }

               if (connType) {
                  connSvg.classList.add(`conn-${connType}`);
               }

               return;
            }

            // ⛔️ 여기는 중복 intersects 검사 제거됨!

            // ⭐ Dijkstra path
            const path = dijkstra(
               vertices,
               edgesVG,
               sourceVertex,
               targetVertex
            );

            if (path.length >= 3) {
               const waypoints = pathToWaypoints(path, src, tgt);

               let prev = src;

               waypoints.forEach((wp) => {
                  const connection = instance.connect({
                     source: prev,
                     target: wp.id,
                     anchors: connData?.anchors || ['Continuous', 'Continuous'],
                     connector: ['Flowchart', { cornerRadius: 0 }],
                     paintStyle: { stroke: '#999', strokeWidth: 1 },
                     overlays: [], // waypoint 연결은 Arrow 없음
                  });
                  prev = wp.id;

                  const connSvg = connection.getConnector().canvas;
                  const pathEl = connSvg.querySelector('path');

                  if (pathEl) {
                     const d = pathEl.getAttribute('d');
                     const bgPath = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'path'
                     );
                     bgPath.setAttribute('d', d);
                     bgPath.setAttribute('stroke', 'white');
                     bgPath.setAttribute('stroke-width', '5');
                     bgPath.setAttribute('fill', 'none');
                     connSvg.insertBefore(bgPath, pathEl);
                  }

                  if (connType) {
                     connSvg.classList.add(`conn-${connType}`);
                  }
               });

               // 마지막 segment
               const connection = instance.connect({
                  source: prev,
                  target: tgt,
                  anchors: connData?.anchors || ['Continuous', 'Continuous'],
                  connector: ['Flowchart', { cornerRadius: 5 }],
                  paintStyle: { stroke: '#999', strokeWidth: 1 },
                  overlays: overlays,
               });

               const connSvg = connection.getConnector().canvas;
               const pathEl = connSvg.querySelector('path');

               if (pathEl) {
                  const d = pathEl.getAttribute('d');
                  const bgPath = document.createElementNS(
                     'http://www.w3.org/2000/svg',
                     'path'
                  );
                  bgPath.setAttribute('d', d);
                  bgPath.setAttribute('stroke', 'white');
                  bgPath.setAttribute('stroke-width', '5');
                  bgPath.setAttribute('fill', 'none');
                  connSvg.insertBefore(bgPath, pathEl);
               }

               if (connType) {
                  connSvg.classList.add(`conn-${connType}`);
               }
            }
         });

         instance.repaintEverything();
      });
   });

// ⭐ UTILITIES

// function extractVertices(nodes) {
//    const vertices = [];
//    const margin = 10;
//    const canvasBox = document.getElementById('canvas').getBoundingClientRect();

//    nodes.forEach((node) => {
//       const box = node.getBoundingClientRect();
//       const left = box.left - canvasBox.left;
//       const top = box.top - canvasBox.top;

//       vertices.push({ x: left, y: top });
//       vertices.push({ x: left + box.width, y: top });
//       vertices.push({ x: left, y: top + box.height });
//       vertices.push({ x: left + box.width, y: top + box.height });

//       vertices.push({ x: left + box.width / 2, y: top });
//       vertices.push({ x: left + box.width / 2, y: top + box.height });
//       vertices.push({ x: left, y: top + box.height / 2 });
//       vertices.push({ x: left + box.width, y: top + box.height / 2 });

//       vertices.push({ x: left - margin, y: top - margin });
//       vertices.push({ x: left + box.width + margin, y: top - margin });
//       vertices.push({ x: left - margin, y: top + box.height + margin });
//       vertices.push({
//          x: left + box.width + margin,
//          y: top + box.height + margin,
//       });
//    });

//    return vertices;
// }
// ⭐ UTILITIES

function extractObstacleVertices(obstacles) {
   const margin = 5;
   const vertices = [];

   obstacles.forEach((box) => {
      const left = box.left;
      const top = box.top;
      const right = box.left + box.width;
      const bottom = box.top + box.height;

      // 4 꼭짓점만
      vertices.push({ x: left - margin, y: top - margin });
      vertices.push({ x: right + margin, y: top - margin });
      vertices.push({ x: left - margin, y: bottom + margin });
      vertices.push({ x: right + margin, y: bottom + margin });
   });

   return vertices;
}

function generateGridVertices(minX, maxX, minY, maxY, GRID_SPACING) {
   const vertices = [];

   for (let x = minX; x <= maxX; x += GRID_SPACING) {
      for (let y = minY; y <= maxY; y += GRID_SPACING) {
         vertices.push({ x, y });
      }
   }
   return vertices;
}

function getObstacles(nodes) {
   const canvasBox = document.getElementById('canvas').getBoundingClientRect();
   return nodes.map((node) => {
      const box = node.getBoundingClientRect();
      const left = box.left - canvasBox.left;
      const top = box.top - canvasBox.top;

      return {
         left,
         top,
         width: box.width,
         height: box.height,
      };
   });
}

function computeVisibilityEdges(vertices, obstacles, DIST_LIMIT) {
   const edges = [];

   vertices.forEach((v1, i) => {
      vertices.forEach((v2, j) => {
         if (i === j) return;

         // ⭐⭐ 거리 제한 추가!
         const dist = Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y);
         if (dist > DIST_LIMIT) return;

         if (!intersectsAnyObstacle(v1, v2, obstacles)) {
            edges.push({ from: v1, to: v2 });
         }
      });
   });

   return edges;
}
function pathToWaypoints(path, sourceId, targetId) {
   const waypoints = [];

   // path의 중간 점만 waypoint로 씀 (양 끝은 source/target임)
   for (let i = 1; i < path.length - 1; i++) {
      const p = path[i];

      const waypointId = `vg-waypoint-${sourceId}-${targetId}-${Date.now()}-${Math.random()}`;
      const waypoint = document.createElement('div');
      waypoint.id = waypointId;
      waypoint.style.position = 'absolute';
      waypoint.style.left = `${p.x}px`;
      waypoint.style.top = `${p.y}px`;
      waypoint.style.width = '1px';
      waypoint.style.height = '1px';
      waypoint.style.background = '#999'; // 안보이게
      waypoint.style.zIndex = '1';
      waypoint.classList.add('waypoint');

      document.getElementById('canvas').appendChild(waypoint);

      waypoints.push({
         id: waypointId,
         sourceId,
         targetId,
      });
   }

   return waypoints;
}

function intersectsAnyObstacle(p1, p2, obstacles) {
   for (const box of obstacles) {
      if (lineIntersectsBox(p1, p2, box)) return true;
   }
   return false;
}

function lineIntersectsBox(p1, p2, box) {
   const tolerance = 2;
   const expandedBox = {
      left: box.left - tolerance,
      top: box.top - tolerance,
      right: box.left + box.width + tolerance,
      bottom: box.top + box.height + tolerance,
   };

   const boxEdges = [
      [
         { x: expandedBox.left, y: expandedBox.top },
         { x: expandedBox.right, y: expandedBox.top },
      ],
      [
         { x: expandedBox.right, y: expandedBox.top },
         { x: expandedBox.right, y: expandedBox.bottom },
      ],
      [
         { x: expandedBox.right, y: expandedBox.bottom },
         { x: expandedBox.left, y: expandedBox.bottom },
      ],
      [
         { x: expandedBox.left, y: expandedBox.bottom },
         { x: expandedBox.left, y: expandedBox.top },
      ],
   ];

   for (const edge of boxEdges) {
      if (linesIntersect(p1, p2, edge[0], edge[1])) {
         return true;
      }
   }

   return false;
}

function getElkDirection(anchors) {
   if (!anchors) return 'RIGHT'; // 기본 방향

   const sourceAnchor = anchors[0];
   const targetAnchor = anchors[1];

   // heuristic 예시 (네 경우에 맞게 튜닝 가능)
   if (sourceAnchor === 'Left') return 'LEFT';
   if (sourceAnchor === 'Right') return 'RIGHT';
   if (sourceAnchor === 'Top') return 'UP';
   if (sourceAnchor === 'Bottom') return 'DOWN';

   return 'RIGHT'; // fallback
}

function linesIntersect(p1, p2, q1, q2) {
   const ccw = (a, b, c) =>
      (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);

   return (
      ccw(p1, q1, q2) !== ccw(p2, q1, q2) && ccw(p1, p2, q1) !== ccw(p1, p2, q2)
   );
}

function dijkstra(vertices, edges, start, end) {
   const distances = new Map();
   const previous = new Map();
   const queue = [...vertices];

   vertices.forEach((v) => {
      distances.set(v, Infinity);
   });

   distances.set(start, 0);

   while (queue.length > 0) {
      queue.sort((a, b) => distances.get(a) - distances.get(b));
      const current = queue.shift();

      if (current === end) {
         break;
      }

      edges
         .filter((e) => e.from === current)
         .forEach((e) => {
            const alt = distances.get(current) + distance(e.from, e.to);

            if (alt < distances.get(e.to)) {
               distances.set(e.to, alt);
               previous.set(e.to, current);
            }
         });
   }

   const path = [];
   let current = end;

   while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
   }

   return path;
}

function distance(a, b) {
   return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getAnchorPoint(box, anchor) {
   const offset = 5; // ⭐⭐⭐ 바깥으로 살짝 빼기

   switch (anchor) {
      case 'Top':
         return { x: box.left + box.width / 2, y: box.top - offset };
      case 'Bottom':
         return {
            x: box.left + box.width / 2,
            y: box.top + box.height + offset,
         };
      case 'Left':
         return { x: box.left - offset, y: box.top + box.height / 2 };
      case 'Right':
         return {
            x: box.left + box.width + offset,
            y: box.top + box.height / 2,
         };
      default:
         return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
   }
}

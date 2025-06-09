const elk = new ELK();
let instance; // ⭐ 전역으로 선언
let selectedNode = null; // ⭐ 현재 선택된 노드
let selectedConnection = null; // ⭐ 현재 선택된 연결선

// ⭐ 전역 또는 상단에 "공통 Overlay 정의" (관리하기 쉽게)
const defaultArrowOverlay = [
   'Arrow',
   {
      id: 'arrowOverlay',
      width: 7,
      length: 8,
      location: 1,
   },
];

const makeLabelOverlay = (label, labelType = '') => [
   'Label',
   {
      id: 'labelOverlay',
      label: label,
      location: 0.5,
      cssClass: `label-${labelType}`,
   },
];

const makeCurrentOverlay = () => [
   'Custom',
   {
      id: 'currentOverlay',
      create: makeCurrentSvg,
      location: 0.5,
   },
];

fetch('demo.json')
   .then((response) => response.json())
   .then((data) => {
      instance = jsPlumb.getInstance({
         connector: ['Flowchart', { cornerRadius: 5 }],
         PaintStyle: { stroke: '#999', strokeWidth: 1 },
         Endpoint: 'Dot',
         EndpointStyle: {
            fill: '#3498db',
            radius: 4,
            strokeWidth: 2,
            stroke: '#ffffff',
         },
         Container: 'canvas',
      });

      // ⭐ 딱 1번만 등록 (중복 방지!)
      // connection 이벤트에서 사용
      instance.bind('connection', (info, originalEvent) => {
         if (!info.connection.getOverlay('arrowOverlay')) {
            info.connection.addOverlay(defaultArrowOverlay);
         }

         // main-path 추가
         const connSvg = info.connection.getConnector().canvas;
         const pathEls = connSvg.querySelectorAll('path');
         if (pathEls.length >= 1) {
            const mainPath = pathEls[0];
            mainPath.classList.add('main-path');
         }

         addBgAndHitPath(info.connection);
      });

      // ⭐ 노드 생성
      data.nodes.forEach((node) => {
         createNodeElement(node);
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

            // Arrow는 항상 추가
            overlays.push(defaultArrowOverlay);

            // connType 이 'current' 면 Custom overlay 추가
            if (connType === 'current') {
               overlays.push(makeCurrentOverlay());
            }

            // connLabel 있으면 Label overlay 추가
            if (connLabel) {
               overlays.push(makeLabelOverlay(connLabel, connLabelType));
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

               instance.bind('click', (conn, originalEvent) => {
                  selectConnection(conn);
               });

               const connSvg = connection.getConnector().canvas;

               // ⭐⭐ 기존에 "bg-path" 클래스가 있는지 검사
               if (!connSvg.querySelector('path.bg-path')) {
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
                     bgPath.classList.add('bg-path'); // ⭐⭐ 클래스 추가 (중복 방지용)

                     connSvg.insertBefore(bgPath, pathEl);

                     const hitPath = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'path'
                     );
                     hitPath.setAttribute('d', d);
                     hitPath.setAttribute('stroke', 'transparent');
                     hitPath.setAttribute('stroke-width', '10'); // ← 넓은 hit 영역
                     hitPath.setAttribute('fill', 'none');
                     hitPath.classList.add('hit-path');
                     hitPath.setAttribute('pointer-events', 'stroke');

                     hitPath.addEventListener('click', (e) => {
                        e.stopPropagation(); // 다른 click과 충돌 방지
                        selectConnection(connection);
                     });

                     connSvg.insertBefore(hitPath, bgPath);
                  }
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

                     const hitPath = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'path'
                     );
                     hitPath.setAttribute('d', d);
                     hitPath.setAttribute('stroke', 'transparent');
                     hitPath.setAttribute('stroke-width', '10'); // ← 넓은 hit 영역
                     hitPath.setAttribute('fill', 'none');
                     hitPath.classList.add('hit-path');
                     hitPath.setAttribute('pointer-events', 'stroke');

                     hitPath.addEventListener('click', (e) => {
                        e.stopPropagation(); // 다른 click과 충돌 방지
                        selectConnection(connection);
                     });

                     connSvg.insertBefore(hitPath, bgPath);
                  }

                  if (connType) {
                     connSvg.classList.add(`conn-${connType}`);
                  }

                  connection.instance.bind('click', (conn, originalEvent) => {
                     selectConnection(conn);
                  });
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

                  const hitPath = document.createElementNS(
                     'http://www.w3.org/2000/svg',
                     'path'
                  );
                  hitPath.setAttribute('d', d);
                  hitPath.setAttribute('stroke', 'transparent');
                  hitPath.setAttribute('stroke-width', '10'); // ← 넓은 hit 영역
                  hitPath.setAttribute('fill', 'none');
                  hitPath.classList.add('hit-path');
                  hitPath.setAttribute('pointer-events', 'stroke');

                  hitPath.addEventListener('click', (e) => {
                     e.stopPropagation(); // 다른 click과 충돌 방지
                     selectConnection(connection);
                  });

                  connSvg.insertBefore(hitPath, bgPath);
               }

               if (connType) {
                  connSvg.classList.add(`conn-${connType}`);
               }
            }
         });

         instance.repaintEverything();
      });
   });

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

function createNodeElement(node) {
   const div = document.createElement('div');
   div.id = node.id;
   div.style.position = 'absolute';
   div.style.left = node.x + 'px';
   div.style.top = node.y + 'px';
   div.style.width = node.width + 'px';
   div.style.height = node.height + 'px';
   div.style.backgroundColor =
      node.backgroundColor === 'transparent'
         ? node.backgroundColor
         : '#' + node.backgroundColor;
   div.style.color =
      node.color === 'transparent' ? node.color : '#' + node.color;
   div.style.borderColor =
      node.borderColor === 'transparent'
         ? node.borderColor
         : '#' + node.borderColor;
   div.style.fontSize = node.fontSize + 'px';
   div.style.fontWeight = node.fontWeight;
   div.style.borderRadius = node.borderRadius + 'px';
   div.classList.add('flow-node');
   if (node.type == 'diamond') div.classList.add('diamond');

   const span = document.createElement('span');
   span.innerHTML = node.label || '';
   div.appendChild(span);

   // ⭐ 클릭 이벤트 추가
   div.addEventListener('click', (e) => {
      e.stopPropagation(); // 다른 곳 클릭 방지
      selectNode(div);
   });

   document.getElementById('canvas').appendChild(div);

   instance.draggable(div, {
      grid: [5, 5],
   });

   addEndpoints(node.id);
}

const baseStyleList = {
   ellipse: {
      width: '150px',
      height: '40px',
      backgroundColor: '#aeb8c3',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '400',
      borderColor: 'transparent',
      borderRadius: '30px',
   },
   rectangle1: {
      width: '80px',
      height: '40px',
      backgroundColor: '#f4f4f4',
      color: '#222222',
      fontSize: '13px',
      fontWeight: '400',
      borderColor: '#dddddd',
      borderRadius: '3px',
   },
   rectangle2: {
      width: '140px',
      height: '30px',
      backgroundColor: '#ffffff',
      color: '#444444',
      fontSize: '14px',
      fontWeight: '400',
      borderColor: '#dddddf',
      borderRadius: '10px',
   },
   diamond: {
      width: '150px',
      height: '80px',
      backgroundColor: 'transparent',
      color: '#222222',
      fontSize: '14px',
      fontWeight: '500',
      borderColor: 'transparent',
      borderRadius: '0',
   },
};

function ChangeStyle(type) {
   if (type === 'ellipse' || type == 'rectangle1' || type == 'rectangle2') {
      selectedNode.classList.remove('diamond');
   } else if (type === 'diamond') {
      selectedNode.classList.add('diamond');
   }
   const styleSet = baseStyleList[`${type}`];
   //debugger;

   selectedNode.style.width = styleSet.width;
   selectedNode.style.height = styleSet.height;
   selectedNode.style.backgroundColor = styleSet.backgroundColor;
   selectedNode.style.color = styleSet.color;
   selectedNode.style.fontSize = styleSet.fontSize;
   selectedNode.style.fontWeight = styleSet.fontWeight;
   selectedNode.style.borderColor = styleSet.borderColor;
   selectedNode.style.borderRadius = styleSet.borderRadius;

   requestAnimationFrame(() => {
      instance.revalidate(selectedNode);
   });
}

function addEndpoints(nodeId) {
   const anchors = ['Top', 'Right', 'Bottom', 'Left'];
   anchors.forEach((anchor) => {
      instance.addEndpoint(nodeId, {
         anchor: anchor,
         uuid: `${nodeId}-${anchor}`, // 유일 ID (중복방지)
         isSource: true, // 출발 가능
         isTarget: true, // 도착 가능
         maxConnections: -1, // 연결 제한 없음
         endpoint: 'Dot', // endpoint 스타일
         paintStyle: {
            fill: '#3498db',
            radius: 4,
            strokeWidth: 2,
            stroke: '#ffffff',
         },
         connector: ['Flowchart', { cornerRadius: 5 }],
      });
   });
}

function selectNode(nodeEl) {
   // 이전 선택 노드 있으면 class 제거
   if (selectedNode) {
      selectedNode.classList.remove('selected-node');
   }
   if (selectedConnection) {
      const prevSvg = selectedConnection.getConnector().canvas;
      prevSvg.classList.remove('selected-connection');
      selectedConnection = null;
   }

   // 새 노드 선택
   selectedNode = nodeEl;
   selectedNode.classList.add('selected-node'); // ⭐ 초록색 border 적용

   // 속성 패널 표시
   document.getElementById('property-panel').style.display = 'block';
   document.getElementById('node-properties').style.display = 'block';
   document.getElementById('connection-properties').style.display = 'none';

   // 패널 값 업데이트
   const span = nodeEl.querySelector('span');
   document.getElementById('prop-text').value = span.innerText;
   document.getElementById('prop-width').value = parseInt(nodeEl.style.width);
   document.getElementById('prop-height').value = parseInt(nodeEl.style.height);
   document.getElementById('prop-bgcolor').value = rgbToHex(
      nodeEl.style.backgroundColor || '#ffffff'
   );
   document.getElementById('prop-bordercolor').value = rgbToHex(
      nodeEl.style.borderColor || '#000000'
   );
}

function selectConnection(conn) {
   // 이전 선택 해제
   if (selectedNode) {
      selectedNode.classList.remove('selected-node');
      selectedNode = null;
   }
   if (selectedConnection) {
      const prevSvg = selectedConnection.getConnector().canvas;
      prevSvg.classList.remove('selected-connection');
   }

   selectedConnection = conn;
   const svgEl = conn.getConnector().canvas;
   svgEl.classList.add('selected-connection');

   // 패널 표시
   document.getElementById('property-panel').style.display = 'block';
   document.getElementById('node-properties').style.display = 'none';
   document.getElementById('connection-properties').style.display = 'block';

   // 패널 값 업데이트
   const strokeColor = conn.getPaintStyle().stroke || '#999';
   document.getElementById('prop-conn-color').value = rgbToHex(strokeColor);

   const labelOverlay = conn.getOverlay('labelOverlay');
   document.getElementById('prop-conn-label').value =
      labelOverlay?.getLabel() || '';

   const labelClass =
      labelOverlay?.canvas?.classList?.value
         ?.split(' ')
         ?.find((cls) => cls.startsWith('label-'))
         ?.replace('label-', '') || '';

   document.getElementById('prop-conn-label-type').value = labelClass;
}

// 패널 입력 변경 이벤트
document.getElementById('prop-text').addEventListener('input', () => {
   if (selectedNode) {
      const span = selectedNode.querySelector('span');
      span.innerText = document.getElementById('prop-text').value;
   }
});
document.getElementById('prop-width').addEventListener('input', () => {
   if (selectedNode) {
      selectedNode.style.width =
         document.getElementById('prop-width').value + 'px';
      requestAnimationFrame(() => {
         instance.revalidate(selectedNode);
      });
   }
});
document.getElementById('prop-height').addEventListener('input', () => {
   if (selectedNode) {
      selectedNode.style.height =
         document.getElementById('prop-height').value + 'px';
      requestAnimationFrame(() => {
         instance.revalidate(selectedNode);
      });
   }
});
document.getElementById('prop-bgcolor').addEventListener('input', () => {
   if (selectedNode) {
      selectedNode.style.backgroundColor =
         document.getElementById('prop-bgcolor').value;
   }
});
document.getElementById('prop-bordercolor').addEventListener('input', () => {
   if (selectedNode) {
      selectedNode.style.borderColor =
         document.getElementById('prop-bordercolor').value;
   }
});

document.getElementById('prop-conn-color').addEventListener('input', () => {
   if (selectedConnection) {
      selectedConnection.setPaintStyle({
         stroke: document.getElementById('prop-conn-color').value,
         strokeWidth: 1,
      });
   }
});

document.getElementById('prop-conn-label').addEventListener('input', () => {
   if (selectedConnection) {
      const value = document.getElementById('prop-conn-label').value.trim();

      const labelOverlay = selectedConnection.getOverlay('labelOverlay');

      if (value === '') {
         // 빈 값이면 → labelOverlay가 있으면 삭제
         if (labelOverlay) {
            selectedConnection.removeOverlay('labelOverlay');
         }
      } else {
         // 값이 있으면 → 없으면 추가, 있으면 업데이트
         let overlay = labelOverlay;
         if (!overlay) {
            overlay = selectedConnection.addOverlay(
               makeLabelOverlay(value, '')
            );
            // ⭐⭐ 추가한 경우 → 위치 옮기기
            if (overlay && overlay.canvas) {
               const connSvg = selectedConnection.getConnector().canvas;
               const labelEl = overlay.canvas;

               // connSvg 다음으로 이동
               connSvg.parentNode.insertBefore(labelEl, connSvg.nextSibling);
            }
         } else {
            overlay.setLabel(value);
         }
      }
   }
});

document
   .getElementById('prop-conn-label-type')
   .addEventListener('change', () => {
      if (selectedConnection) {
         const labelOverlay = selectedConnection.getOverlay('labelOverlay');
         if (labelOverlay) {
            const canvas = labelOverlay.canvas;
            // 기존 label-xxx class 제거
            canvas.classList.forEach((cls) => {
               if (cls.startsWith('label-')) {
                  canvas.classList.remove(cls);
               }
            });

            const newType = document.getElementById(
               'prop-conn-label-type'
            ).value;
            if (newType) {
               canvas.classList.add(`label-${newType}`);
            }
         }
      }
   });

// 유틸: RGB → HEX 변환
function rgbToHex(rgb) {
   try {
      if (!rgb || rgb === 'transparent') return '#ffffff';
      const result = rgb.match(/\d+/g);
      if (!result || result.length < 3) return '#ffffff';
      return (
         '#' +
         result
            .slice(0, 3)
            .map((x) => Number(x).toString(16).padStart(2, '0'))
            .join('')
      );
   } catch (e) {
      console.log(e);
   }
}

function showEndpoint() {
   const points = document.querySelectorAll('.jtk-endpoint');
   if (points[0].classList.contains('show')) {
      points.forEach((point) => {
         point.classList.remove('show');
      });
   } else {
      points.forEach((point) => {
         point.classList.add('show');
      });
   }
}

function exportToJson() {
   const nodeElements = document.querySelectorAll('#canvas .flow-node');
   const nodes = Array.from(nodeElements).map((nodeEl) => {
      const rect = nodeEl.getBoundingClientRect();
      const canvasRect = document
         .getElementById('canvas')
         .getBoundingClientRect();

      return {
         id: nodeEl.id,
         type: nodeEl.classList.contains('diamond') ? 'diamond' : 'square',
         x: rect.left - canvasRect.left,
         y: rect.top - canvasRect.top,
         width: parseInt(nodeEl.style.width),
         height: parseInt(nodeEl.style.height),
         backgroundColor: rgbToHex(nodeEl.style.backgroundColor),
         color: rgbToHex(nodeEl.style.color),
         fontSize: parseInt(nodeEl.style.fontSize),
         fontWeight: parseInt(nodeEl.style.fontWeight),
         borderColor: rgbToHex(nodeEl.style.borderColor),
         borderRadius: parseInt(nodeEl.style.borderRadius),
         label: nodeEl.querySelector('span')?.innerHTML || '',
      };
   });

   const connections = instance.getAllConnections().map((conn) => {
      return {
         source: conn.sourceId,
         target: conn.targetId,
         anchors: [
            conn.endpoints[0]?.anchor?.type || 'Continuous',
            conn.endpoints[1]?.anchor?.type || 'Continuous',
         ],
         type: '', // 필요한 경우 type 추가
         label: conn.getOverlay('labelOverlay')?.getLabel() || '',
         labelType:
            conn
               .getOverlay('labelOverlay')
               ?.canvas?.classList?.value?.split(' ')
               ?.find((cls) => cls.startsWith('label-'))
               ?.replace('label-', '') || '', // ⭐⭐⭐ 여기 추가
      };
   });

   const exportData = {
      nodes: nodes,
      connections: connections,
   };

   const jsonString = JSON.stringify(exportData, null, 2);

   document.getElementById('outputJSON').innerText = jsonString;
}

function renderCanvas2() {
   const jsonText = document.getElementById('outputJSON').innerText;
   if (!jsonText) {
      alert('먼저 JSON을 export 하세요!');
      return;
   }

   const exportData = JSON.parse(jsonText);

   // canvas2 초기화
   const canvas2 = document.getElementById('canvas2');

   // my-svg-layer2 보존 후 → 나머지만 초기화
   const svgLayer = document.getElementById('my-svg-layer2');
   const children = Array.from(canvas2.children);

   children.forEach((child) => {
      if (child !== svgLayer) {
         canvas2.removeChild(child);
      }
   });

   // 나머지 스타일 유지
   canvas2.style.position = 'relative';
   canvas2.style.width = '1000px';
   canvas2.style.height = '1000px';
   canvas2.style.border = '1px solid #ccc';

   canvas2.innerHTML = '';
   canvas2.style.position = 'relative';
   canvas2.style.width = '1000px';
   canvas2.style.height = '1000px';
   canvas2.style.border = '1px solid #ccc';

   // 새 jsPlumb instance
   const newInstance = jsPlumb.getInstance({
      connector: ['Flowchart', { cornerRadius: 5 }],
      PaintStyle: { stroke: '#999', strokeWidth: 1 },
      Endpoint: 'Dot',
      EndpointStyle: {
         fill: '#3498db',
         radius: 4,
         strokeWidth: 2,
         stroke: '#ffffff',
      },
      Container: canvas2,
   });

   newInstance.bind('connection', (info, originalEvent) => {
      if (!info.connection.getOverlay('arrowOverlay')) {
         info.connection.addOverlay(defaultArrowOverlay);
      }
   });

   // 노드 그리기
   exportData.nodes.forEach((node) => {
      const div = document.createElement('div');
      div.id = node.id + '_copy';
      div.style.position = 'absolute';
      div.style.left = node.x + 'px';
      div.style.top = node.y + 'px';
      div.style.width = node.width + 'px';
      div.style.height = node.height + 'px';
      div.style.backgroundColor =
         node.backgroundColor === 'transparent'
            ? node.backgroundColor
            : '#' + node.backgroundColor.replace('#', '');
      div.style.color =
         node.color === 'transparent'
            ? node.color
            : '#' + node.color.replace('#', '');
      div.style.fontSize = node.fontSize + 'px';
      div.style.fontWeight = node.fontWeight;
      div.style.borderColor =
         node.borderColor === 'transparent'
            ? node.borderColor
            : '#' + node.borderColor.replace('#', '');
      div.style.borderRadius = node.borderRadius + 'px';
      div.classList.add('flow-node');
      if (node.type == 'diamond') div.classList.add('diamond');

      const span = document.createElement('span');
      span.innerHTML = node.label;
      div.appendChild(span);

      canvas2.appendChild(div);

      newInstance.draggable(div, { grid: [5, 5] });

      // endpoint 추가
      const anchors = ['Top', 'Right', 'Bottom', 'Left'];
      anchors.forEach((anchor) => {
         newInstance.addEndpoint(div.id, {
            anchor: anchor,
            uuid: `${div.id}-${anchor}`,
            isSource: true,
            isTarget: true,
            maxConnections: -1,
            endpoint: 'Dot',
            paintStyle: {
               fill: '#3498db',
               radius: 4,
               strokeWidth: 2,
               stroke: '#ffffff',
            },
            connector: ['Flowchart', { cornerRadius: 5 }],
         });
      });
   });

   // 연결 그리기
   exportData.connections.forEach((conn) => {
      newInstance.connect({
         source: conn.source + '_copy',
         target: conn.target + '_copy',
         anchors: conn.anchors || ['Continuous', 'Continuous'],
         connector: ['Flowchart', { cornerRadius: 5 }],
         paintStyle: { stroke: '#999', strokeWidth: 1 },
         overlays: [
            defaultArrowOverlay,
            ...(conn.label
               ? [makeLabelOverlay(conn.label, conn.labelType)]
               : []),
         ],
      });
   });

   newInstance.repaintEverything();
}
function addBaseNode() {
   const newNode = {
      id: `new-node-${Date.now()}`,
      type: 'squre',
      x: 20, // ← 고정 위치 (왼쪽에서 20px)
      y: 20, // ← 고정 위치 (위에서 20px)
      width: 140,
      height: 30,
      label: '노드',
   };

   createNodeElement(newNode);
}
function addBgAndHitPath(connection) {
   const connSvg = connection.getConnector().canvas;

   // ⭐ SVG 에 pointer-events 보장
   connSvg.setAttribute('pointer-events', 'auto');

   const pathEl = connSvg.querySelector('path');

   if (pathEl && !connSvg.querySelector('path.bg-path')) {
      const d = pathEl.getAttribute('d');

      const bgPath = document.createElementNS(
         'http://www.w3.org/2000/svg',
         'path'
      );
      bgPath.setAttribute('d', d);
      bgPath.setAttribute('stroke', 'white');
      bgPath.setAttribute('stroke-width', '5');
      bgPath.setAttribute('fill', 'none');
      bgPath.classList.add('bg-path');

      connSvg.insertBefore(bgPath, pathEl);

      const hitPath = document.createElementNS(
         'http://www.w3.org/2000/svg',
         'path'
      );
      hitPath.setAttribute('d', d);
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '10');
      hitPath.setAttribute('fill', 'none');
      hitPath.classList.add('hit-path');
      hitPath.setAttribute('pointer-events', 'stroke');

      hitPath.addEventListener('click', (e) => {
         e.stopPropagation();
         selectConnection(connection);
      });

      connSvg.insertBefore(hitPath, bgPath);
   }
}

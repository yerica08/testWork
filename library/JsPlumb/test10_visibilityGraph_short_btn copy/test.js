const elk = new ELK();
let instance; // ⭐ 전역으로 선언
let nodeCounter = 22; // 노드 ID 중복 방지용
let selectedNode = null; // ⭐ 현재 선택된 노드

fetch('demo.json')
   .then((response) => response.json())
   .then((data) => {
      instance = jsPlumb.getInstance({
         connector: ['Flowchart', { cornerRadius: 5 }],
         PaintStyle: { stroke: '#999', strokeWidth: 1 },
         Endpoint: ['Dot', { radius: 4 }],
         EndpointStyle: { fill: '#999', radius: 3 },
         Container: 'canvas',
      });

      // ⭐ 노드 먼저 생성
      data.nodes.forEach((node) => {
         createNodeElement(node);
      });

      // ⭐⭐⭐ 안전하게 레이아웃 호출 (DOM + endpoint 등록 보장)
      requestAnimationFrame(() => {
         doLayout(data);
      });
   });

function doLayout(data) {
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
      instance.repaintEverything();

      const nodes = Array.from(document.querySelectorAll('.flow-node'));
      const obstacles = getObstacles(nodes);

      // ⭐⭐⭐ 기존 graph.edges 순회 부분 여기 복붙
      graph.edges.forEach((edge) => {
         // ⭐⭐⭐ 너가 작성한 기존 연결 로직 그대로 유지
         // sourceUUID, targetUUID → getEndpoint → connect 부분 그대로
         // ...
         // 기존 연결 코드 여기에 그대로 넣으면 됨
      });

      instance.repaintEverything();
   });
}

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
   const safeDivId = safeId(node.id);
   div.id = safeDivId;
   div.className = node.type;
   div.style.position = 'absolute';
   div.style.left = node.x + 'px';
   div.style.top = node.y + 'px';
   div.style.width = node.width + 'px';
   div.style.height = node.height + 'px';
   div.classList.add('flow-node');

   const span = document.createElement('span');
   span.innerText = node.label || '';
   div.appendChild(span);

   div.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(div);
   });

   document.getElementById('canvas').appendChild(div);

   instance.draggable(div, {
      grid: [5, 5],
   });

   // ⭐ 가짜 endpoint 4개 (div) 추가
   const anchors = ['Top', 'Bottom', 'Left', 'Right'];
   anchors.forEach((anchor) => {
      const epDiv = document.createElement('div');
      epDiv.className = `my-endpoint my-endpoint-${anchor} endpoint-of-${safeDivId}`;
      epDiv.dataset.anchor = anchor;

      // 위치 잡기
      epDiv.style.position = 'absolute';
      epDiv.style.width = '10px';
      epDiv.style.height = '10px';
      epDiv.style.background = '#3498db';
      epDiv.style.border = '2px solid #fff';
      epDiv.style.borderRadius = '50%';
      epDiv.style.cursor = 'pointer';
      epDiv.style.zIndex = '10';

      switch (anchor) {
         case 'Top':
            epDiv.style.left = '50%';
            epDiv.style.top = '0';
            epDiv.style.transform = 'translate(-50%, -50%)';
            break;
         case 'Bottom':
            epDiv.style.left = '50%';
            epDiv.style.bottom = '0';
            epDiv.style.transform = 'translate(-50%, 50%)';
            break;
         case 'Left':
            epDiv.style.left = '0';
            epDiv.style.top = '50%';
            epDiv.style.transform = 'translate(-50%, -50%)';
            break;
         case 'Right':
            epDiv.style.right = '0';
            epDiv.style.top = '50%';
            epDiv.style.transform = 'translate(50%, -50%)';
            break;
      }

      div.appendChild(epDiv);

      const normAnchor = normalizeAnchor(anchor);

      const epId = `${safeDivId}-${normAnchor}`;

      instance.makeSource(div, {
         filter: `.my-endpoint-${normAnchor}`,
         anchor: normAnchor,
         uuid: epId,
         isSource: true,
         maxConnections: -1,
         connector: ['Flowchart', { cornerRadius: 5 }],
         paintStyle: { stroke: 'gray', strokeWidth: 2 },
      });

      instance.makeTarget(div, {
         filter: `.my-endpoint-${normAnchor}`,
         anchor: normAnchor,
         uuid: epId, // ⭐⭐⭐ 꼭 추가
         allowLoopback: false,
      });
   });
}

function addNode(type) {
   const newNode = {
      id: `new-node-${Date.now()}-${nodeCounter++}`,
      type: type,
      x: 20, // ← 고정 위치 (왼쪽에서 20px)
      y: 20, // ← 고정 위치 (위에서 20px)
      width: 140,
      height: 50,
      label: type + ' 노드',
   };

   // 타입별 크기 예외 처리
   if (type === 'ellipse') {
      newNode.width = 120;
      newNode.height = 60;
   } else if (type === 'diamond') {
      newNode.width = 150;
      newNode.height = 80;
   }

   createNodeElement(newNode);
}

function selectNode(nodeEl) {
   // 이전 선택 노드 있으면 class 제거
   if (selectedNode) {
      selectedNode.classList.remove('selected-node');
   }

   // 새 노드 선택
   selectedNode = nodeEl;
   selectedNode.classList.add('selected-node'); // ⭐ 초록색 border 적용

   // 속성 패널 표시
   document.getElementById('property-panel').style.display = 'block';

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
   }
});
document.getElementById('prop-height').addEventListener('input', () => {
   if (selectedNode) {
      selectedNode.style.height =
         document.getElementById('prop-height').value + 'px';
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

// 유틸: RGB → HEX 변환
function rgbToHex(rgb) {
   if (!rgb) return '#ffffff';
   const result = rgb.match(/\d+/g);
   if (!result) return '#ffffff';
   return (
      '#' +
      result
         .slice(0, 3)
         .map((x) => parseInt(x).toString(16).padStart(2, '0'))
         .join('')
   );
}
function safeId(id) {
   return id.replace(/\s+/g, '_').replace(/[^\w\-]/g, '_');
}
function normalizeAnchor(anchor) {
   // 항상 첫글자 대문자, 나머지 소문자
   return anchor.charAt(0).toUpperCase() + anchor.slice(1).toLowerCase();
}

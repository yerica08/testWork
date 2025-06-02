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
         div.style.width = node.width + 'px';
         div.style.height = node.height + 'px';
         div.classList.add('flow-node');

         div.innerHTML =
            node.type === 'diamond' ? `<span>${node.label}</span>` : node.label;

         document.getElementById('canvas').appendChild(div);

         instance.draggable(div, {
            grid: [10, 10],
         });
      });

      // ⭐ dynamic spacing + 방향 자동
      const nodeCount = data.nodes.length;
      const connectionCount = data.connections.length;
      const avgDegree = connectionCount / nodeCount;

      // in/out-degree 계산
      const inDegreeMap = new Map();
      const outDegreeMap = new Map();
      data.nodes.forEach((n) => {
         inDegreeMap.set(n.id, 0);
         outDegreeMap.set(n.id, 0);
      });
      data.connections.forEach((conn) => {
         outDegreeMap.set(
            conn.source,
            (outDegreeMap.get(conn.source) || 0) + 1
         );
         inDegreeMap.set(conn.target, (inDegreeMap.get(conn.target) || 0) + 1);
      });

      const avgInDegree =
         [...inDegreeMap.values()].reduce((sum, val) => sum + val, 0) /
         nodeCount;
      const avgOutDegree =
         [...outDegreeMap.values()].reduce((sum, val) => sum + val, 0) /
         nodeCount;

      // depth 추정
      function estimateDepth() {
         const visited = new Set();
         let maxDepth = 0;
         function dfs(nodeId, depth) {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            maxDepth = Math.max(maxDepth, depth);
            data.connections
               .filter((conn) => conn.source === nodeId)
               .forEach((conn) => {
                  dfs(conn.target, depth + 1);
               });
         }
         data.nodes.forEach((node) => {
            if ((inDegreeMap.get(node.id) || 0) === 0) {
               dfs(node.id, 1);
            }
         });
         return maxDepth;
      }
      const estimatedDepth = estimateDepth();

      // branchScore 계산
      const branchNodes = [...outDegreeMap.entries()].filter(
         ([id, out]) => out >= 2
      ).length;
      const branchScore = branchNodes / nodeCount;

      console.log(`BranchScore: ${branchScore.toFixed(2)}`);

      // ⭐ 그룹 후보 찾기
      const groupCandidates = [...outDegreeMap.entries()]
         .filter(([id, out]) => out >= 2)
         .map(([id]) => id);

      console.log('자동 그룹 후보:', groupCandidates);

      // ⭐ getDescendants 함수
      function getDescendants(rootId, connections) {
         const childMap = new Map();
         connections.forEach((conn) => {
            if (!childMap.has(conn.source)) {
               childMap.set(conn.source, []);
            }
            childMap.get(conn.source).push(conn.target);
         });

         const descendants = new Set();

         function dfs(nodeId) {
            const children = childMap.get(nodeId) || [];
            children.forEach((child) => {
               if (!descendants.has(child)) {
                  descendants.add(child);
                  dfs(child);
               }
            });
         }

         dfs(rootId);

         return Array.from(descendants);
      }

      // ⭐ 그룹 자식 수 기반 largeGroup 체크
      const largeGroupThreshold = 3; // 자식 ≥ 3 → LR 추천
      const largeGroups = groupCandidates.filter((groupId) => {
         const childCount = getDescendants(groupId, data.connections).length;
         console.log(`Group "${groupId}" 자식 수: ${childCount}`);
         return childCount >= largeGroupThreshold;
      });

      console.log('Large Groups:', largeGroups);

      // ⭐ rankdir 최종 결정
      let rankdir = 'TB'; // 기본값 LR

      if (largeGroups.length > 0) {
         console.log('큰 그룹 감지됨 → LR 강제 적용!');
         rankdir = 'LR';
      } else if (estimatedDepth >= 4 || branchScore >= 0.3) {
         rankdir = 'TB';
      } else if (avgOutDegree >= 2 && estimatedDepth <= 2) {
         rankdir = 'LR';
      } else if (avgInDegree > avgOutDegree && estimatedDepth >= 3) {
         rankdir = 'TB';
      } else if (avgDegree < 1) {
         rankdir = 'TB';
      } else {
         rankdir = 'TB';
      }

      // ⭐ canvas 크기 측정 → spacing 자동 조정
      const canvas = document.getElementById('canvas');
      const canvasRect = canvas.getBoundingClientRect();
      const canvasWidth = canvasRect.width;
      const canvasHeight = canvasRect.height;

      console.log(`Canvas 크기: ${canvasWidth} x ${canvasHeight}`);

      let dynamicNodesep = Math.max(
         30,
         (data.nodes.reduce((sum, n) => sum + n.label.length, 0) /
            data.nodes.length) *
            5
      );
      let dynamicRanksep = Math.max(50, connectionCount * 2);

      const narrowWidthThreshold = 800;

      if (canvasWidth < narrowWidthThreshold) {
         console.log('좁은 canvas 감지됨 → spacing 축소');
         dynamicNodesep *= 0.7;
         dynamicRanksep *= 0.7;
      } else {
         console.log('넓은 canvas → 기본 spacing 사용');
      }

      if (rankdir === 'TB') {
         dynamicRanksep *= 1.5;
         dynamicNodesep = Math.max(
            30,
            (data.nodes.reduce((sum, n) => sum + n.label.length, 0) /
               data.nodes.length) *
               3
         );
      }

      console.log(
         `최종 Rankdir=${rankdir}, Nodesep=${dynamicNodesep}, Ranksep=${dynamicRanksep}`
      );

      // ⭐ dagre.js 레이아웃 (compound graph!)
      const g = new dagre.graphlib.Graph({ compound: true });
      g.setGraph({
         rankdir: rankdir,
         nodesep: dynamicNodesep,
         ranksep: dynamicRanksep,
         marginx: 20,
         marginy: 20,
      });
      g.setDefaultEdgeLabel(() => ({}));

      // 노드 등록
      data.nodes.forEach((node) => {
         g.setNode(node.id, { width: node.width, height: node.height });
      });

      // ⭐ 자동 그룹 노드 등록 + 자동 그룹핑 적용
      groupCandidates.forEach((groupId) => {
         const groupNodeId = groupId + '_그룹';
         g.setNode(groupNodeId, { width: 10, height: 10, isGroup: true });

         const childList = getDescendants(groupId, data.connections);

         childList.forEach((childId) => {
            g.setParent(childId, groupNodeId);
         });
      });

      // connections 등록
      data.connections.forEach((conn) => {
         g.setEdge(conn.source, conn.target);
      });

      dagre.layout(g);

      // ⭐ 노드 위치 반영
      g.nodes().forEach((id) => {
         const node = g.node(id);

         // 그룹 노드는 skip
         if (node.isGroup) return;

         const div = document.getElementById(id);
         if (div) {
            div.style.left = `${node.x - node.width / 2}px`;
            div.style.top = `${node.y - node.height / 2}px`;
         } else {
            console.warn(`⚠️ DOM not found for node.id=${id}`);
         }
      });

      // ⭐ VG 준비
      const nodes = Array.from(document.querySelectorAll('.flow-node'));
      const obstacles = nodes.map((node) => node.getBoundingClientRect());
      const vertices = extractVertices(nodes);

      data.connections.forEach((edge) => {
         const sourceEl = document
            .getElementById(edge.source)
            .getBoundingClientRect();
         const targetEl = document
            .getElementById(edge.target)
            .getBoundingClientRect();

         const sourceVertex = {
            x: sourceEl.left + sourceEl.width / 2,
            y: sourceEl.top + sourceEl.height / 2,
         };

         const targetVertex = {
            x: targetEl.left + targetEl.width / 2,
            y: targetEl.top + targetEl.height / 2,
         };

         const allVertices = [...vertices, sourceVertex, targetVertex];
         const visibilityEdges = computeVisibilityEdges(allVertices, obstacles);

         const path = dijkstra(
            allVertices,
            visibilityEdges,
            sourceVertex,
            targetVertex
         );

         if (path.length > 0) {
            const waypoints = pathToWaypointsVG(path, edge.source, edge.target);

            let prev = edge.source;
            waypoints.forEach((wp) => {
               instance.connect({
                  source: prev,
                  target: wp.id,
                  anchors: ['Continuous', 'Continuous'],
                  connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
                  paintStyle: { stroke: '#999', strokeWidth: 1 },
                  overlays: [['Arrow', { width: 7, length: 8, location: 1 }]],
               });
               prev = wp.id;
            });

            instance.connect({
               source: prev,
               target: edge.target,
               anchors: ['Continuous', 'Continuous'],
               connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
               paintStyle: { stroke: '#999', strokeWidth: 1 },
               overlays: [['Arrow', { width: 7, length: 8, location: 1 }]],
            });
         }
      });

      instance.repaintEverything();

      // ⭐ VG utils

      function extractVertices(nodes) {
         const vertices = [];

         nodes.forEach((node) => {
            const box = node.getBoundingClientRect();

            vertices.push({ x: box.left, y: box.top });
            vertices.push({ x: box.left + box.width, y: box.top });
            vertices.push({ x: box.left, y: box.top + box.height });
            vertices.push({ x: box.left + box.width, y: box.top + box.height });
         });

         return vertices;
      }

      function computeVisibilityEdges(vertices, obstacles) {
         const edges = [];

         vertices.forEach((v1, i) => {
            vertices.forEach((v2, j) => {
               if (i === j) return;

               if (!intersectsAnyObstacle(v1, v2, obstacles)) {
                  edges.push({ from: v1, to: v2 });
               }
            });
         });

         return edges;
      }

      function intersectsAnyObstacle(p1, p2, obstacles) {
         for (const box of obstacles) {
            if (lineIntersectsBox(p1, p2, box)) return true;
         }
         return false;
      }

      function lineIntersectsBox(p1, p2, box) {
         const boxEdges = [
            [
               { x: box.left, y: box.top },
               { x: box.left + box.width, y: box.top },
            ],
            [
               { x: box.left + box.width, y: box.top },
               { x: box.left + box.width, y: box.top + box.height },
            ],
            [
               { x: box.left + box.width, y: box.top + box.height },
               { x: box.left, y: box.top + box.height },
            ],
            [
               { x: box.left, y: box.top + box.height },
               { x: box.left, y: box.top },
            ],
         ];

         for (const edge of boxEdges) {
            if (linesIntersect(p1, p2, edge[0], edge[1])) {
               return true;
            }
         }

         return false;
      }

      function linesIntersect(p1, p2, q1, q2) {
         const ccw = (a, b, c) =>
            (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);

         return (
            ccw(p1, q1, q2) !== ccw(p2, q1, q2) &&
            ccw(p1, p2, q1) !== ccw(p1, p2, q2)
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

      function pathToWaypointsVG(path, sourceId, targetId) {
         const waypoints = [];
         path.forEach((p, idx) => {
            if (idx === 0 || idx === path.length - 1) return;

            const waypointId = `vg-waypoint-${sourceId}-${targetId}-${Date.now()}-${Math.random()}`;
            const waypoint = document.createElement('div');
            waypoint.id = waypointId;
            waypoint.style.position = 'absolute';
            waypoint.style.left = `${p.x}px`;
            waypoint.style.top = `${p.y}px`;
            waypoint.style.width = '10px';
            waypoint.style.height = '10px';
            waypoint.style.background = 'transparent';
            waypoint.style.zIndex = '1';

            document.getElementById('canvas').appendChild(waypoint);

            waypoints.push({
               id: waypointId,
               sourceId,
               targetId,
            });
         });

         return waypoints;
      }
   });

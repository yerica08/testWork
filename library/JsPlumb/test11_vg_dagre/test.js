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

      // ⭐ 노드 생성 (left/top X)
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

      // ⭐ dagre.js 레이아웃 설정
      const g = new dagre.graphlib.Graph();
      g.setGraph({
         rankdir: 'LR', // 방향: LR(좌우) / TB(상하)
         nodesep: 10,
         ranksep: 100,
         marginx: 20,
         marginy: 20,
      });
      g.setDefaultEdgeLabel(() => ({}));

      data.nodes.forEach((node) => {
         g.setNode(node.id, { width: node.width, height: node.height });
      });

      data.connections.forEach((conn) => {
         g.setEdge(conn.source, conn.target);
      });

      dagre.layout(g);

      // ⭐ 노드 위치 반영
      g.nodes().forEach((id) => {
         const node = g.node(id);
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

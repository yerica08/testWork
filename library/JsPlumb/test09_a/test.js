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
            grid: [10, 10],
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
         })),
      };

      elk.layout(elkGraph).then((graph) => {
         console.log('ELK layout complete');

         // ⭐ Grid 준비
         const canvas = document.getElementById('canvas');
         const canvasRect = canvas.getBoundingClientRect();
         const nodes = Array.from(document.querySelectorAll('.flow-node'));
         const { grid, cols, rows } = createGrid(
            canvasRect.width,
            canvasRect.height,
            nodes
         );

         // ⭐ 연결
         graph.edges.forEach((edge) => {
            const clamp = (value, min, max) =>
               Math.max(min, Math.min(max, value));
            const sourceEl = document
               .getElementById(edge.sources[0])
               .getBoundingClientRect();
            const targetEl = document
               .getElementById(edge.targets[0])
               .getBoundingClientRect();

            const start = {
               x: clamp(
                  Math.floor((sourceEl.left + sourceEl.width / 2) / GRID_SIZE),
                  0,
                  cols - 1
               ),
               y: clamp(
                  Math.floor((sourceEl.top + sourceEl.height / 2) / GRID_SIZE),
                  0,
                  rows - 1
               ),
            };

            const end = {
               x: clamp(
                  Math.floor((targetEl.left + targetEl.width / 2) / GRID_SIZE),
                  0,
                  cols - 1
               ),
               y: clamp(
                  Math.floor((targetEl.top + targetEl.height / 2) / GRID_SIZE),
                  0,
                  rows - 1
               ),
            };

            const path = aStar(grid, start, end, cols, rows);

            if (path.length > 0) {
               const waypoints = pathToWaypoints(
                  path,
                  edge.sources[0],
                  edge.targets[0]
               );

               // 연결
               let prev = edge.sources[0];
               waypoints.forEach((wp) => {
                  instance.connect({
                     source: prev,
                     target: wp.id,
                     anchors: ['Continuous', 'Continuous'],
                     connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
                     paintStyle: { stroke: '#999', strokeWidth: 1 },
                     overlays: [
                        ['Arrow', { width: 7, length: 8, location: 1 }],
                     ],
                  });
                  prev = wp.id;
               });

               instance.connect({
                  source: prev,
                  target: edge.targets[0],
                  anchors: ['Continuous', 'Continuous'],
                  connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
                  paintStyle: { stroke: '#999', strokeWidth: 1 },
                  overlays: [['Arrow', { width: 7, length: 8, location: 1 }]],
               });
            } else {
               // fallback → 직선 연결
               instance.connect({
                  source: edge.sources[0],
                  target: edge.targets[0],
                  anchors: ['Continuous', 'Continuous'],
                  connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
                  paintStyle: { stroke: '#999', strokeWidth: 1 },
                  overlays: [['Arrow', { width: 7, length: 8, location: 1 }]],
               });
            }
         });

         instance.repaintEverything();
      });

      // ⭐ Grid 생성
      const GRID_SIZE = 20;

      function createGrid(canvasWidth, canvasHeight, nodes) {
         const cols = Math.ceil(canvasWidth / GRID_SIZE);
         const rows = Math.ceil(canvasHeight / GRID_SIZE);

         const grid = new Array(rows)
            .fill(0)
            .map(() => new Array(cols).fill(0)); // 0: free, 1: blocked

         nodes.forEach((node) => {
            const box = node.getBoundingClientRect();
            const left = Math.floor(box.left / GRID_SIZE);
            const right = Math.floor((box.left + box.width) / GRID_SIZE);
            const top = Math.floor(box.top / GRID_SIZE);
            const bottom = Math.floor((box.top + box.height) / GRID_SIZE);

            for (let y = top; y <= bottom; y++) {
               for (let x = left; x <= right; x++) {
                  if (y >= 0 && y < rows && x >= 0 && x < cols) {
                     grid[y][x] = 1; // blocked
                  }
               }
            }
         });

         return { grid, cols, rows };
      }

      // ⭐ A* 알고리즘
      function aStar(grid, start, end, cols, rows) {
         const openSet = [];
         const cameFrom = {};
         const gScore = {};
         const fScore = {};

         const key = (p) => `${p.x},${p.y}`;

         openSet.push(start);
         gScore[key(start)] = 0;
         fScore[key(start)] = heuristic(start, end);

         while (openSet.length > 0) {
            openSet.sort(
               (a, b) =>
                  (fScore[key(a)] || Infinity) - (fScore[key(b)] || Infinity)
            );
            const current = openSet.shift();

            if (current.x === end.x && current.y === end.y) {
               return reconstructPath(cameFrom, current);
            }

            const neighbors = getNeighbors(current, cols, rows);
            neighbors.forEach((neighbor) => {
               if (grid[neighbor.y][neighbor.x] === 1) return; // blocked

               const tentativeG = (gScore[key(current)] || Infinity) + 1;

               if (tentativeG < (gScore[key(neighbor)] || Infinity)) {
                  cameFrom[key(neighbor)] = current;
                  gScore[key(neighbor)] = tentativeG;
                  fScore[key(neighbor)] = tentativeG + heuristic(neighbor, end);

                  if (
                     !openSet.find(
                        (p) => p.x === neighbor.x && p.y === neighbor.y
                     )
                  ) {
                     openSet.push(neighbor);
                  }
               }
            });
         }

         return []; // no path
      }

      function heuristic(a, b) {
         return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan distance
      }

      function getNeighbors(p, cols, rows) {
         const neighbors = [];
         if (p.x > 0) neighbors.push({ x: p.x - 1, y: p.y });
         if (p.x < cols - 1) neighbors.push({ x: p.x + 1, y: p.y });
         if (p.y > 0) neighbors.push({ x: p.x, y: p.y - 1 });
         if (p.y < rows - 1) neighbors.push({ x: p.x, y: p.y + 1 });
         return neighbors;
      }

      function reconstructPath(cameFrom, current) {
         const path = [current];
         const key = (p) => `${p.x},${p.y}`;
         while (cameFrom[key(current)]) {
            current = cameFrom[key(current)];
            path.unshift(current);
         }
         return path;
      }

      // ⭐ Path → Waypoints
      function pathToWaypoints(path, sourceId, targetId) {
         const waypoints = [];
         path.forEach((p, idx) => {
            // 첫 점과 마지막 점은 source/target → 제외
            if (idx === 0 || idx === path.length - 1) return;

            const x = p.x * GRID_SIZE + GRID_SIZE / 2;
            const y = p.y * GRID_SIZE + GRID_SIZE / 2;

            const waypointId = `waypoint-${sourceId}-${targetId}-${Date.now()}-${Math.random()}`;
            const waypoint = document.createElement('div');
            waypoint.id = waypointId;
            waypoint.style.position = 'absolute';
            waypoint.style.left = `${x}px`;
            waypoint.style.top = `${y}px`;
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

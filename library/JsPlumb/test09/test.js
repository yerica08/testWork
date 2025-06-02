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

         const anchors = [
            { anchor: 'Top', class: 'my-endpoint-top' },
            { anchor: 'Bottom', class: 'my-endpoint-bottom' },
            { anchor: 'Left', class: 'my-endpoint-left' },
            { anchor: 'Right', class: 'my-endpoint-right' },
         ];

         anchors.forEach((a) => {
            const ep = document.createElement('div');
            ep.className = `my-endpoint ${a.class} endpoint-of-${node.id}`;
            ep.dataset.anchor = a.anchor;
            div.appendChild(ep);

            instance.makeSource(div, {
               filter: `.${a.class}`,
               anchor: a.anchor,
               connector: ['Flowchart', { cornerRadius: 5 }],
               connectorStyle: { stroke: '#999', strokeWidth: 1 },
               maxConnections: -1,
               parameters: { anchorName: a.anchor },
            });

            instance.makeTarget(div, {
               filter: `.${a.class}`,
               anchor: a.anchor,
               allowLoopback: false,
               parameters: { anchorName: a.anchor },
            });
         });

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

         // ⭐ 전체 waypoint 미리 계산
         const allWaypoints = [];

         graph.edges.forEach((edge) => {
            const waypointPath = computeWaypoints(
               edge.sources[0],
               edge.targets[0]
            );
            if (waypointPath && waypointPath.length > 0) {
               waypointPath.forEach((wp) => allWaypoints.push(wp));
            }
         });

         // ⭐ 연결 수행
         graph.edges.forEach((edge) => {
            const waypointsForEdge = allWaypoints.filter(
               (wp) =>
                  wp.sourceId === edge.sources[0] &&
                  wp.targetId === edge.targets[0]
            );

            if (waypointsForEdge.length > 0) {
               // 다중 waypoint 연결
               let prev = edge.sources[0];
               waypointsForEdge.forEach((wp) => {
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

               // 마지막 waypoint → target
               instance.connect({
                  source: prev,
                  target: edge.targets[0],
                  anchors: ['Continuous', 'Continuous'],
                  connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
                  paintStyle: { stroke: '#999', strokeWidth: 1 },
                  overlays: [['Arrow', { width: 7, length: 8, location: 1 }]],
               });
            } else {
               // 직접 연결
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

      // ⭐ waypoint 계산 함수
      function computeWaypoints(sourceId, targetId) {
         const sourceEl = document
            .getElementById(sourceId)
            .getBoundingClientRect();
         const targetEl = document
            .getElementById(targetId)
            .getBoundingClientRect();

         const startX = sourceEl.left + sourceEl.width / 2;
         const startY = sourceEl.top + sourceEl.height / 2;
         const endX = targetEl.left + targetEl.width / 2;
         const endY = targetEl.top + targetEl.height / 2;

         const nodes = Array.from(document.querySelectorAll('.flow-node'));

         // 먼저 "직선 경로" 충돌 검사
         let collision = false;
         for (const node of nodes) {
            if (node.id === sourceId || node.id === targetId) continue;

            const box = node.getBoundingClientRect();

            const minX = Math.min(startX, endX);
            const maxX = Math.max(startX, endX);
            const minY = Math.min(startY, endY);
            const maxY = Math.max(startY, endY);

            const boxLeft = box.left;
            const boxRight = box.left + box.width;
            const boxTop = box.top;
            const boxBottom = box.top + box.height;

            const intersectsX = !(maxX < boxLeft || minX > boxRight);
            const intersectsY = !(maxY < boxTop || minY > boxBottom);

            if (intersectsX && intersectsY) {
               collision = true;
               break;
            }
         }

         if (!collision) {
            return []; // 충돌 없음 → waypoint 필요 없음
         }

         // 🚀 회피 방향 자동 선택
         // 가장 빈 공간이 많은 방향으로 피하기 (상/하/좌/우 체크 가능)
         const offset = 80; // 얼마나 피할지
         const dx = endX - startX;
         const dy = endY - startY;

         let waypoints = [];

         // 예제: 단순한 ㄱ자 or ㄷ자 경로로 만들어줌
         if (Math.abs(dx) > Math.abs(dy)) {
            // 가로로 먼 경우 → 수평 → 수직 경로 (ㄱ자)
            const wp1 = createWaypoint(
               (startX + endX) / 2,
               startY - offset,
               sourceId,
               targetId
            );
            waypoints.push(wp1);

            const wp2 = createWaypoint(
               (startX + endX) / 2,
               endY,
               sourceId,
               targetId
            );
            waypoints.push(wp2);
         } else {
            // 세로로 먼 경우 → 수직 → 수평 경로 (ㄱ자)
            const wp1 = createWaypoint(
               startX - offset,
               (startY + endY) / 2,
               sourceId,
               targetId
            );
            waypoints.push(wp1);

            const wp2 = createWaypoint(
               endX,
               (startY + endY) / 2,
               sourceId,
               targetId
            );
            waypoints.push(wp2);
         }

         return waypoints;
      }

      // ⭐ waypoint 생성 함수
      function createWaypoint(x, y, sourceId, targetId) {
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

         return {
            id: waypointId,
            sourceId,
            targetId,
         };
      }
   });

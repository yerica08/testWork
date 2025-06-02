const elk = new ELK.default();

fetch('demo.json')
   .then((response) => response.json())
   .then((data) => {
      const instance = jsPlumb.getInstance({
         connector: ['Flowchart', { cornerRadius: 5 }],
         PaintStyle: { stroke: 'gray', strokeWidth: 2 },
         Endpoint: 'Dot',
         EndpointStyle: { fill: 'gray', radius: 3 },
         Container: 'canvas',
      });

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

         if (node.type === 'diamond') {
            div.innerHTML = `<span>${node.label}</span>`;
         } else {
            div.innerHTML = node.label;
         }

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
               connectorStyle: { stroke: 'gray', strokeWidth: 2 },
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

         div.addEventListener('mouseenter', () => {
            document
               .querySelectorAll(`.endpoint-of-${node.id}`)
               .forEach((ep) => {
                  ep.style.opacity = '1';
               });
         });

         div.addEventListener('mouseleave', () => {
            document
               .querySelectorAll(`.endpoint-of-${node.id}`)
               .forEach((ep) => {
                  ep.style.opacity = '0';
               });
         });

         document.getElementById('canvas').appendChild(div);

         // ⭐ 드래그 시 grid 적용
         // instance.draggable(div, {
         //    grid: [10, 10],
         // });
         instance.draggable(div);
      });

      // // 기존 연결 생성
      // data.connections.forEach((conn) => {
      //    const c = instance.connect({
      //       source: conn.source,
      //       target: conn.target,
      //       anchors: conn.anchors || ['Continuous', 'Continuous'],
      //       connector: ['Flowchart', { cornerRadius: 5 }],
      //    });

      //    c.addOverlay([
      //       'Arrow',
      //       {
      //          width: 7,
      //          length: 8,
      //          location: 1,
      //          foldback: 0.8,
      //       },
      //    ]);
      // });

      const elkGraph = {
         id: 'root',
         layoutOptions: {
            'elk.algorithm': 'layered', // layered = flowchart 스타일
            'elk.spacing.nodeNode': '12', // 노드 간격
            'elk.layered.nodePlacement.bk.fixedAlignment': 'CENTER', // ⭐ 추가!
            'elk.layered.considerModelOrder': 'true',
            'elk.layered.edgeRouting': 'ORTHOGONAL', // 직각 선 유지
            'elk.layered.crossingMinimization.strategy': 'INTERACTIVE', // 선 교차 최소화
            'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
         },
         children: data.nodes.map((node) => ({
            id: node.id,
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
         // 노드 위치 업데이트
         graph.children.forEach((node) => {
            const el = document.getElementById(node.id);
            el.style.left = `${node.x}px`;
            el.style.top = `${node.y}px`;
         });

         // 기존 jsPlumb 연결 그리기
         graph.edges.forEach((edge) => {
            const c = instance.connect({
               source: edge.sources[0],
               target: edge.targets[0],
               anchors: ['Continuous', 'Continuous'],
               connector: ['Flowchart', { cornerRadius: 5 }],
            });

            c.addOverlay([
               'Arrow',
               {
                  width: 7,
                  length: 8,
                  location: 1,
                  foldback: 0.8,
               },
            ]);
         });

         instance.repaintEverything();
      });

      // connection 이벤트에서 정확 anchors 적용
      instance.bind('connection', function (info) {
         setTimeout(() => {
            // ⭐ delete 없이 connector 업데이트
            info.connection.setConnector(['Flowchart', { cornerRadius: 5 }]);

            // ⭐ 화살표 Overlay 추가
            info.connection.addOverlay([
               'Arrow',
               {
                  width: 7,
                  length: 8,
                  location: 1,
                  foldback: 0.8,
               },
            ]);

            info.connection.repaint();
         }, 0);
      });

      instance.repaintEverything();

      // ⭐ Line Jump Loop 시작
      // startLineJumpLoop();
   });

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

      // 노드 생성
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

         // ⭐️ endpoint div 삽입
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

            // ⭐️ makeSource 등록
            instance.makeSource(div, {
               filter: `.${a.class}`,
               anchor: a.anchor,
               connector: ['Flowchart'],
               connectorStyle: { stroke: 'gray', strokeWidth: 2 },
               maxConnections: -1,
            });

            // ⭐️ makeTarget 등록
            instance.makeTarget(div, {
               filter: `.${a.class}`,
               anchor: a.anchor,
               allowLoopback: false,
            });
         });

         // ⭐️ hover 처리 (노드에 마우스 오버 시 endpoint 보이기)
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

         // 노드 추가
         document.getElementById('canvas').appendChild(div);

         instance.draggable(div); // 드래그 가능
      });

      // 기존 연결 생성
      data.connections.forEach((conn) => {
         const c = instance.connect({
            source: conn.source,
            target: conn.target,
            anchors: conn.anchors || ['Continuous', 'Continuous'],
            connector: ['Flowchart', { cornerRadius: 5 }],
         });

         // ⭐️ overlay 추가
         c.addOverlay([
            'Arrow',
            {
               width: 6,
               length: 8,
               location: 1,
               foldback: 0.8,
            },
         ]);
      });

      // ⭐️ 사용자 드래그로 새 연결 생성 시 overlay 자동 추가
      instance.bind('connection', function (info) {
         // ⭐️ 반드시 defer (paint cycle 이후에 overlay 추가)
         setTimeout(() => {
            info.connection.addOverlay([
               'Arrow',
               {
                  width: 6,
                  length: 8,
                  location: 1,
                  foldback: 0.8,
               },
            ]);

            // 확인용 log 찍어보기
            console.log(
               'Overlay added to connection:',
               info.connection.getOverlays()
            );
         }, 0);
      });
   });

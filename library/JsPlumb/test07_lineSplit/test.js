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
               connector: ['Flowchart'],
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
         instance.draggable(div, {
            grid: [24, 24],
         });
      });

      // 기존 연결 생성
      data.connections.forEach((conn) => {
         const c = instance.connect({
            source: conn.source,
            target: conn.target,
            anchors: conn.anchors || ['Continuous', 'Continuous'],
            connector: ['Flowchart', { cornerRadius: 5 }],
         });

         c.addOverlay([
            'Arrow',
            {
               width: 10,
               length: 14,
               location: 1,
               foldback: 0.8,
            },
         ]);
      });

      // 새 연결 시 → anchor 유지 + arrow 적용
      instance.bind('connection', function (info) {
         setTimeout(() => {
            const sourceAnchor =
               info.sourceEndpoint.anchor.type || 'Continuous';
            const targetAnchor =
               info.targetEndpoint.anchor.type || 'Continuous';

            info.connection.setAnchors([sourceAnchor, targetAnchor]);

            info.connection.addOverlay([
               'Arrow',
               {
                  width: 10,
                  length: 14,
                  location: 1,
                  foldback: 0.8,
               },
            ]);
         }, 0);
      });

      // ⭐ Line Jump Loop 시작
      startLineJumpLoop();
   });

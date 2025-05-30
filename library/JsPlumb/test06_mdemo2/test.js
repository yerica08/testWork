fetch('demo.json')
   .then((response) => response.json())
   .then((data) => {
      const instance = jsPlumb.getInstance({
         Endpoint: 'Dot',
         PaintStyle: { stroke: 'gray', strokeWidth: 2 },
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

         instance.draggable(div); // 드래그 가능
         // ★ Anchor 리스트
         const anchors = ['Top', 'Bottom', 'Left', 'Right'];

         anchors.forEach((anchorName) => {
            const endpoint = instance.addEndpoint(node.id, {
               anchor: anchorName,
               isSource: true,
               isTarget: true,
               cssClass: `endpoint-of-${node.id}`,
            });

            // ★ endpoint에도 hover 이벤트 추가
            endpoint.canvas.addEventListener('mouseenter', () => {
               document
                  .querySelectorAll(`.endpoint-of-${node.id}`)
                  .forEach((ep) => {
                     ep.style.opacity = '1';
                  });
            });

            endpoint.canvas.addEventListener('mouseleave', () => {
               document
                  .querySelectorAll(`.endpoint-of-${node.id}`)
                  .forEach((ep) => {
                     ep.style.opacity = '0';
                  });
            });
         });
      });

      // 연결 생성
      data.connections.forEach((conn) => {
         instance.connect({
            source: conn.source,
            target: conn.target,
            anchors: conn.anchors || ['Continuous', 'Continuous'],
            connector: ['Flowchart', { cornerRadius: 5 }],
            overlays: [
               [
                  'Arrow',
                  {
                     width: 10,
                     length: 14,
                     location: 1,
                     foldback: 0.8,
                  },
               ],
            ],
         });
      });
   });

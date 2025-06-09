export class UIManager {
   constructor(flowEditor) {
      this.flowEditor = flowEditor;
      this.baseStyleList = {
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
   }

   changeStyle(type) {
      const node = this.flowEditor.selectedNode;
      if (!node) return;

      if (
         type === 'ellipse' ||
         type === 'rectangle1' ||
         type === 'rectangle2'
      ) {
         node.classList.remove('diamond');
      } else if (type === 'diamond') {
         node.classList.add('diamond');
      }

      const styleSet = this.baseStyleList[type];

      node.style.width = styleSet.width;
      node.style.height = styleSet.height;
      node.style.backgroundColor = styleSet.backgroundColor;
      node.style.color = styleSet.color;
      node.style.fontSize = styleSet.fontSize;
      node.style.fontWeight = styleSet.fontWeight;
      node.style.borderColor = styleSet.borderColor;
      node.style.borderRadius = styleSet.borderRadius;

      requestAnimationFrame(() => {
         this.flowEditor.instance.revalidate(node);
      });
   }

   showEndpoint() {
      const points =
         this.flowEditor.containerEl.querySelectorAll('.jtk-endpoint');
      if (points.length === 0) return;

      if (points[0].classList.contains('show')) {
         points.forEach((point) => point.classList.remove('show'));
      } else {
         points.forEach((point) => point.classList.add('show'));
      }
   }

   exportToJson() {
      const nodeElements =
         this.flowEditor.containerEl.querySelectorAll('.flow-node');
      const nodes = Array.from(nodeElements).map((nodeEl) => {
         const rect = nodeEl.getBoundingClientRect();
         const canvasRect = this.flowEditor.containerEl.getBoundingClientRect();

         return {
            id: nodeEl.id,
            type: nodeEl.classList.contains('diamond') ? 'diamond' : 'square',
            x: rect.left - canvasRect.left,
            y: rect.top - canvasRect.top,
            width: parseInt(nodeEl.style.width),
            height: parseInt(nodeEl.style.height),
            backgroundColor: this.rgbToHex(nodeEl.style.backgroundColor),
            color: this.rgbToHex(nodeEl.style.color),
            fontSize: parseInt(nodeEl.style.fontSize),
            fontWeight: parseInt(nodeEl.style.fontWeight),
            borderColor: this.rgbToHex(nodeEl.style.borderColor),
            borderRadius: parseInt(nodeEl.style.borderRadius),
            label: nodeEl.querySelector('span')?.innerHTML || '',
         };
      });

      const connections = this.flowEditor.instance
         .getAllConnections()
         .map((conn) => {
            return {
               source: conn.sourceId,
               target: conn.targetId,
               anchors: [
                  conn.endpoints[0]?.anchor?.type || 'Continuous',
                  conn.endpoints[1]?.anchor?.type || 'Continuous',
               ],
               type: '',
               label: conn.getOverlay('labelOverlay')?.getLabel() || '',
               labelType:
                  conn
                     .getOverlay('labelOverlay')
                     ?.canvas?.classList?.value?.split(' ')
                     ?.find((cls) => cls.startsWith('label-'))
                     ?.replace('label-', '') || '',
            };
         });

      const exportData = {
         nodes: nodes,
         connections: connections,
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      document.getElementById('outputJSON').innerText = jsonString;
   }

   addBaseNode() {
      const newNode = {
         id: `new-node-${Date.now()}`,
         type: 'square',
         x: 20,
         y: 20,
         width: 140,
         height: 30,
         label: '노드',
      };

      this.flowEditor.createNodeElement(newNode);
   }

   rgbToHex(rgb) {
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
         return '#ffffff';
      }
   }

   updateNodePanel(nodeEl) {
      // 패널 전환
      document.getElementById('property-panel').style.display = 'block';
      document.getElementById('node-properties').style.display = 'block';
      document.getElementById('connection-properties').style.display = 'none';

      // 패널 값 업데이트
      const span = nodeEl.querySelector('span');
      document.getElementById('prop-text').value = span?.innerText || '';

      document.getElementById('prop-width').value =
         parseInt(nodeEl.style.width) || 0;
      document.getElementById('prop-height').value =
         parseInt(nodeEl.style.height) || 0;

      document.getElementById('prop-bgcolor').value = this.rgbToHex(
         nodeEl.style.backgroundColor || '#ffffff'
      );

      document.getElementById('prop-bordercolor').value = this.rgbToHex(
         nodeEl.style.borderColor || '#000000'
      );
   }

   updateConnectionPanel(conn) {
      // 패널 전환
      document.getElementById('property-panel').style.display = 'block';
      document.getElementById('node-properties').style.display = 'none';
      document.getElementById('connection-properties').style.display = 'block';

      // 패널 값 업데이트
      const strokeColor = conn.getPaintStyle().stroke || '#999';
      document.getElementById('prop-conn-color').value =
         this.rgbToHex(strokeColor);

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

   bindUIEvents() {
      // node text
      document.getElementById('prop-text').addEventListener('input', () => {
         const node = this.flowEditor.selectedNode;
         if (node) {
            const span = node.querySelector('span');
            span.innerText = document.getElementById('prop-text').value;
         }
      });

      // node width
      document.getElementById('prop-width').addEventListener('input', () => {
         const node = this.flowEditor.selectedNode;
         if (node) {
            node.style.width =
               document.getElementById('prop-width').value + 'px';
            requestAnimationFrame(() => {
               this.flowEditor.instance.revalidate(node);
            });
         }
      });

      // node height
      document.getElementById('prop-height').addEventListener('input', () => {
         const node = this.flowEditor.selectedNode;
         if (node) {
            node.style.height =
               document.getElementById('prop-height').value + 'px';
            requestAnimationFrame(() => {
               this.flowEditor.instance.revalidate(node);
            });
         }
      });

      // node background color
      document.getElementById('prop-bgcolor').addEventListener('input', () => {
         const node = this.flowEditor.selectedNode;
         if (node) {
            node.style.backgroundColor =
               document.getElementById('prop-bgcolor').value;
         }
      });

      // node border color
      document
         .getElementById('prop-bordercolor')
         .addEventListener('input', () => {
            const node = this.flowEditor.selectedNode;
            if (node) {
               node.style.borderColor =
                  document.getElementById('prop-bordercolor').value;
            }
         });

      // connection color
      document
         .getElementById('prop-conn-color')
         .addEventListener('input', () => {
            const conn = this.flowEditor.selectedConnection;
            if (conn) {
               conn.setPaintStyle({
                  stroke: document.getElementById('prop-conn-color').value,
                  strokeWidth: 1,
               });
            }
         });

      // connection label
      document
         .getElementById('prop-conn-label')
         .addEventListener('input', () => {
            const conn = this.flowEditor.selectedConnection;
            if (conn) {
               const value = document
                  .getElementById('prop-conn-label')
                  .value.trim();

               const labelOverlay = conn.getOverlay('labelOverlay');

               if (value === '') {
                  if (labelOverlay) {
                     conn.removeOverlay('labelOverlay');
                  }
               } else {
                  let overlay = labelOverlay;
                  if (!overlay) {
                     overlay = conn.addOverlay([
                        'Label',
                        {
                           id: 'labelOverlay',
                           label: value,
                           location: 0.5,
                           cssClass: '',
                        },
                     ]);
                  } else {
                     overlay.setLabel(value);
                  }
               }
            }
         });

      // connection label type
      document
         .getElementById('prop-conn-label-type')
         .addEventListener('change', () => {
            const conn = this.flowEditor.selectedConnection;
            if (conn) {
               const labelOverlay = conn.getOverlay('labelOverlay');
               if (labelOverlay && labelOverlay.canvas) {
                  const canvas = labelOverlay.canvas;

                  // 기존 label-xxx 클래스 제거
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
   }
}

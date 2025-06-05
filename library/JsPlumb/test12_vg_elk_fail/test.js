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

      const elk = new ELK();

      const groups = data.groups || [];

      const elkGraph = {
         id: 'root',
         layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': 'DOWN',
            'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
         },
         children: [],
         edges: [],
      };

      // ⭐ 그룹에 들어간 노드 기록
      const groupedNodeToGroup = {}; // { nodeId: groupId }

      groups.forEach((group) => {
         group.members.forEach((id) => {
            groupedNodeToGroup[id] = group.id;
         });
      });

      // ⭐ 그룹 없는 노드 → children
      data.nodes.forEach((node) => {
         if (!groupedNodeToGroup[node.id]) {
            elkGraph.children.push({
               id: node.id,
               width: node.width,
               height: node.height,
            });
         }
      });

      // ⭐ 그룹 → parent + children
      groups.forEach((group) => {
         const groupChildren = group.members
            .map((id) => {
               const refNode = data.nodes.find((n) => n.id === id);
               if (!refNode) {
                  console.warn(
                     `⚠️ group member ${id} not found in nodes! → SKIPPING`
                  );
                  return null;
               }
               return {
                  id: refNode.id,
                  width: refNode.width,
                  height: refNode.height,
               };
            })
            .filter((n) => n !== null && !!n.id);

         elkGraph.children.push({
            id: group.id,
            width: 10,
            height: 10,
            layoutOptions: {
               'elk.direction': group.direction,
            },
            children: groupChildren,
         });
      });

      // ⭐ edges → 그룹 내부 노드는 부모 그룹으로 연결 수정
      data.edges.forEach((edge) => {
         const source = groupedNodeToGroup[edge.source] || edge.source;
         const target = groupedNodeToGroup[edge.target] || edge.target;

         elkGraph.edges.push({
            sources: [source],
            targets: [target],
         });
      });

      // ⭐ 디버그: ELK Graph 출력
      console.log('🚀 FINAL ELK Graph:', JSON.stringify(elkGraph, null, 2));

      // ⭐ ELK 실행
      elk.layout(elkGraph).then((g) => {
         console.log('ELK layout result:', g);

         if (!g.children) {
            console.error('🚨 Error: g.children is undefined!');
            return;
         }

         g.children.forEach((node) => {
            renderNode(node);
         });

         runConnections(g);
      });

      function renderNode(node, parentOffsetX = 0, parentOffsetY = 0) {
         const div = document.createElement('div');
         div.id = node.id;
         div.className = 'flow-node';
         div.style.position = 'absolute';
         div.style.width = (node.width || 100) + 'px';
         div.style.height = (node.height || 40) + 'px';
         div.style.left = parentOffsetX + (node.x || 0) + 'px';
         div.style.top = parentOffsetY + (node.y || 0) + 'px';

         const matchingNode = data.nodes.find((n) => n.id === node.id);
         if (matchingNode) {
            if (matchingNode.type === 'diamond') {
               div.innerHTML = `<span>${matchingNode.label}</span>`;
            } else {
               div.innerHTML = matchingNode.label;
            }
            div.classList.add(matchingNode.type);
         } else {
            div.innerHTML = node.id;
         }

         document.getElementById('canvas').appendChild(div);

         instance.draggable(div, {
            stop: function () {
               console.log('🟢 Drag stopped → recompute');
               instance.deleteEveryConnection();
               requestAnimationFrame(() => {
                  instance.repaintEverything();
                  requestAnimationFrame(() => {
                     runConnections(elkGraph);
                  });
               });
            },
         });

         if (node.children) {
            node.children.forEach((child) => {
               renderNode(
                  child,
                  parentOffsetX + (node.x || 0),
                  parentOffsetY + (node.y || 0)
               );
            });
         }
      }

      function runConnections(g) {
         g.edges.forEach((edge) => {
            instance.connect({
               source: edge.sources[0],
               target: edge.targets[0],
               anchors: ['Continuous', 'Continuous'],
               connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
               paintStyle: { stroke: '#999', strokeWidth: 1 },
               overlays: [['Arrow', { width: 7, length: 8, location: 1 }]],
            });
         });

         instance.repaintEverything();
      }
   });

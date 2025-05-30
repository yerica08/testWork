jsPlumb.ready(function () {
   jsPlumb.setContainer(document.body);

   const nodes = ['node1', 'node2', 'node3', 'node4', 'node5'];
   nodes.forEach((id) => jsPlumb.draggable(id));

   const common = {
      connector: ['Flowchart', { cornerRadius: 5 }],
      endpoint: 'Dot',
      anchor: 'Continuous',
      paintStyle: { stroke: '#456', strokeWidth: 2 },
      endpointStyle: { fill: '#456', radius: 5 },
   };

   // 연결
   jsPlumb.connect({ source: 'node1', target: 'node2', ...common });

   // 분기
   jsPlumb.connect({
      source: 'node2',
      target: 'node3',
      overlays: [['Label', { label: 'YES', location: 0.5 }]],
      ...common,
   });
   jsPlumb.connect({
      source: 'node2',
      target: 'node4',
      overlays: [['Label', { label: 'NO', location: 0.5 }]],
      ...common,
   });

   jsPlumb.connect({ source: 'node4', target: 'node5', ...common });
});

jsPlumb.ready(function () {
   jsPlumb.setContainer(document.body);

   const common = {
      anchor: 'Continuous',
      connector: ['Flowchart', { cornerRadius: 5 }],
      endpoint: 'Dot',
      paintStyle: { stroke: '#456', strokeWidth: 2 },
      endpointStyle: { fill: '#456', radius: 5 },
   };

   // 드래그 가능하게 설정
   jsPlumb.draggable('box1');
   jsPlumb.draggable('box2');
   jsPlumb.draggable('box3');

   // box1: source
   jsPlumb.addEndpoint(
      'box1',
      {
         uuid: 'box1Right',
         isSource: true,
         anchor: 'Right',
         maxConnections: -1,
      },
      common
   );

   // box2: target
   jsPlumb.addEndpoint(
      'box2',
      {
         uuid: 'box2Left',
         isTarget: true,
         anchor: 'Left',
      },
      common
   );
   // box3: target
   jsPlumb.addEndpoint(
      'box3',
      {
         uuid: 'box3Left',
         isTarget: true,
         anchor: 'Left',
      },
      common
   );

   // 연결
   jsPlumb.connect({
      uuids: ['box1Right', 'box2Left'],
   });
   // 연결
   jsPlumb.connect({
      uuids: ['box1Right', 'box3Left'],
   });
});

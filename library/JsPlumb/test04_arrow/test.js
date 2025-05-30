jsPlumb.ready(function () {
   jsPlumb.setContainer(document.body);
   jsPlumb.draggable('box1');
   jsPlumb.draggable('box2');
   jsPlumb.draggable('box3');

   const common = {
      connector: ['Flowchart', { cornerRadius: 5 }],
      endpoint: 'Dot',
      paintStyle: { stroke: '#456', strokeWidth: 2 },
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
   };

   // ⛳ 드래그 연결 시 자동 화살표 추가
   jsPlumb.bind('connection', function (info) {
      info.connection.setPaintStyle({ stroke: '#456', strokeWidth: 2 });

      info.connection.addOverlay([
         'Arrow',
         {
            width: 10,
            length: 14,
            location: 1,
            foldback: 0.8,
         },
      ]);
   });

   // ✅ box1에 동일한 출구(오른쪽) 위치에 두 개의 출발점 추가
   jsPlumb.addEndpoint(
      'box1',
      {
         uuid: 'box1Right1',
         anchor: 'Right',
         isSource: true,
         maxConnections: -1,
      },
      common
   );

   jsPlumb.addEndpoint(
      'box1',
      {
         uuid: 'box1Right2',
         anchor: 'Right',
         isSource: true,
         maxConnections: -1,
      },
      common
   );

   // ✅ box2, box3의 왼쪽에 입력 포인트 추가
   jsPlumb.addEndpoint(
      'box2',
      {
         uuid: 'box2Left',
         anchor: 'Left',
         isTarget: true,
      },
      common
   );

   jsPlumb.addEndpoint(
      'box3',
      {
         uuid: 'box3Left',
         anchor: 'Left',
         isTarget: true,
      },
      common
   );

   // ✅ 같은 출발점(오른쪽)에서 두 군데로 연결
   jsPlumb.connect({
      uuids: ['box1Right1', 'box2Left'],
      ...common,
   });

   jsPlumb.connect({
      uuids: ['box1Right2', 'box3Left'],
      ...common,
   });
});

// ✅ JSON 데이터
const data = {
   nodes: [
      {
         id: 'start',
         type: 'ellipse',
         text: '영업팀',
         left: 300,
         top: 50,
         width: 120,
         height: 60,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'decision1',
         type: 'decision',
         text: '외근,내근',
         left: 300,
         top: 150,
         width: 120,
         height: 120,
         fill: '#FFFFFF',
         outline: '#000000',
      },

      {
         id: 'task1',
         type: 'process',
         text: '거래처관리',
         left: 600,
         top: 50,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task2',
         type: 'process',
         text: '시장동향파악',
         left: 600,
         top: 120,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task3',
         type: 'process',
         text: '신규업체개발',
         left: 600,
         top: 190,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task4',
         type: 'process',
         text: '목표관리',
         left: 600,
         top: 260,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task5',
         type: 'process',
         text: '지원업무',
         left: 600,
         top: 330,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },

      {
         id: 'task6',
         type: 'process',
         text: '업체관리',
         left: 100,
         top: 300,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task7',
         type: 'process',
         text: '업체단가관리',
         left: 100,
         top: 370,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task8',
         type: 'process',
         text: '미결관리',
         left: 100,
         top: 440,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task9',
         type: 'process',
         text: '반품관리',
         left: 100,
         top: 510,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task10',
         type: 'process',
         text: '여신체크',
         left: 100,
         top: 580,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task11',
         type: 'process',
         text: '전표관리',
         left: 100,
         top: 650,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task12',
         type: 'process',
         text: '상품홍보(Fax)',
         left: 100,
         top: 720,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
      {
         id: 'task13',
         type: 'process',
         text: '수주관리',
         left: 100,
         top: 790,
         width: 150,
         height: 50,
         fill: '#FFFFFF',
         outline: '#000000',
      },
   ],
   edges: [
      { source: 'start', target: 'decision1', data: { label: '' } },

      { source: 'decision1', target: 'task1', data: { label: '외근' } },
      { source: 'decision1', target: 'task2', data: { label: '외근' } },
      { source: 'decision1', target: 'task3', data: { label: '외근' } },
      { source: 'decision1', target: 'task4', data: { label: '외근' } },
      { source: 'decision1', target: 'task5', data: { label: '외근' } },

      { source: 'decision1', target: 'task6', data: { label: '내근' } },

      { source: 'task6', target: 'task7', data: { label: '' } },
      { source: 'task7', target: 'task8', data: { label: '' } },
      { source: 'task8', target: 'task9', data: { label: '' } },
      { source: 'task9', target: 'task10', data: { label: '' } },
      { source: 'task10', target: 'task11', data: { label: '' } },
      { source: 'task11', target: 'task12', data: { label: '' } },
      { source: 'task12', target: 'task13', data: { label: '' } },
   ],
};

// ✅ jsPlumb 초기화
jsPlumb.ready(function () {
   jsPlumb.setContainer(document.body);

   // 노드 생성
   data.nodes.forEach((node) => {
      const el = document.createElement('div');
      el.id = node.id;
      el.className = `node ${node.type}`;
      el.style.left = node.left + 'px';
      el.style.top = node.top + 'px';
      el.style.width = node.width + 'px';
      el.style.height = node.height + 'px';
      el.style.background = node.fill;
      el.style.borderColor = node.outline;

      if (node.type === 'decision') {
         el.innerHTML = `<span>${node.text}</span>`;
      } else {
         el.innerText = node.text;
      }

      document.body.appendChild(el);

      jsPlumb.draggable(el);

      // ✅ 수정된 부분! anchor 고정 + maxConnections 적용
      jsPlumb.makeSource(el, {
         anchor: 'Right', // 출발 anchor 고정
         connector: ['Flowchart', { cornerRadius: 5 }],
         maxConnections: -1, // 여러 연결 허용
      });

      jsPlumb.makeTarget(el, {
         anchor: 'Left', // 도착 anchor 고정
         allowLoopback: false,
      });
   });

   // 연결 생성
   data.edges.forEach((edge) => {
      jsPlumb.connect({
         source: edge.source,
         target: edge.target,
         connector: ['Flowchart', { cornerRadius: 5 }],
         paintStyle: { stroke: '#000', strokeWidth: 2 },
         overlays: [
            ['Arrow', { width: 10, length: 14, location: 1 }],
            ['Label', { label: edge.data.label || '', location: 0.5 }],
         ],
      });
   });
});

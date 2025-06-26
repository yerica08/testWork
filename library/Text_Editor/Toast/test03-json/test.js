let editor;
window.addEventListener('load', () => {
   editor = new toastui.Editor({
      el: document.querySelector('#editor'), // 에디터를 렌더링할 DOM 요소
      height: '500px', // 에디터 높이. 문자열(300px, auto...)
      initialEditType: 'markdown', // 초기 모드 ('markdown' 또는 'wysiwyg')
      // 콘텐츠 초기값. 반드시 문자열 형태
      //       initialValue: `
      // ## 📊 2025년 상반기 매출

      // \`\`\`chart
      // {
      //  "type": "bar",
      //  "data": {
      //    "labels": ["1월", "2월", "3월"],
      //    "datasets": [
      //      { "label": "매출", "data": [100, 200, 150] }
      //    ]
      //  }
      // }
      // \`\`\`
      // `,

      previewStyle: 'vertical', // 프리뷰 위치 ('vertical' 또는 'tab')
      hideModeSwitch: false, // editor type 숨기지 않기
      language: 'ko-KR', // 한국어 설정
   });
});

// 작성된 내용을 HTML 형식으로 내보내기
function ChangeJsonHTML() {
   const content = editor.getHTML();
   console.log(JSON.stringify(content));
}
// 작성된 내용을 Markdown 형식으로 내보내기
function ChangeJsonMarkdown() {
   const content = editor.getMarkdown();
   console.log(JSON.stringify(content));
}

// HTML 형식의 JSON 데이터를 가져와 에디터에 뿌리기
function fetchHTML() {
   fetch('demoHTML.json')
      .then((response) => response.json())
      .then((data) => {
         //editorHTML.loadData(data);
         editor.setHTML(data);
      });
}
// Markdown 형식의 JSON 데이터를 가져와 에디터에 뿌리기
function fetchMarkdown() {
   fetch('demoMarkdown.json')
      .then((response) => response.json())
      .then((data) => {
         //editorHTML.loadData(data);
         editor.setMarkdown(data);
      });
}

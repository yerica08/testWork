let editor;
let spreadsheetEditor;

window.addEventListener('load', () => {
   editor = new toastui.Editor({
      el: document.querySelector('#editor'), // 에디터를 렌더링할 DOM 요소
      height: '500px', // 에디터 높이. 문자열(300px, auto...)
      initialEditType: 'wysiwyg', // 초기 모드 ('markdown' 또는 'wysiwyg')
      previewStyle: 'vertical', // 프리뷰 위치 ('vertical' 또는 'tab')
      hideModeSwitch: false, // editor type 숨기지 않기
      language: 'ko-KR', // 한국어 설정
      // placeholder:
      //    '< 불러오기 >\n상단의 불러오기 버튼을 클릭하면 저장된 내용을 불러옵니다.\n\n< 내보내기 >\n하단의 내보내기 버튼을 클릭하면 작성된 내용을 콘솔창에 JSON 형태로 내보냅니다.',

      // iframe 넣는 방법
      customHTMLSanitizer: (html) => html,

      // iframe 넣는 법(1)
      customHTMLRenderer: {
         htmlBlock: {
            iframe(node) {
               return [
                  {
                     type: 'openTag',
                     tagName: 'iframe',
                     outerNewLine: true,
                     attributes: node.attrs, // src, width, height 등
                  },
                  {
                     type: 'html',
                     content: node.childrenHTML, // inner HTML
                  },
                  {
                     type: 'closeTag',
                     tagName: 'iframe',
                     outerNewLine: true,
                  },
               ];
            },
         },
      },
   });
   const waitForDocsAPI = () => {
      if (typeof DocsAPI !== 'undefined') {
         const config = {
            document: {
               fileType: 'xlsx',
               key: '123456',
               title: '매출내역.xlsx',
               url: 'http://host.docker.internal:3000/files/my-sheet.xlsx',
            },
            documentType: 'cell',
            editorConfig: {
               mode: 'edit',
               lang: 'ko',
               callbackUrl: 'http://host.docker.internal:3000/files',
            },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPTkxZT0ZGSUNFIiwiaWF0IjoxNzUwODEzNjQwLCJleHAiOjE3NTA4MTcyNDAsImRvY3VtZW50Ijp7ImZpbGVUeXBlIjoieGxzeCIsImtleSI6IjEyMzQ1NiIsInRpdGxlIjoi66ek7Lac64K07JetLnhsc3giLCJ1cmwiOiJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6MzAwMC9maWxlcy9teS1zaGVldC54bHN4In0sImVkaXRvckNvbmZpZyI6eyJtb2RlIjoiZWRpdCIsImxhbmciOiJrbyIsImNhbGxiYWNrVXJsIjoiaHR0cDovL2hvc3QuZG9ja2VyLmludGVybmFsOjMwMDAvZmlsZXMifX0.xW3W1tbkH7Tp-tVqFWbcR5MdinOeb0T27Ex9wdXRD5s',
         };

         spreadsheetEditor = new DocsAPI.DocEditor(
            'spreadsheet-container',
            config
         );
         console.log('성공');
      } else {
         // 0.1초 후 재시도
         setTimeout(waitForDocsAPI, 100);
      }
   };

   waitForDocsAPI(); // 실행
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
function setIframe() {
   // editor의 옵션을 따로 수정하는 기능은 없고,
   // editor.destroy() 로 기존 에디터를 해제하고 new로 옵션을 다시 생성해서 초기화 시켜야함.
   const md = `
   <iframe height="500" style="width: 800px;" scrolling="no" title="Untitled" src="https://codepen.io/moroiolt-the-typescripter/embed/qEdMQJL?default-tab=result&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/moroiolt-the-typescripter/pen/qEdMQJL">
  Untitled</a> by 26%익산의 (<a href="https://codepen.io/moroiolt-the-typescripter">@moroiolt-the-typescripter</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>`;
   editor.setHTML(md);
}

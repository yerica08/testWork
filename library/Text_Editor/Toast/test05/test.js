let editor;
let spreadsheetEditor;

window.addEventListener('load', () => {
   editor = new toastui.Editor({
      el: document.querySelector('#editor'), // 에디터를 렌더링할 DOM 요소
      height: '500px', // 에디터 높이. 문자열(300px, auto...)
      initialEditType: 'markdown', // 초기 모드 ('markdown' 또는 'wysiwyg')
      previewStyle: 'vertical', // 프리뷰 위치 ('vertical' 또는 'tab')
      hideModeSwitch: false, // editor type 숨기지 않기
      language: 'ko-KR', // 한국어 설정
      // placeholder:
      //    '< 불러오기 >\n상단의 불러오기 버튼을 클릭하면 저장된 내용을 불러옵니다.\n\n< 내보내기 >\n하단의 내보내기 버튼을 클릭하면 작성된 내용을 콘솔창에 JSON 형태로 내보냅니다.',
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
function fetchtest() {
   fetch('testSanitization.json')
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

function sendMarkdown() {
   const content = editor.getMarkdown();
   if (content) {
      //sessionStorage.setItem('tui-content', content);
      //window.location.href = './viewer.html';
      //window.open('viewer.html', '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
      const cleanHTML = DOMPurify.sanitize(content, {
         USE_PROFILES: { html: true },
      });
      localStorage.setItem('clean-content', cleanHTML);
      localStorage.setItem('dirty-content', content);
   } else {
      console.log('컨텐츠 없음!');
   }
}

function sendHTML() {
   const content = editor.getHTML();
   if (content) {
      //sessionStorage.setItem('tui-content', content);
      //window.location.href = './viewer.html';
      //window.open('viewer.html', '_blank', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no');
      const cleanHTML = DOMPurify.sanitize(content, {
         USE_PROFILES: { html: true },
      });
      localStorage.setItem('clean-content', cleanHTML);
      localStorage.setItem('dirty-content', content);
   } else {
      console.log('컨텐츠 없음!');
   }
}

/* 
1. 금지 태그 제거/무해화 테스트

1) <script> 태그 삽입

<script>alert('XSS')</script>

2) <iframe>, <object>, <embed> 등 외부 콘텐츠 삽입 태그

<iframe src="https://evil.com"></iframe>

3) <style> 태그 내 악성 CSS 삽입

<style>body {background-image: url("javascript:alert('XSS')");}</style>

2. 인라인 이벤트 핸들러 무력화 테스트

2) onclick, onerror, onload 등

<img src="invalid.jpg" onerror="alert('XSS')" />

<div onclick="alert('XSS')">click me</div>

3. 프로토콜 필터링 테스트

1) javascript:, vbscript:, data: 프로토콜

<a href="javascript:alert(1)">click</a>

<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">

4. 속성 무해화/제거 테스트

1) style 속성 안에 표현식 삽입

<div style="width: expression(alert('XSS'));">test</div>

2) XML 네임스페이스 혼합 우회

<svg><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="javascript:alert(1)">XSS</a></svg>

5. URL 인젝션 및 브라우저 클로버링 테스트

1) 특수문자·인코딩 우회

<IMG SRC=JaVaScRiPt:alert("XSS")>

<a href="&#x6A;&#x61;v&#x61;script:alert(1)">XSS</a>

2) CRLF 삽입

<a href="javascript:alert(1)//\nanything">XSS</a>

6. Markdown → HTML 변환 시 필터링 테스트

1) 이미지 마크다운에 XSS

![x](javascript:alert(1))

2) 링크 마크다운에 XSS

[click](javascript:alert(1))

7. SVG 내 스크립트 인젝션 테스트

1) SVG <script>

<svg><script>alert(1)</script></svg>

2) SVG 이벤트 핸들러

<svg><circle cx="50" cy="50" r="40" onload="alert(1)" /></svg>

8. HTML 엔티티/주석 우회 테스트

1) HTML 주석 깨뜨리기

<!--><script>alert(1)</script>

2) 닫히지 않은 태그 조합

<div><svg/onload=alert(1)>
*/

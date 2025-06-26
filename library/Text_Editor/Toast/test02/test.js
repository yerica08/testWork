/*
https://ui.toast.com/tui-editor

master
https://github.com/nhn/tui.editor/tree/master/docs/ko
https://jenny0520.tistory.com/159 -> 리엑트 에디터 셋팅 + 커스텀 + 이미지

플러그인
https://velog.io/@khy226/React-Toast-UI-Editor-%EC%A0%81%EC%9A%A9%EA%B8%B0
https://velog.io/@hwnim5324/%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80-Toast-UI-Editor-%EC%A0%81%EC%9A%A9

그리드
https://meetup.nhncloud.com/posts/83
https://meetup.nhncloud.com/posts/190
https://meetup.nhncloud.com/posts/210

차트
https://meetup.nhncloud.com/posts/82

// 에디터
https://leego.tistory.com/entry/React-%EC%97%90%EB%94%94%ED%84%B0%EB%A1%9C-TOAST-UI-Editor-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0 -> 리엑트

코드 뷰어 / 하이라이터
https://velog.io/@y0ungg/React-18-ES6%EC%97%90%EC%84%9C-Toast-UI-Editor-plugins-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-codeSyntaxHighlight

뷰어
https://velog.io/@ayoung0073/React-%ED%9E%98%EB%93%A4%EA%B2%8C-%EC%A0%81%EC%9A%A9%ED%95%9C-TOAST-UI-Viewer-Editor

https://velog.io/@heeyeon3050/front-TOAST-UI-Codepen-%EB%B7%B0%EC%96%B4

캘린더
https://ui.toast.com/tui-calendar
https://github.com/nhn/tui.calendar/blob/main/docs/ko/apis/calendar.md

이미지
https://ui.toast.com/tui-image-editor
https://velog.io/@aimzero9303/toast-editor-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%ED%95%98%EA%B8%B0
https://velog.io/@aal2525/Toast-Editor-%EC%82%AC%EC%A7%84-%EC%A0%80%EC%9E%A5-%EC%B5%9C%EC%A0%81%ED%99%94 -> 사진 저장 로직
https://ddppp.tistory.com/145 -> base64 이미지 업로드, 클라우디너리
https://velog.io/@kimgorok/PPLOG-Toast-uireact-editor%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4-%EC%BB%A4%EC%8A%A4%ED%85%80-%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%97%90%EB%94%94%ED%84%B0-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0#%F0%9F%A5%AAtoast-ui-editor-%EC%84%B8%ED%8C%85 -> 이미지 처리 구현

기타
https://velog.io/@haegnim/%EC%8B%A4%EC%A0%84-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-toast-ui-%EA%B5%AC%ED%98%84 -> 받은 알림 데이터를 toast ui로 보여주는 기능
https://velog.io/@horang-e/Toast-ui-Viewer-undefined%EA%B0%92-%EB%9C%B0-%EB%95%8C -> viewer undefined 값 뜰 때
https://github.com/nhn/tui.editor/blob/master/docs/v3.0-migration-guide-ko.md -> 마이그레이션 가이드
*/
window.addEventListener('load', () => {
   /*
    << 시작 >>
    1. new ToastUIEditor({options}) : ToastUI 편집기 생성

    << 정적 메서드 >>
    2. factory(options) 
    : 편집기를 위한 팩토리 메서드로, options에는 {ToastUIEditor 또는 ToastUIEditorViewer}가 들어간다.

    << 인스턴스 메서드 >>

    3. destroy() : 문서에서 TUIEditor 삭제

    4. insertToolbarItem(indexInfo, item)
    : 툴바 항목 추가, indexInfo 에는 객체 형태로 도구모음 항목의 그룹인덱스 및 항목 인덱스가 들어가고
      item에는 문자열 혹은 객체 형태로 들어가는데 도구모음 항목이 들어간다. 

    5. removeToolbarItem(itemName)
    : 툴바 항목 삭제, 삭제하고자 하는 도구 이름이 문자 형태로 들어간다.
  */

   const editor = new toastui.Editor({
      el: document.querySelector('#editor'), // 에디터를 렌더링할 DOM 요소
      height: '500px', // 에디터 높이. | 문자열(300px, auto...)
      minHeight: '', // 에디터 최소 높이
      initialEditType: 'markdown', // 초기 모드 | 'markdown' 또는 'wysiwyg'
      // 콘텐츠 초기값 | stirng
      initialValue: `
## 📊 2025년 상반기 매출

\`\`\`chart
{
 "type": "bar",
 "data": {
   "labels": ["1월", "2월", "3월"],
   "datasets": [
     { "label": "매출", "data": [100, 200, 150] }
   ]
 }
}
\`\`\`
`,

      previewStyle: 'vertical', // 프리뷰 위치 | 'vertical' 또는 'tab'
      hideModeSwitch: false, // editor type 숨기지 않기 | boolean = false
      language: 'ko-KR', // 한국어 설정 | string
      usageStatistics: false, // 에디터를 사용하는 웹 사이트의 _호스트명_을 전송. 어떠한 사용자가 에디터를 사용하고 있는지 수집하기 위함 | boolean = false
      useCommandShortcut: true, // 명령을 수행하기 위해 키보드 단축키를 사용할지 여부 | boolean = false
      toolbarItems: [], // 도구 모음 항목 | Array
      plugins: [], // 플러그인 | Array
      extendedAutolinks: '', // GFM 사양에 지정된 확장된 자동 링크 사용 | Object
      placeholder: '', // 에디터의 플레이스홀더 텍스트입니다. 이곳에는 마크다운 문법이 들어가면 이후 getHTML() 등으로 데이터를 내보낼 때 오류가 발생합니다.| string
      linkAttributes: {}, // rel, target, hreflang, type이 되어야 하는 앵커 요소의 속성 | Object
      customHTMLRenderer: null, // 사용자 정의 렌더러 기능을 포함하는 객체는 HTML 또는 WYSIWYG 노드를 미리 보기 위해 마크다운 노드를 변경하는 것과 일치 | Object = null
      customMarkdownRenderer: null, // 사용자 정의 렌더러 기능을 포함하는 객체는 wysiwyg 노드를 마크다운 텍스트로 변경하는 데 해당 | Object = null
      referenceDefinition: false, // 링크 참조 정의 사양을 사용할지 여부 | boolean = false
      customHTMLSanitizer: null, // 사용자 정의 HTML 필터 | funciton = null
      /*
        customHTMLSanitizer 는 Toast UI Editor에서 사용하는 주요 보안 필터링입니다.
        기본적으로, Toast는 sanitize-html 같은 기능을 내장하여, 
        <script>, onerror, onload, javascript: 링크 등을 자동으로 제거합니다.
        하지만 모든 보안을 막는 건 아니므로, 고급 보안이 필요하다면 사용자 정의 sanitizer를 사용하는게 좋습니다.
        
        // 간단한 XSS 필터 예시
        customHTMLSanitizer: (html) => {
          return html.replace(/<script.*?>.*?<\/script>/gi, '');
        }
        
        +) 백엔드에서 SQL 바인딩 처리, 브라우저에서 스크립트 제한(Content Security Policy), 외부 라이브러리(DOMPurify) 등을 함께 쓰면 좋다.

        ++) DOMPurify : HTML 보안 필터링 라이브러리
            XSS(Cross Site Scripting)보안 문제를 쉽고 강력하게 해결해주는 라이브러리로,
            Zero-depenency(의존성 없음)이고, 매우 가볍고 빠릅니다.
            위 라이브러리는 CKEditor와 Quill.js 같은 에디터 등 유명한 서비스들도 많이 사용하고 있으며,
            보안 팀에서 전문적으로 유지보수 중(Cure53에서 개발)이며, OWASP 보안 가이드에도 추천되고 있습니다.

        Toast는 보안을 위해 자체적으로 제한적인 HTML만 생성하며,
        기본적으로 Markdown -> HTML 변환 과정에서 안전한 콘텐츠만 출력하도록 설계되어 있습니다.
        즉, 공격 벡터를 마크다운으로 삽입하기 어렵고 마크 다운 렌더러도 기본적인 보안 처리를 합니다.
        하지만, 완전히 안전한 것은 아니기 때문에 DOMpurify를 연동해 사용하는것을 권장합니다.

      */
      previewHighlight: false, // 하이라이트 미리보기 영역 여부 | boolean = false
      frontMatter: false, // 앞부분을 사용할지 여부 | boolean = false
      widgetRules: [], // 위젯 노드로 텍스트를 대체하기 위한 규칙 | Array.<object> = []
      theme: '', // 편집기 스타일을 지정할 테마. 기본값은 toastui-editor.css에 포함 | string
      autofocus: true, // 편집자가 자동으로 창작에 집중할 수 있도록 해줌 | autofocus = true
      // 이벤트 | Object
      event: [
         {
            /*
        이벤트 목록 | function 
        
        load : 편집기 로드되면
        change : 콘텐츠가 변경되면
        caretChange : 커서 위치에 따라 형식이 변경될 때
        focus : 편집자가 포커스를 받으면
        blur : 편집기가 초점을 잃었을 때
        keydown : 편집기에서 키를 누르면
        keyup : 편집기에서 키가 해제되면
        beforePreviewRender : HTML 문자열로 마크다운 미리보기를 렌더링 하기 전
        beforeConvertWysiwygToMarkdown : 마크다운 텍스트로 wysiwyg를 마크다운으로 변환하기 전   
      */
            load: (e) => {
               console.log(e);
            },
         },
      ],
      // 훅 | Object
      hooks: [
         {
            // addImageBlobHook : 이미지 업로드를 위한 후크 | 타입도 addImageBlobHook?
            addImageBlobHook: async (Blob, callback) => {},
         },
      ],
   });
});
/*
  << 데이터 가져오기>>

  1. initialValue

    const editor = new toastui.Editor({
      initialValue: '불러온 내용입니다.'
    });

  2. editor.setMarkdown('서버에서 가져온 내용');
  3. editor.setHTML('서버에서 가져온 내용');

  << 데이터 내보내기 >>

  1. editor.getMarkdown();
  2. editor.getHTML();

*/

/*
  << 인스턴스 메소드 >> https://nhn.github.io/tui.editor/latest/ToastUIEditorCore

  addCommand(type, name, command)
  addHook(type, handler)
  addWidget(node, style, pos)
  blur()
  changeMode(mode, withoutFocus)
  changePreviewStyle(style)
  convertPosToMatchEditorMode(start, end, mode)
  deleteSelection(start, end)
  destroy()
  exec(name, payload)
  focus()
  getCurrentPreviewStyle()
  getEditorElements()
  getHeight()
  getHTML()
  getMarkdown()
  getMinHeight()
  getRangeInfoOfNode(pos)
  getScrollTop()
  getSelectedText(start, end)
  getSelection()
  hide()
  insertText(text)
  isMarkdownMode()
  isViewer()
  isWysiwygMode()
  moveCursorToEnd(focus)
  moveCursorToStart(focus)
  off(type)
  on(type, handler)
  removeHook(type)
  replaceSelection(text, start, end)
  replaceWithWidget(start, end, text)
  reset()
  setHeight(height)
  setHTML(html, cursorToEnd)
  setMarkdown(markdown, cursorToEnd)
  setMinHeight(minHeight)
  setPlaceholder(placeholder)
  setScrollTop(value)
  setSelection(start, end)
  show()
*/

window.addEventListener('load', () => {
   const editor = new toastui.Editor({
      el: document.querySelector('#editor'), // 에디터를 렌더링할 DOM 요소
      height: '500px', // 에디터 높이 (예: '500px')
      initialEditType: 'markdown', // 초기 모드 ('markdown' 또는 'wysiwyg')
      initialValue: '내용을 입력하세요',

      previewStyle: 'vertical', // 프리뷰 위치 ('vertical' 또는 'tab')
      language: 'ko-KR', // 한국어 설정
   });
});

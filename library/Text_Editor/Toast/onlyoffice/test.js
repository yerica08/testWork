let spreadsheetEditor;

// 0) 모든 drag/drop 캡처링 차단
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((name) => {
   window.addEventListener(
      name,
      (e) => {
         e.preventDefault();
         e.stopPropagation();
      },
      { capture: true }
   );
});

// 1) 드롭존 셋업
function setupDropZone() {
   const zone = document.getElementById('drop-zone');
   ['dragenter', 'dragover'].forEach((ev) =>
      zone.addEventListener(ev, (e) => {
         e.preventDefault();
         zone.classList.add('hover');
      })
   );
   ['dragleave', 'drop'].forEach((ev) =>
      zone.addEventListener(ev, (e) => {
         e.preventDefault();
         zone.classList.remove('hover');
      })
   );
   zone.addEventListener('drop', async (e) => {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      // 업로드→토큰→에디터 초기화
      const f = new FormData();
      f.append('file', file);
      const { fileUrl, fileName } = await (
         await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: f,
         })
      ).json();
      console.log('📤 업로드 완료', fileName);
      await initEditor(fileUrl, fileName);
   });
}

// 2) 주어진 파일로 에디터 초기화
async function initEditor(fileUrl, fileName) {
   // 2-1) 토큰 발급
   const resp = await fetch(
      `http://localhost:3000/token?url=${encodeURIComponent(fileUrl)}`
   );
   const { token } = await resp.json();

   // 2-2) 기존 에디터 제거
   if (spreadsheetEditor) spreadsheetEditor.destroy();

   // 2-3) DocsAPI 설정
   const config = {
      documentType: 'cell',
      document: {
         fileType: 'xlsx',
         key: fileUrl,
         title: fileName,
         url: fileUrl,
      },
      editorConfig: {
         mode: 'edit',
         lang: 'ko',
         // Docker 컨테이너가 호출할 때 host.docker.internal
         callbackUrl: 'http://host.docker.internal:3000/save',
      },
      token: token,
   };

   // 2-4) 에디터 생성
   spreadsheetEditor = new DocsAPI.DocEditor('spreadsheet-container', config);
   console.log(`✅ ${fileName} 로드 완료`);
}

// 3) 페이지 로드 시 초기화
window.addEventListener('load', () => {
   //setupDropZone();

   // 3-1) 초기 파일 URL도 동일하게 host.docker.internal 사용
   initEditor(
      'http://host.docker.internal:3000/files/my-sheet.xlsx',
      'my-sheet.xlsx'
   );
});

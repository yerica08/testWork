// server.js
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 📁 'files' 폴더를 정적 파일 경로로 지정
//app.use('/files', express.static(path.join(__dirname, 'files')));

// 현재 __dirname 이 Toast/test04-ONLYOFFICE 이므로
// 그 아래 있는 files 폴더를 가리키도록 경로 조정
app.use('/files', express.static(path.join(__dirname, 'files')));

// ✅ 테스트용 홈 페이지
app.get('/', (req, res) => {
   res.send(
      '📁 sample.xlsx에 접근하려면: <a href="/files/sample.xlsx">여기 클릭</a>'
   );
});

app.listen(port, '0.0.0.0', () => {
   console.log(`✅ XLSX 서버 실행됨: http://localhost:${port}`);
});

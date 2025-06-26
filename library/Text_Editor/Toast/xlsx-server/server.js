/* 기존 sever.js 코드
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
*/
// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
// Node 18+ 이시면 전역 fetch 사용, 아니라면 아래처럼 설치 후 require
// const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const port = 3000;

// ─────────── 여기에 추가 ───────────
const JWT_SECRET = 'myVerySecretKey';

// 1) CORS 설정 (테스트용으로 전체 허용)
app.use(cors());

app.use((req, res, next) => {
   // unload 이벤트를 자기 자신(origin)에서만 허용
   res.setHeader('Permissions-Policy', 'unload=(self)');
   next();
});

// 2) JSON 바디 파싱 (저장 콜백)
app.use(express.json({ limit: '50mb' }));

// 3) 파일 업로드용 Multer 설정
const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, path.join(__dirname, 'files')),
   filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// 4) 정적 파일 제공
app.use('/files', express.static(path.join(__dirname, 'files')));

// 5) 토큰 발급 API
app.get('/token', (req, res) => {
   const url = req.query.url;
   if (!url) return res.status(400).json({ error: 'url parameter required' });

   const payload = {
      iss: 'ONLYOFFICE',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      document: {
         fileType: 'xlsx',
         key: url,
         title: path.basename(url),
         url,
      },
      editorConfig: {
         mode: 'edit',
         lang: 'ko',
         callbackUrl: `http://host.docker.internal:3000/save`,
      },
   };

   const token = jwt.sign(payload, JWT_SECRET);
   res.json({ token });
});

// 6) 파일 업로드 엔드포인트
app.post('/upload', upload.single('file'), (req, res) => {
   const fileName = req.file.originalname;
   const fileUrl = `http://localhost:${port}/files/${encodeURIComponent(
      fileName
   )}`;
   console.log('📤 업로드됨:', fileName);
   res.json({ fileName, fileUrl });
});

// 7) 저장 콜백 API
app.post('/save', async (req, res) => {
   try {
      const { url, status, key } = req.body;
      console.log('💾 저장 콜백:', req.body);
      if (status === 2 && url) {
         const response = await fetch(url);
         const buffer = await response.arrayBuffer();
         const savePath = path.join(__dirname, 'files', path.basename(key));
         fs.writeFileSync(savePath, Buffer.from(buffer));
         console.log('✔️ 저장 완료:', savePath);
      }
      res.json({ error: 0 });
   } catch (e) {
      console.error('❌ 저장 오류:', e);
      res.status(500).json({ error: 1 });
   }
});

// 8) 서버 시작
app.listen(port, '0.0.0.0', () => {
   console.log(`✅ XLSX 서버 실행됨: http://localhost:${port}`);
});

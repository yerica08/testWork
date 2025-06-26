// generateToken.js
const jwt = require('jsonwebtoken');

// 1) Document Server에 설정한 비밀 키와 똑같이 맞춰야 합니다.
const JWT_SECRET = 'myVerySecretKey';

// 2) 토큰에 담을 정보(payload)
//    - iss, exp 같은 표준 클레임 외에,
//    - document: { fileType, key, title, url } 처럼 문서 정보도 같이 담을 수 있어요.
const payload = {
   iss: 'ONLYOFFICE', // Issuer (발급자) 식별용
   iat: Math.floor(Date.now() / 1000), // 발급 시간 (초)
   exp: Math.floor(Date.now() / 1000) + 60 * 60, // 만료 시간: 1시간 후
   document: {
      fileType: 'xlsx',
      key: '123456',
      title: '매출내역.xlsx',
      url: 'http://host.docker.internal:3000/files/my-sheet.xlsx',
   },
   editorConfig: {
      mode: 'edit', // ← 필수
      lang: 'ko',
      callbackUrl: 'http://host.docker.internal:3000/files',
   },
};

// 3) 서명(Sign) → JWT 토큰 생성
const token = jwt.sign(payload, JWT_SECRET);

console.log('Generated JWT Token:\n', token);

const ourPromise = new Promise((resolve, reject) => {
   let 우정 = 0
   let 예리 = 0

   //우정 = 100;
   //예리 = 100;

   if (우정 > 예리) {
      resolve('19:30')
   } else if (우정 < 예리) {
      resolve('20:00')
   } else {
      reject('약속 파토')
   }
})

// 오리지날 promise형태
function 약속이행1() {
   ourPromise
      .then((pTime) => console.log(pTime))
      .catch((message) => console.error(message))
}

// promise를 async와 await로 변경
async function 약속이행2() {
   try {
      await ourPromise
   } catch (message) {
      console.error(message)
   }
}

약속이행1()
//약속이행2();

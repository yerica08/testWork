async function foo() {
   const prom1 = new Promise((resolve, reject) => {
      try {
         resolve(111);
      } catch (ex) {
         reject(ex);
      }
   });

   // 모든 await는 Promise '객체' 앞에서 쓸 수가 있다.
   const prom1_result = await prom1;
   console.log(prom1_result);

   function innerJob() {
      return new Promise((resolve, reject) => {
         try {
            resolve('this is innerJob');
         } catch (ex) {
            reject(ex);
         }
      });
   }

   // innerJob 함수는 Promise '객체'를 리턴하므로 아래 형태로 사용할 수 있다.
   const inner_result = await innerJob();
   console.log(inner_result);

   // 생성된 Promise '객체' 앞에 await키워드를 붙이면 해당 Promise는 즉시 실행된다.
   const instance_job = await new Promise((resolve, reject) => {
      try {
         resolve('this is instance job');
      } catch (ex) {
         reject(ex);
      }
   });
   console.log(instance_job);
}

foo();


console.log("1\n2\n3\n4\n5");
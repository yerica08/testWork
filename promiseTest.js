// async await의 기본사용법

async function startTest(fireError = false){
    try{
        // Promise가 이행(fulfilled)상태가 되면 resolve메서드로 전달된 값이 result에 할당됨.
        const result = await runPromise(fireError);
        console.log(result);        
    }catch(ex){
        // Promise가 거부(rejected)상태가 되면 catch블럭을 타게됨.
        console.error(`에러발생 : ${ex.message}`);
    }
}

function runPromise(fireError = false){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(!!fireError){
                reject(new Error("안녕 나는 에러라고해"));
            }else{
                resolve("정상처리 됨!!");
            }
        }, 3000);
    });
}

// 정상 결과 산출
startTest();

// // 에러 산출
// startTest(true);
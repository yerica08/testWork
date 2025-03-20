/*
test("aukks","wbqd",5)
function test(s,skip,index){
    const first = [...s].map((a)=>a.toUpperCase().charCodeAt());
    const skipNum = [...skip].map((a)=>a.toUpperCase().charCodeAt());

    let plus = first.map(a=>{
        for(const i of skipNum){
            if(i>=a && i <=a+5) a += 1;
        }
        a += index;
        while(a > 90){
            a -= 26;
        }
        return String.fromCharCode(a).toLowerCase();
    })
    console.log(plus.join(''));
}

function solution(s, skip, index){
    if(s.length < 5 || s.length > 50){
        throw new Error("s는 5자리 이상, 50자리 이하여야 한다.");
    }

    if(skip.length < 1 || skip.length > 10){
        throw new Error("skip은 1~10자리여야 한다.");
    }

    s = s.toLowerCase();
    skip = skip.toLowerCase();

    if([...s].some(x => x.charCodeAt() < 97 || x.charCodeAt() > 122)){
        throw new Error("s는 알파벳 소문자로만 이뤄져야 합니다.");
    }

    if([...skip].some(x => x.charCodeAt() < 97 || x.charCodeAt() > 122)){
        throw new Error("s는 알파벳 소문자로만 이뤄져야 합니다.");
    }

    const arrSkip = [...skip];
    let result = "";    

    for(let i = 0; i < s.length; i++){        
        let ascii = s[i].charCodeAt();
        
        for(let j = 1; j <= index; j++){
            ascii += 1;
            if(ascii > 122)ascii = 97;

            if(arrSkip.includes(String.fromCharCode(ascii))){
                ascii += 1;
            }
        }

        result += String.fromCharCode(ascii);        
    }        

    return result;
}

const result = solution("aukks", "wbqd", 5);
console.log(result);
*/

solution(90, 500, [70,70,0], [0,0,500], [100,100,2], [4,8,1]) // 499

function solution(a, b, g, s, w, t) {
    let 금 = 0, 은 = 0, 시간 = 0;
    
    let kingdoms = [];
    for(let kingdom = 0; kingdom < g.length; kingdom++){
        //[time, haveGole, haveSilver, haveWeight];
        kingdoms.push([t[kingdom], g[kingdom], s[kingdom], w[kingdom]])
    }
    console.log("first",kingdoms)

    for(let time = 1; (금 + 은) <= (a + b); time++){ // 시간 i
        console.log("time :", time)
        for(let i = 0; i < g.length; i++){
            if(time == kingdoms[i][0]){
                console.log('금 :', 금,'은 :', 은 )
                console.log('kindoms[i] 처음:', kingdoms[i])
                if(금 <= a){
                    if(kingdoms[i][1] >= kingdoms[i][3]){
                        금 += kingdoms[i][3];
                        kingdoms[i][1] -= kingdoms[i][3];
                        kingdoms[i][3] = 0;
                    }else{
                        금 += kingdoms[i][1];
                        kingdoms[i][1] = 0;
                        kingdoms[i][3] -= kingdoms[i][1];
                    }
                    if( 금 > a ){
                        let m = 금 - a;
                        금 -= m;
                        kingdoms[i][3] += m;
                    }
            }
            console.log('kindoms[i]: 금을 지나고', kingdoms[i])
            if(은 <= b){
                    if(kingdoms[i][3] > 0){
                        if(kingdoms[i][2] >= kingdoms[i][3]){
                            은 += kingdoms[i][3];
                            kingdoms[i][2] -= kingdoms[i][3];
                            kingdoms[i][3] = 0;
                        }else{
                            은 += kingdoms[i][2];
                            kingdoms[i][2] = 0;
                            kingdoms[i][3] -= kingdoms[i][2];
                        }
                        if( 은 > b ){
                            let m = 은 - a;
                            은 -= m;
                            kingdoms[i][3] += m;
                        }
                    }
            }
            console.log('kindoms[i]: 은을 지나고', kingdoms[i])

            if(kingdoms[i][3] < w[i]) {
                kingdoms[i][0] += (t[i]*2);
                kingdoms[i][3] = w[i];
            }
            console.log('kindoms[i]: 초기화 후', kingdoms[i], '금 :', 금,'은 :', 은 )

            }
            

        }
        if(금 + 은 == a + b) return console.log(time)
    }
}


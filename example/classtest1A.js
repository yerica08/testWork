// 1. Calc 클래스를 만드세요. 
//      1) 생성자 함수는 두 개의 정수를 전달 받습니다.
//      2) 전달 받은 두 개의 정수에 대해서 사칙연산을 수행하는 네 개의 메서드 sum, sub, multiple, divide를 만드세요. 
//
// (예)
// const obj = new Calc(6, 3);
//
// console.log(obj.sum());   // 9
// console.log(obj.sub());   // 3
// console.log(obj.multiple());   // 18
// console.log(obj.divide());   // 2

class Calc{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    sum(){
        return this.x + this.y;
    }

    sub(){
        return this.x - this.y;
    }

    multiple(){
        return this.x * this.y;
    }

    divide(){
        return this.x / this.y;
    }
}

const obj1 = new Calc(6, 3);

console.log(obj1.sum());   // 9
console.log(obj1.sub());   // 3
console.log(obj1.multiple());   // 18
console.log(obj1.divide());   // 2

// 2. Numbers 클래스를 만드세요. 
//      1) 생성자는 1~10까지의 정수 배열을 전달 받습니다. 
//      2) 전달 받은 정수들중 짝수만 리턴하는 getEven 메서드를 만드세요
//      3) 전달 받은 정수들중 홀수만 리턴하는 getOdd 메서드를 만드세요

class Numbers {
    constructor(arr){
        this.arr = arr;
    }

    getEven(){
        return this.arr.filter(x => !(x % 2));

        // //  혹은
        // const ret = [];
        // for(let i = 0; i < this.arr.length; i++){
        //     if(this.arr[i] % 2 === 0){
        //         ret.push(this.arr[i]);
        //     }
        // }

        // return ret;
    }

    getOdd(){
        return this.arr.filter(x => x % 2);

        // //  혹은
        // const ret = [];
        // for(let i = 0; i < this.arr.length; i++){
        //     if(this.arr[i] % 2 !== 0){
        //         ret.push(this.arr[i]);
        //     }
        // }

        // return ret;        
    }
}

const obj2 = new Numbers([1,2,3,4,5,6,7,8,9,10]);
console.log(obj2.getEven());
console.log(obj2.getOdd());

// 3. Name 클래스를 만드세요
//      1) 생성자는 아무런 값도 받지 않습니다.
//      2) firstName, lastName 프로퍼티를 추가하세요
//      3) fullName setter함수를 작성하세요. 
//          const obj = new Name();
//          obj.fullName = "예리 윤"; 
//          
//          위 코드 실행시 공백을 기준으로 문자열을 나눠서 //
//          this.lastName에는 "윤", this.firstName = "예리" 가 저장되어야 합니다.
//
//      4) fullName getter 함수를 작성하세요. 
//          console.log(obj.fullName);  // 예리 윤
class Name {
    constructor(){
        this.firstName = "";
        this.lastName = "";
    }

    get fullName(){
        return `${this.firstName} ${this.lastName}`;
    }

    set fullName(name){
        [this.firstName, this.lastName] = name.split(" ");

        // // 혹은
        // const splitedName = name.split(" ");
        // this.firstName = splitedName[0];
        // this.lastName = splitedName[1];
    }

}

const obj3 = new Name();
obj3.fullName = "예리 윤";
console.log(obj3.fullName);
console.log(obj3.firstName);
console.log(obj3.lastName);


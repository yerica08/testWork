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

class Calc {
   constructor(a, b) {
      this.a = a
      this.b = b
   }
   sum() {
      return this.a + this.b
   }
   sub() {
      return this.a - this.b
   }
   multiple() {
      return this.a * this.b
   }
   divide() {
      return this.a / this.b
   }
}

const obj = new Calc(6, 3)
console.log('더하기 : ' + obj.sum())
console.log('빼기 : ' + obj.sub())
console.log('곱하기 : ' + obj.multiple())
console.log('나누기 : ' + obj.divide())

// 2. Numbers 클래스를 만드세요.
//      1) 생성자는 1~10까지의 정수 배열을 전달 받습니다.
//      2) 전달 받은 정수들중 짝수만 리턴하는 getEven 메서드를 만드세요
//      3) 전달 받은 정수들중 홀수만 리턴하는 getOdd 메서드를 만드세요

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

class Number {
   getEven(arr) {
      // filter는 배열의 요소로만 얕은 복사를 만들어준다.
      return arr.filter((num) => num % 2 === 0)
   }
   getOdd(arr) {
      return arr.filter((num) => num % 2 !== 0)
   }
}
const number = new Number()
console.log('짝수만 리턴 : ' + number.getEven(array))
console.log('홀수만 리턴 : ' + number.getOdd(array))

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
   get fullName() {
      return this.firstName + ' ' + this.lastName
   }
   set fullName(name) {
      const names = name.split(' ')
      this.lastName = names[0]
      this.firstName = names[1]
   }
}

const person = new Name()
person.fullName = '윤 예리'
console.log('한글 이름 순서 바꾸기 : ' + person.fullName)
console.log(person.firstName)
console.log(person.lastName)
console.log(person)

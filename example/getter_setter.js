// const BankAccount = {
//    myMoney: 10000,

//    get spend() {
//       return this.myMoney
//    },

//    set spend(amount) {
//       if (amount >= 1000) {
//          if (this.myMoney >= amount) {
//             this.myMoney -= amount // 잔액에서 출금액 차감
//          } else {
//             console.log('잔액이 부족합니다.')
//          }
//       } else {
//          console.log('1,000원 부터 출금 가능합니다.')
//       }
//    },
// }

// // 초기 잔액 설정
// BankAccount.spend = 1000

// // 잔액 확인
// console.log(BankAccount.spend)
// ------------------------------------------------------------------
// class BankAccount {
//    constructor(myMoney) {
//       this.myMoney = myMoney
//    }
//    get spend() {
//       return this.myMoney
//    }
//    set spend(amount) {
//       if (amount >= 1000) {
//          if (this.myMoney >= amount) {
//             this.myMoney -= amount // 잔액에서 출금액 차감
//          } else {
//             console.log('잔액이 부족합니다.')
//          }
//       } else {
//          console.log('1,000원 부터 출금 가능합니다.')
//       }
//    }
// }
// const user = new BankAccount(10000)
// user.spend = 1000
// console.log(user.spend)
//----------------------------------------------------------------------
/*function user(name, birthday) {
   this.name = name
   this.birthday = birthday

   // age는 현재 날짜와 생일을 기준으로 계산됩니다.
   Object.defineProperty(this, 'age', {
      get() {
         let todayYear = new Date().getFullYear()
         return todayYear - new Date(this.birthday).getFullYear()
      },
   })
}

let john = new user('John', '1992-6-1')

console.log(john.birthday) // birthday를 사용할 수 있습니다.
console.log(john.age) // age 역시 사용할 수 있습니다.*/

function user(name, birthday) {
   this.name = name
   this.birthday = birthday
   this.age = function () {
      let todayYear = new Date().getFullYear()
      return todayYear - new Date(this.birthday).getFullYear()
   }
}

let john = new user('John', '1992-12-20')

console.log(john.birthday) // 1992-12-20
console.log(john.age()) // 32

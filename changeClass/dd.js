// const test = {
//     object : {name : "kim"}, // {"name":"kim"}
//     string : 'string', // "string"
//     number : 28, // 28
//     array: [1, 2, 3], // [1,2,3]
//     boolean1: true, // true
//     boolean2: false, // false
//     empty1 : null, // null
//     empty2 : undefined, // 출력 X
//     [Symbol("id")]: 123, // 출력 X
//     function : function Fnc(){
//         console.log("hi");  
//       }, // 출력 X
// }
// let json = JSON.stringify(test);

// console.log(json);
// // 출력 : {"object":{"name":"kim"},"string":"string","number":28,"array":[1,2,3],"boolean1":true,"boolean2":false,"empty1":null}

// const obj = {
//     name : "lee",
//     height : 164,
//     weight : 50
// }
// function replacer(key, value){
//     //if(!key) return false;

//     if(typeof value === 'number'){
//         return undefined;
//     }
//     return value;
// }
// //let replacer1 = JSON.stringify(obj, ["name", "height"]);
// //console.log(replacer1);

// let replacer2 = JSON.stringify(obj, replacer);
// console.log(replacer2);
// const number = {
//     first : 1,
//     toJSON(){
//         return this.first;
//     }
// }
// console.log(JSON.stringify(number))

// const obj = {
//     name : "kim",
//     age : 28,
//     toJSON(){
//         let newObj = "";
//         for (let key in this){
//             if(typeof this[key] == 'number' && key !== 'toJSON') {
//                 newObj += this[key];
//             }
//         }
//         return newObj;
//     }
// }
// console.log(JSON.stringify(obj))

// let number = {
//     first: 1,
//     toJSON() {
//       return this.first;
//     }
//   };
//   let test = {
//     title: "숫자",
//     number
//   };
//   console.log( JSON.stringify(test) );
  /*
    {
      "title":"숫자",
      "number": 1
    }
  */

    // const users = {
    //     name : 'kim',
    //     age : 28
    // }
    // let json = JSON.stringify(users);
    
    // console.log(json) // 출력 : {"name":"kim","age":28}

    // console.log(JSON.parse(json)) // 출력 : { name: 'kim', age: 28 }

    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}
    // {age : "name1"}

    // var는 함수단위의 스코프
  foo()
    function foo(){
      for(var i = 0; i < 3; i++){
        console.log(i);
      }
      console.log("!",i)
    }
    //console.log(i)

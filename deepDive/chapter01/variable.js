{
console.log(score);
score = 80;
var score;
console.log(score);
}

{
const foo = x = 100;
console.log(x); // 100
console.log(foo); // 100

if(foo = 200){
    console.log(x); // 100
    console.log(foo); // 200
}else if(x = 200){
    console.log(x); // 200
    console.log(foo); // 100
}

console.log(10 / 0);
}

{
label : {
    console.log(1)
    break label;
    console.log(2)
}
console.log("done!")
}

{
console.log(1 + '1')
console.log(1 - '1')
console.log('1' + 1)
console.log('1' - 1)
console.log(!!0)
console.log(!0)

console.log("cat" && "dog") // dog
console.log(null && null) // null
console.log(null && false) // null
console.log(false && null) // false
console.log(1 && false) // false
console.log(undefined && false) // undefined
console.log(false && undefined) // false

console.log(null || null) // null
console.log(null || false) // false
console.log(false || null) // null
console.log(1 || false) // 1
console.log(undefined || false) // false
console.log(false || undefined) // undefined
}

{
const empty = {};
//console.log(typeof empty);

empty.name = "emp";
empty["name2"] = "emp2";

console.log(empty);
}

{
const score = 80;
const copy = score;

console.log(score);
console.log(copy);

score = 100;

console.log(score);
console.log(copy);
}

{
const person1 = {
    name: "Lee"
}
const person2 = {
    name: "Lee"
}

console.log(person1 === person2)
console.log(person1.name === person2.name)
}

{
const fnc = function (x,y){
    console.log(x+y)
}
fnc(2,3)
}

{
    const a = {
        name : "kim",
        age : "24"
    }
    const b = a;

    b.name = "yoon";

    console.log(a)
}

{
    const num = 100;
    const person = {name : "lee"};

    function changeVal (a, b){
        a += 100;
        b.name = "yoon"
    }
    changeVal(num,person);

    console.log(num)
    console.log(person)
}

{
    const a = 100;
    let b = 50;
    function changeVal(a,b){
        a += 100;
        b += 100;
        console.log(a);
        console.log(b);
    }
    changeVal(a,b);
    console.log(a);
    console.log(b);
}

{
(function (a){
    console.log(a);
}(1))

(function (a){
    console.log(a);
})(1)

!function (a){
    console.log(a);
}(1)

+function (a){
    console.log(a);
}(1)
}

{
    function repeat(n, f){
        for(let i = 0; i < n; i++){
            f(i);
        }
    }
    const logAll = function(i){
        console.log(i);
    };
    repeat(5, logAll);
}
{
    const x = "global";
    function foo(){
        const x = "local";
        console.log(x);
    }
    foo();
    console.log(x);
}
{
    const x = 1;
    function foo(){
        const x = 10;
        bar();
    }
    function bar(){
        console.log(x);
    }
    foo();
    bar();
}
{
    const x = "global";
    function foo(){
        console.log(x);
        const x = "local";
        
    }
    foo();
    console.log(x);
}
{
    const person = {};
    Object.defineProperty(person, 'firstName', {
        value: 'Ungmo',
        writable: true,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(person, 'lastName', {
        value: 'Lee'
    });

    let descriptor = Object.getOwnPropertyDescriptor(person, 'firstName');
    console.log(descriptor);

    descriptor = Object.getOwnPropertyDescriptor(person, 'lastName');
    console.log(descriptor);

    console.log(Object.keys(person));

    // Object.defineProperty(person, 'lastName', {
    //     value: 'Lee',
    //    enumerable: true
    // });

    Object.defineProperty(person, 'fullName', {
        get(){
            return `${this.firstName} ${this.lastName}`;
        },
        set(name){
            [this.firstName, this.lastName] = name.split(' ');
        },
        enumerable: true,
        configurable: true
    });

    descriptor = Object.getOwnPropertyDescriptor(person, 'fullName');
    console.log(descriptor);

    person.fullName = 'yeri yoon';
    console.log(person)
}
{
    console.log(1 * null);
    console.log(1 * undefined);
}
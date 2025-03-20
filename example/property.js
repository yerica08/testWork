let user = {
   name: 'park',
   height: 180,
   weight: 70,
   성격: '밝음',
}
/*
let descriptor = Object.getOwnPropertyDescriptor(user, 'name')
console.log(descriptor)
console.log(Object.getOwnPropertyDescriptors(user))
** 출력결과
{ value: 'park', writable: true, enumerable: true, configurable: true }
{
  name: {
    value: 'park',
    writable: true,
    enumerable: true,
    configurable: true
  },
  height: { value: 180, writable: true, enumerable: true, configurable: true },
  weight: { value: 70, writable: true, enumerable: true, configurable: true },
  '성격': { value: '밝음', writable: true, enumerable: true, configurable: true }
}
*/

/*
Object.defineProperty(user, 'like', { value: 'rice', writable: true })
Object.defineProperty(user, 'height', { value: 200 })
console.log(Object.getOwnPropertyDescriptors(user))
** 출력결과
{
  name: {
    value: 'park',
    writable: true,
    enumerable: true,
    configurable: true
  },
  height: { value: 200, writable: true, enumerable: true, configurable: true },
  weight: { value: 70, writable: true, enumerable: true, configurable: true },
  '성격': { value: '밝음', writable: true, enumerable: true, configurable: true },
  like: {
    value: 'rice',
    writable: true,
    enumerable: false,
    configurable: false
  }
}
*/
/*
console.log(
   Object.defineProperties(user, {
      name: {
         value: 'kim',
         writable: false,
      },
      like: {
         value: 'rice',
         writable: true,
      },
   })
)
console.log(Object.getOwnPropertyDescriptor(user, 'like'))

{ name: 'kim', height: 180, weight: 70, '성격': '밝음' }
{
  value: 'rice',
  writable: true,
  enumerable: false,
  configurable: false
}*/

/*
Object.defineProperties(user, {
   name: {
      value: 'kim',
      writable: false,
   },
   like: {
      value: 'rice',
      writable: true,
   },
})
console.log(Object.getOwnPropertyDescriptors(user))*/

// let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(user))
let clone = {}
for (let key in user) {
   clone[key] = user[key]
}
console.log(clone)

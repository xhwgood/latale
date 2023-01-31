// @ts-check
const mocket = () => {
  /** 当前等级 */
  let level = 0
  /** 强化次数 */
  let count = 0

  while (1) {
    count++
    if (level < 10) {
      level++
    } else if (level >= 10 && level < 20) {
      if (Math.random() < 0.7) {
        level++
      } else {
        level = 10
      }
    } else {
      if (Math.random() < 0.6) {
        level++
        if (level == 30) {
          break
        }
      } else {
        level = 20
      }
    }
  }
  return count
}
console.time('本次耗时')
const num = 1000000
let sum = 0

for (let i = 0; i < num; i++) {
  sum += mocket()
}
console.timeEnd('本次耗时')

console.log(`强化了${num}次，平均耗费${sum / num}个`)
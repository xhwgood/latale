// @ts-check
const iceFlower = () => {
  /** 当前等级 */
  let level = 0
  /** 强化次数 */
  let count = 0

  while (1) {
    count++
    if (Math.random() < 0.55) {
      level++
      if (level == 10) {
        break
      }
    } else if (level > 0) {
      level--
    }
  }
  return count
}
console.time('冰花')
const num = 10
let sum = 0

for (let i = 0; i < num; i++) {
  sum += iceFlower()
}
console.timeEnd('冰花')

console.log(`强化了${num}次，平均耗费${sum / num}个`)
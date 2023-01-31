// @ts-check
/** 当前成功率 */
const successRate = 0.6 + 0.14
/**
 * @param {number} level 当前等级
 */
const associationJewelry = (level = 0) => {
  /** 强化次数 */
  let count = 0

  while (1) {
    count++
    if (count < 3) {
      if (Math.random() < successRate) {
        level++
      }
    } else {
      if (Math.random() < successRate) {
        level++
        if (level == 9) {
          break
        }
      } else {
        level = 3
      }
    }
  }
  return count
}

console.time('公会首饰')
const num = 1000000
let sum = 0

for (let i = 0; i < num; i++) {
  sum += associationJewelry(7)
}
console.timeEnd('公会首饰')

console.log(`强化成功率为${successRate}，强化了${num}次，平均耗费${sum / num}个`)
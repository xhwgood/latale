const showPerc = require('../utils/showPerc')
/** 全能 最大值 */
const ABILITIES_MAX = 32000
/** 全能% 最大值 */
const ABILITIES_PERC_MAX = 55
/** 最小伤 最大值 */
const MIN_DAMAGE_MAX = 250

const clothes = ({ abilities, abilitiesPerc, minDamage }) => {
  let success = 1
  let count = 0

  if (abilities) {
    count++
    success *= (abilities / ABILITIES_MAX)
  }
  if (abilitiesPerc) {
    count++
    success *= (abilitiesPerc / ABILITIES_PERC_MAX)
  }
  if (minDamage) {
    count++
    success *= (minDamage / MIN_DAMAGE_MAX)
  }
  const final = success * Math.pow(0.65, count)

  console.log('属性成功率：', showPerc(success))
  console.log('最终成功率：', showPerc(final))
  console.log('成本为：', (count * 2 / final).toFixed(2), '亿')
}

clothes({
  abilities: 19358,
  abilitiesPerc: 49
})
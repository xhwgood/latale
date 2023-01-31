const showPerc = require('../utils/showPerc')

const SHOOTING = 130
const MAX_DAMAGE = 250
const FIXED_DAMAGE = 45

const hat = ({ shooting, maxDamage, fixedDamage }) => {
  let success = 1
  let count = 0

  if (shooting) {
    count++
    success *= (shooting / SHOOTING)
  }
  if (maxDamage) {
    count++
    success *= (maxDamage / MAX_DAMAGE)
  }
  if (fixedDamage) {
    count++
    success *= (fixedDamage / FIXED_DAMAGE)
  }

  const final = success * Math.pow(0.65, count)

  console.log('属性成功率：', showPerc(success))
  console.log('最终成功率：', showPerc(final))
  console.log('成本为：', (count * 2 / final).toFixed(2), '亿')
}

hat({
  maxDamage: 213,
  shooting: 89
})
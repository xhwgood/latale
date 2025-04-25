// @ts-check
/** 敲50%的次数，默认1 */
const ONE_50_NUM = 1
/** 敲60%的次数，默认1 */
const ONE_60_NUM = 1
/** 当前获取到的大伤 */
const maxValue = 174
/** 当前获取到的爆伤 */
const criticalValue = 89

const calculate = () => {
  /** 大伤最大值 */
  const MAX_MAX_VALUE = 220
  /** 爆伤最大值 */
  const MAX_CRITICAL_VALUE = 150

  /** 一次50%的成本：一个白金锤+0.5亿 */
  const oneCost = 1.5 + 0.5
  /** 一次60%的成本：2个白金锤+1亿 */
  const twoCost = 2 * 1.5 + 1

  /** 武器成本 */
  const weaponCost = 1

  const totalCost = oneCost * ONE_50_NUM + twoCost * ONE_60_NUM + weaponCost
  /** 大伤数学期望 */
  const maxRate = ((MAX_MAX_VALUE - maxValue) * 2) / MAX_MAX_VALUE
  /** 爆伤数学期望 */
  const criticalRate = ((MAX_CRITICAL_VALUE - criticalValue) * 2) / MAX_CRITICAL_VALUE

  console.log('大伤数学期望为 maxRate：', maxRate.toFixed(2))
  console.log('爆伤数学期望为 criticalRate：', criticalRate.toFixed(2))

  const expect = Math.pow(0.5, ONE_50_NUM) * Math.pow(0.6, ONE_60_NUM) * maxRate * criticalRate

  console.log('最终成本为：', (totalCost / expect).toFixed(0), '亿')
}

calculate()
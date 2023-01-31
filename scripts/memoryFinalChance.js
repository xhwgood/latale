/** 凯内佩的记忆 */
const KNP = [{
  chance: 0.3593,
  min: 1,
  max: 3,
}, {
  chance: 0.2994,
  min: 1,
  max: 5
}, {
  chance: 0.2096,
  min: 2,
  max: 7
}, {
  chance: 0.0898,
  min: 2,
  max: 9
}, {
  chance: 0.0419,
  min: 3,
  max: 15
}]

const memoryFinalChance = (arr = KNP) => {
  /**
   * @type {Map<number, number>}
   */
  const memo = new Map()

  arr.forEach(({ chance, min, max }) => {
    const step = max - min + 1
    for (let i = min; i <= max; i++) {
      if (memo.has(i)) {
        memo.set(i, memo.get(i) + chance / step)
      } else {
        memo.set(i, chance / step)
      }
    }
  })

  for (const [v, chance] of memo.entries()) {
    const show = (chance * 100).toFixed(3)
    console.log(v, '几率为：', show + '%')
  }
  return memo
}

memoryFinalChance()
// 通用方法和变量

/**
 * 获取随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机数
 */
export const getRandom = (min = 1, max = 6) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

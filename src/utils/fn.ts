/** 节流，默认延迟时间 300ms */
export const throttle = (fn: Function, delay = 300) => {
  let timer: NodeJS.Timeout | null
  return (...args: any) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}
/**
 * 从 `localStorage` 中读取数据（不适用字符串类型的数据）
 * @param key 
 * @param defaultItem 默认值
 */
export const getLSItem = <T>(key: string, defaultItem?: T): T => {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultItem))
}
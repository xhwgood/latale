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
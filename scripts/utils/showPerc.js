const show = (num) => {
  if (!num) {
    console.error('必须传入数字')
    return
  }
  const show = (num * 100).toFixed(3) + '%'
  return show
}

module.exports = show
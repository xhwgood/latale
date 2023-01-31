const damage = () => {
  let count = 0
  for (let i = 0; i < 1000000; i++) {
    if (Math.random() < 0.01) {
      count += 10000
    }
  }
  return count
}

console.log(damage());
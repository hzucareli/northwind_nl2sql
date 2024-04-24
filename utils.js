const getEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`)
  }
  return process.env[key]
}

const funnyNOK = [
  '(ง •̀_•́)ง', '(´ ͡༎ຶ  ͜ʖ  ͡༎ຶ )', 'ಠ_ಠ', '｡°(°.◜ᯅ◝°)°｡', '🥀', '🤔', '🤨', '😒', '😑', '🥶', '😰'
]

const funnyOK = [
  '( ˘ ³˘)♥', 'ᕕ( ᐛ )ᕗ', '(~‾▿‾)~', '(˶ᵔ ᵕ ᵔ˶)', '🤩', '🤗'
]

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const randomList = (arr) => arr[random(0, arr.length - 1)]

const padCenter = (str, maxLen, padStr) => str.padStart((str.length + maxLen) / 2, padStr).padEnd(maxLen, padStr)

const emojis = {
  ok: funnyOK,
  nok: funnyNOK
}

// console.log(utils.padCenter(utils.randomList(utils.emojis.ok), 80, ' '))

export {
  getEnv,
  emojis,
  random,
  randomList,
  padCenter

}

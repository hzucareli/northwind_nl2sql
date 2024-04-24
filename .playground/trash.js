
const checkAnswer = (desiredAnwer, answer) => {
  let isCorrect = desiredAnwer === answer
  if (desiredAnwer === null) {
    isCorrect = null
  }
  const emojiStr = isCorrect ? utils.randomList(utils.emojis.ok) : utils.randomList(utils.emojis.nok)
  const isCorrectStr = isCorrect !== null ? isCorrect ? '✅' : '❌' : '❓'
  return { isCorrect, emojiStr, isCorrectStr }
}



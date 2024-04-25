import basicChain from './basicChain.js'
import naturalLanguageChain from './naturalLanguageChain.js'
import northWindDBChain from './northWindDBChain.js'

const getChain = async ({ llm, db }, chainType = 'specialized') => {
  switch (chainType) {
    case 'specialized':
      return northWindDBChain({ llm, db })
    case 'specialized:results-nl':
      return naturalLanguageChain({ llm, db, originalChain: await getChain({ llm, db }, 'specialized') })
    default:
      return await basicChain({ llm, db, dialect: 'mysql' })
  }
}

const availebleChains = {
  basicChain,
  northWindDBChain,
  naturalLanguageChain
}

export {
  getChain,
  availebleChains as chains
}

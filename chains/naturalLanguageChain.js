import {
  RunnablePassthrough,
  RunnableSequence
} from '@langchain/core/runnables'
import { PromptTemplate } from '@langchain/core/prompts'

const naturalLanguageChain = ({ llm, db, originalChain }) => {
  console.log('using northWindDBChain with natural language response')
  const finalResponsePrompt = PromptTemplate.fromTemplate(`Based on the table schema below, question, sql query, and sql response, write a natural language response:
{schema}

Question: {question}
SQL Query: {query}
SQL Response: {response}`)

  const chain = RunnableSequence.from([
    RunnablePassthrough.assign({
      query: originalChain
    }),
    {
      schema: async () => db.getTableInfo(),
      question: (input) => input.question,
      query: (input) => input.query,
      response: (input) => db.run(input.query)
    },
    finalResponsePrompt,
    llm
  ])

  return chain
}

export default naturalLanguageChain

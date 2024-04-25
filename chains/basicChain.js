import { createSqlQueryChain } from 'langchain/chains/sql_db'

const basicChain = ({ llm, db }) => {
  return createSqlQueryChain({ llm, db, dialect: 'mysql' })
}

export default basicChain

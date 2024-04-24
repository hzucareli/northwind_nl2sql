import {
  RunnablePassthrough,
  RunnableSequence
} from '@langchain/core/runnables'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { createSqlQueryChain } from "langchain/chains/sql_db";


const northWindDBChain = ({ llm, db }) => {
  console.log('using northWindDBChain')
  // Considera que a tabela de vendas é a "orders" e a tabela de itens vendidos é a "order_details".
  // Considera que a tabela de produtos é a "products" e a tabela de categorias de produtos é a "categories".
  // Considera que a tabela de clientes é a "customers" e a tabela de funcionários é a "employees".
  // Considera que a tabela de fornecedores é a "suppliers" e a tabela de transportadoras é a "shippers".
  // Ignore a tabela "invoices" para esta questão.
  // Um pedido pode ter vários itens vendidos, e cada item vendido pode ter um status diferente.
  const prompt = PromptTemplate.fromTemplate(`Considerando o schema abaixo, escreva uma query SQL que responda a pergunta do usuário:
{schema}
Considere que a tabela de vendas é a "orders" e a tabela de itens vendidos é a "order_details".
Considere que a tabela "order_details" contem o status das vendas.
Considere que a tabela "order_details_status" contém a situação atual de um produdo de uma venda.
Considere Um produto vendido deve obrigatoriamente pertencer a uma Order (Venda) com status Shipped ou Closed e este produto deve ter status "Allocated", "Invoiced" ou "Shipped"
Considere um produto vendido, considere sempre as tabelas orders, order_details, orders_status e order_details_status.
Em uma venda não utilize o campo status_name e sim o ID dos campos, para uma melhor performance.
Em um produto vendido não utlize o campo status_name e sim o ID dos campos, para uma melhor performance.

Question: {question}
SQL Query:`)

  const tablesToConsider = ['orders', 'order_details', 'orders_status', 'products', 'customers', 'employees', 'suppliers', 'shippers']

  const sqlQueryGeneratorChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      schema: async () => {
        return db.getTableInfo(tablesToConsider)
      }
    }),
    prompt,
    llm.bind({ stop: ['\nSQLResult:'] }),
    new StringOutputParser()
  ])

  return sqlQueryGeneratorChain
}


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

const getChain = async ({ llm, db }, chainType = 'specialized') => {
  switch (chainType) {
    case 'specialized':
      return northWindDBChain({ llm, db })
    case 'specialized:results-nl':
      const orignalChain = await getChain({ llm, db }, 'specialized')
      return naturalLanguageChain({ llm, db, originalChain: orignalChain })
    default:
      return await createSqlQueryChain({ llm, db, dialect: 'mysql' })
  }
}


export {
  getChain,
  northWindDBChain,
  naturalLanguageChain
}

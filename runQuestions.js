import 'dotenv/config'
import 'colors'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
// import awilix from 'awilix'

import { ChatOpenAI } from '@langchain/openai'
import { SqlDatabase } from 'langchain/sql_db'
import { DataSource } from 'typeorm'

import { getEnv } from './utils.js'
import * as utils from './utils.js'
import { mkdirp } from 'mkdirp'

import { NLQuery } from './lib/NLQuery.js'
import { getChain } from './chains/index.js'

const datasource = new DataSource({
  type: 'mysql',
  host: getEnv('NORTHWIND_DD_HOST'),
  port: getEnv('NORTHWIND_DD_PORT'),
  username: getEnv('NORTHWIND_DD_USER'),
  password: getEnv('NORTHWIND_DD_PASSWORD'),
  database: getEnv('NORTHWIND_DD_DATABASE'),
  connectorPackageName: 'mysql2'
})

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource
})

// db.getTableInfo().then(console.log)
// console.log(db.allTables.map((t) => t.tableName));

const llm = new ChatOpenAI({
  apiKey: getEnv('OPENAI_API_KEY'),
  model: 'gpt-3.5-turbo',
  temperature: 0
})

const PATH = path.dirname(fileURLToPath(import.meta.url))
const PATH_OUTPUT_FILES = path.resolve(PATH, 'output')

mkdirp(PATH_OUTPUT_FILES)

const questions = [
  { id: 1, question: 'Quais são os produtos mais populares entre os clientes corporativos?', desiredAnwer: null },
  { id: 2, question: 'Quais são os produtos mais vendidos em termos de quantidade?', desiredAnwer: null },
  { id: 3, question: 'Qual é o volume de vendas por cidade?', desiredAnwer: null },
  { id: 4, question: 'Quais são os clientes que mais compraram?', desiredAnwer: null },
  { id: 5, question: 'Quais são os produtos mais caros da loja?', desiredAnwer: null },
  { id: 6, question: 'Quais são os fornecedores mais frequentes nos pedidos?', desiredAnwer: null },
  { id: 7, question: 'Quais os melhores vendedores?', desiredAnwer: null },
  { id: 8, question: 'Qual é o valor total de todas as vendas realizadas por ano?', desiredAnwer: null },
  { id: 9, question: 'Qual é o valor total de vendas por categoria de produto?', desiredAnwer: null },
  { id: 10, question: 'Qual o ticket médio por compra?', desiredAnwer: null }
]

const doExecuteQuery = process.argv.includes('--execute')
const returnNLResults = process.argv.includes('--nl-results')

const chainType = returnNLResults ? 'specialized:results-nl' : 'specialized'

// specialized:results-nl | specialized | basic
const chain = await getChain({ llm, db }, chainType)

const nlq = new NLQuery({ db, llm, chain })

let exitCode = 0

try {
  for (const { id, question } of questions) {
    const sql = await nlq.generateQuery(question)

    console.log(''.padStart(80, '=~'))
    console.log(`Questáo ${id}: ${question.yellow}`)
    console.log(utils.padCenter('SQL Gerado', 80, '~'))
    console.log(sql)

    const outputData = {
      id,
      question,
      query: sql
    }

    if (doExecuteQuery) {
      const res = await nlq.runQuery(sql)
      outputData.result = res
    }

    await fs.writeFile(`${PATH_OUTPUT_FILES}/${id}.json`, JSON.stringify(outputData, null, 2))
  }
} catch (err) {
  console.error(err)
  exitCode = 1
  console.log(utils.padCenter('ERRO', 80, '='))
}

console.log(utils.padCenter('FIM', 80, '='))

process.exit(exitCode)

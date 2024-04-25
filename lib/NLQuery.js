class NLQuery {
  constructor ({ db, llm, chain }) {
    this.db = db
    this.llm = llm
    this.chain = chain
  }

  async generateQuery (question) {
    const sqlResponse = await this.chain.invoke({
      question
    })
    return sqlResponse
  }

  async runQuery (query) {
    try {
      const response = await this.db.run(query)
      return JSON.parse(response)
    } catch (error) {
      return error
    }
  }

  async run (question) {
    const sqlResponse = await this.generateQuery(question)
    return await this.runQuery(sqlResponse)
  }
}

export {
  NLQuery
}

# Northwind NL2SQL

## Overview
Northwind NL2SQL is tool designed to bridge the gap between natural language queries and SQL database queries. It takes in user-friendly natural language questions and converts them into structured SQL queries that can be directly executed on a database. This tool aims to simplify the process of querying databases, especially for users who are not familiar with SQL syntax.

## Features
- **Natural Language Processing (NLP) Integration**: Utilizes state-of-the-art NLP techniques to parse and understand user queries.
- **SQL Generation**: Generates SQL queries based on the parsed natural language input.
- **Query Execution**: Executes the generated SQL queries on the connected database.

## Installation
```sh
git clone git@github.com:hzucareli/northwind_nl2sql.git
cd northwind_nl2sql
npm i
node runQuestions.js 
```

### Usage
```sh
node runQuestions.js --execute # will execute de queries
```

## Configuration
- Edit the `.env` file to specify database connection details and OpenAI Key and optionally the LangSmith key for better monitoring the LangChain.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links
- [OpenAI](https://openai.com) for their language models
- [LangChain](https://js.langchain.com/) The tramework used for this project
- [LangSmith](https://smith.langchain.com/) For better control of the LLM lifecycle
- [MySQL](https://www.mysql.com/) The Database used in this project

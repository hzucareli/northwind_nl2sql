import os
os.environ["OPENAI_API_KEY"] = ""


#  pip install langchain_openai langchain_community langchain pymysql chromadb -q

db_user = ""
db_password = ""
db_host = ""
db_name = ""

from langchain_community.utilities.sql_database import SQLDatabase
db = SQLDatabase.from_uri(f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}")
print(db.dialect)
print(db.get_usable_table_names())
print(db.table_info)

from langchain.chains import create_sql_query_chain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
generate_query = create_sql_query_chain(llm, db)

# query = generate_query.invoke({"question": "Quais são os produtos mais vendidos em termos de quantidade? return product_name, quantity"})
# # "what is price of `1968 Ford Mustang`"
# print(query)

from operator import itemgetter

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough

answer_prompt = PromptTemplate.from_template(
    """Given the following user question, corresponding SQL query, and SQL result, answer the user question.

Question: {question}
SQL Query: {query}
SQL Result: {result}
Answer: """
)

rephrase_answer = answer_prompt | llm | StrOutputParser()

chain = (
    RunnablePassthrough.assign(query=generate_query).assign(
        result=itemgetter("query") | db.execute_query | itemgetter("result")
    )
    | rephrase_answer
)

chain.invoke({"question": "Quais são os produtos mais vendidos em termos de quantidade? return product_name, quantity"})


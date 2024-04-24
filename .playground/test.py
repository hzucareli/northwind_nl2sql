from openai import OpenAI


openai_key = ""

client = OpenAI(api_key=openai_key)
import mysql.connector

# Set up OpenAI API key

db_user = ""
db_password = ""
db_host = ""
db_name = ""

# Function to execute SQL queries
def execute_sql_query(query):
    try:
        # Connect to MySQL database
        connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )

        cursor = connection.cursor()

        # Execute the SQL query
        cursor.execute(query)

        # Fetch all rows
        result = cursor.fetchall()

        # Close cursor and connection
        cursor.close()
        connection.close()

        return result

    except Exception as e:
        return f"An error occurred: {e}"

# Function to convert natural language query to SQL
def nl_to_sql(natural_language_query):
    # Use Langchain to generate SQL query based on the natural language query
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": "You are a database administrator."},
          {"role": "user", "content": natural_language_query}
        ],
        # prompt=natural_language_query,
        max_tokens=100
    )

    # Extract the SQL query from the response
    # sql_query = response.choices[0].text.strip()
    print(response.choices)

    return response.choices[0].message.content.strip()

# Example natural language query
natural_language_query = "Quais são os produtos mais vendidos em termos de quantidade? return product_name, quantity. retorne apenas o sql"
# Convert natural language query to SQL
sql_query = nl_to_sql(natural_language_query)

print(sql_query)

# Execute the SQL query against the MySQL database
result = execute_sql_query(sql_query)

# Display the result
for row in result:
    print(row)
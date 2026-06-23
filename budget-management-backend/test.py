from google import genai

client = genai.Client(
    api_key="AQ.Ab8RN6K94nGyGtaFv58qzskQwa3j_YADkA2hX0QybFZ0xvYS1g"
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="hello"
)

print(response.text)
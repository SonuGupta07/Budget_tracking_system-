# from google import genai

# client = genai.Client(api_key="AQ.Ab8RN6LvDIHUh33ghNIh6aZ9WbrV0DdqHLuI7UvDhOGVeGxnXw")

# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents="Hello"
# )

# print(response.text)
import google.generativeai as genai

API_KEY = "AQ.Ab8RN6LvDIHUh33ghNIh6aZ9WbrV0DdqHLuI7UvDhOGVeGxnXw"

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

response = model.generate_content("Hello")

print(response.text)
AQ.Ab8RN6LvDIHUh33ghNIh6aZ9WbrV0DdqHLuI7UvDhOGVeGxnXw
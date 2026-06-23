from google import genai

API_KEY = "AQ.Ab8RN6I2RRsg4rRZkEvURL0Q3zoDXiGr-o2s4Di35FtkNb1uKw"

print("KEY LENGTH:", len(API_KEY))

client = genai.Client(api_key=API_KEY)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Hello"
)

print(response.text)
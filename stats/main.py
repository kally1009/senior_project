import sys
import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

dbUsername = os.getenv('DB_USERNAME')

dbPassword = os.getenv('DB_PASSWORD')

client = pymongo.MongoClient("mongodb+srv://${dbUsername}:${dbPassword}@cluster0.7bo4ldm.mongodb.net/?retryWrites=true&w=majority")

# Database Name
db = client["database"]

# Collection Name
entryCol = db["entries"]

moodQuery = {"mood":5}

# Fields with values as 1 will
# only appear in the result
x = entryCol.find(moodQuery)

for data in x:
	print(data)


sys.stdout.flush()
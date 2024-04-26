import sys
import pymongo
import os
from dotenv import load_dotenv


### ENDED UP NOT GOING THIS ROUTE WITH PYTHON


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
x = entryCol.find()

for data in x:
	print(data)


sys.stdout.flush()

### Queries to write:

# most common mood out of all entries
# Counts for each mood type
# Counts for each activity
# Most common activity
# overlap: most common mood and activity pairing
# Last day of best (5) mood


# Other ideas:
# Mood Frequencies
# Activity Frequencies
# Activities, their frequency, and average mood score.
# Activities, their frequency, and the mood’s standard deviation
# Average mood score difference when an activity is and isn’t present
#Average mood score with the activity present, without the activity, and the difference (table)
#Top 5 activity combinations
#Time series trend
# The time series’ yearly seasonality


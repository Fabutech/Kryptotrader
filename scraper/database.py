# Importing the needed modules for the MongoDB database and to load the json file
from pymongo import MongoClient
import json
from tqdm import tqdm

# This function creates a new connection to the project database on MongoDB and saves the connection in a variable called client and returns it
def get_database():
    # Connection string for our specific database project with the according user
    CONNECTION_STRING = "mongodb://fabutech:A1b2C3d4@ac-ztdqsw1-shard-00-00.a92liiy.mongodb.net:27017,ac-ztdqsw1-shard-00-01.a92liiy.mongodb.net:27017,ac-ztdqsw1-shard-00-02.a92liiy.mongodb.net:27017/?ssl=true&replicaSet=atlas-o46h0m-shard-0&authSource=admin&retryWrites=true&w=majority"

    # Client is being created with the connection string
    client = MongoClient(CONNECTION_STRING, tls=True, tlsAllowInvalidCertificates=True)
 
    # Loads up (or creates if it doesn't exist) the database from the project and returns it
    return client['cryptos']
  
# Main function that saves the data from the json file to the database
def save_data_to_db(filename):
    # The database is loaded with the get_database() function
    db = get_database()

    # The json File is loaded and saved to the data variable (which is automatically a dictionary => Which is a json-format data object)
    data = json.load(open(filename + ".json"))
    # The script iterates through all tokens in "data" and the according collection is loaded (or created if it doesn't exist) for each token
    # In a second step a new data entry is made for each token with the current data
    drop_collection = db["tokens1"]
    drop_collection.drop() 
    collection = db["tokens1"]
    print("Saving data to database:")
    for i in tqdm(range(len(data))):
        collection.insert_one(data[i])
    
    collection.rename('tokens', dropTarget = True)

    print("Successfully saved")

# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
    save_data_to_db("scraped_data_1000_i")
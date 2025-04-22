from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Configure MongoDB Connection
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["CodeSphereDB"]
users_collection = db["users"]
activities_collection = db["user_activities"]
codes_collection = db["codes"]
#creating a user on db
def create_user(full_name, username, email, password):
    """Creates a new user with a hashed password"""
    if users_collection.find_one({"username": username}):
        return {"message": "Username already taken!"}, 400

    if users_collection.find_one({"email": email}):
        return {"message": "Email already registered!"}, 400

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({
        "full_name": full_name,
        "username": username,
        "email": email,
        "password": hashed_password
    })

    log_user_activity(username, "Account Created")

    return {"message": "Signup successful!"}, 201

#geting user info from db
def get_user(username):
    """Fetches a user by username"""
    return users_collection.find_one({"username": username})
#password verification
def verify_password(stored_password, provided_password):
    """Checks if the provided password matches the stored hashed password"""
    return check_password_hash(stored_password, provided_password)
# storing activities
def log_user_activity(username, action):
    """Logs user activity with a maximum of 10 records per user"""
    activities_collection.insert_one({
        "username": username,
        "action": action,
        "timestamp": datetime.utcnow()
    })

    # Count total activities for the user
    total_activities = activities_collection.count_documents({"username": username})

    # If total exceeds 10, remove the oldest record
    if total_activities > 10:
        oldest_activity = activities_collection.find({"username": username}).sort("timestamp", 1).limit(1)
        if oldest_activity:
            activities_collection.delete_one({"_id": oldest_activity[0]["_id"]})

#get resent activities
def get_recent_activities(username, limit=5):
    """Fetch the latest user activities (default: last 5)"""
    return list(activities_collection.find({"username": username}).sort("timestamp", -1).limit(limit))
#save code on db history
def save_code(username, code, language):
    """Saves user code with a maximum limit of 10 records per user"""
    print(f"Saving {language} code for {username}")  

    total_codes = codes_collection.count_documents({"username": username})

    # If the user has more than 10 codes, remove the oldest one
    if total_codes >= 10:
        oldest_code = codes_collection.find({"username": username}).sort("timestamp", 1).limit(1)
        oldest_code = list(oldest_code)  # Convert cursor to list
        if oldest_code:
            print(f"Deleting oldest {language} code") 
            codes_collection.delete_one({"_id": oldest_code[0]["_id"]})

    result = codes_collection.insert_one({
        "username": username,
        "code": code,
        "language": language,
        "timestamp": datetime.utcnow()
    })

    print(f"{language} code saved with ID: {result.inserted_id}")  

#get resend codes 
def get_recent_codes(username, limit=10):
    """Fetch the latest 10 codes from the user"""
    return list(codes_collection.find({"username": username}).sort("timestamp", -1).limit(limit))

from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import json
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

USERS_FILE = 'users.json'

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing data'}), 400

    users = load_users()

    if email in users:
        return jsonify({'error': 'Email already registered'}), 409
    if any(user['username'] == username for user in users.values()):
        return jsonify({'error': 'Username already taken'}), 409

    hashed_password = generate_password_hash(password)
    users[email] = {'username': username, 'email': email, 'password': hashed_password}
    save_users(users)

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier') # Can be email or username
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'Missing data'}), 400

    users = load_users()

    user = None
    # Check if identifier is an email
    if identifier in users:
        user = users[identifier]
    else:
        # Check if identifier is a username
        for email, u_data in users.items():
            if u_data['username'] == identifier:
                user = u_data
                break
    
    if user and check_password_hash(user['password'], password):
        # In a real app, you would generate a session token or JWT here
        return jsonify({'message': 'Login successful', 'username': user['username'], 'email': user['email']}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/user_details', methods=['GET'])
def user_details():
    # In a real app, you would use a session token or JWT to identify the user
    # For this example, we'll just return a placeholder
    return jsonify({'message': 'User details placeholder', 'username': 'test_user', 'email': 'test@example.com'}), 200

# --- Configuration for ASI:One API --- 
ASI_ONE_API_KEY =  "sk_7c1e069c5dc34dd393fead2ecc7e8f896b87bbf5c61d49c682d186dc28e19f12" # Correctly get from environment variable
MODEL = "asi1-mini"
API_URL = "https://api.asi1.ai/v1/chat/completions"

# --- Function to interact with the ASI:One API ---
def get_ai_recommendation(user_query: str) -> str:
    if not ASI_ONE_API_KEY:
        return "Error: ASI_ONE_API_KEY environment variable is not set. Please set it to proceed."

    headers = {
        "Authorization": f"Bearer {ASI_ONE_API_KEY}",
        "Content-Type": "application/json",
    }

    system_message = {
        "role": "system",
        "content": (
            "You are a helpful computer expert AI. Your goal is to assist users in finding the right computer, "
            "providing product leads, and offering recommendations based on their needs. "
            "Be friendly and informative. If you suggest a product, briefly mention its key features, "
            "and encourage the user to ask for more details or other options. "
            "Always provide a lead (e.g., 'Check out the Dell XPS 15...') when recommending a product. "
            "Keep responses concise and direct."
        ),
    }

    user_message = {"role": "user", "content": user_query}

    payload = {
        "model": MODEL,
        "messages": [system_message, user_message],
        "max_tokens": 300,
        "temperature": 0.7,
    }

    response = None
    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        response_data = response.json()
        ai_content = response_data["choices"][0]["message"]["content"]
        return ai_content
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - {response.text if response else 'No response from API'}"
    except requests.exceptions.ConnectionError as conn_err:
        return f"Connection error occurred: {conn_err}. Check API URL or internet connection."
    except requests.exceptions.Timeout as timeout_err:
        return f"Timeout error occurred: {timeout_err}. The request took too long."
    except requests.exceptions.RequestException as req_err:
        return f"An unexpected request error occurred: {req_err}"
    except json.JSONDecodeError:
        return f"Error decoding JSON from API response: {response.text if response else 'No response from API'}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

@app.route('/ai-recommend', methods=['POST'])
def ai_recommend():
    data = request.get_json()
    user_query = data.get('query')
    if not user_query:
        return jsonify({'error': 'No query provided'}), 400
    
    response = get_ai_recommendation(user_query)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
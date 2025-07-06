import json
import requests
from operations import create_entry, update_entry, delete_entry, create_set_entry

# Take API URL input from the user
print(f"""
      -----------Welcome to API operator----------
      Choose the operation you want to be executed:
      1. Create
      2. Update
      3. Delete
      4. Set Create
      """)
choice = int(input("Enter choice: "))
api_url = input("Enter the API URL: ").strip()

# Read payload from JSON file
try:
    with open('payload.json', 'r') as file:
        payload = json.load(file)

    headers = {
        "Content-Type": "application/json",
        # "Authorization": "Bearer YOUR_ACCESS_TOKEN"  # Optional
    }

    if choice == 1:
        response = create_entry(
            api_url=api_url, payload=payload, headers=headers)
    elif choice == 2:
        response = update_entry(
            api_url=api_url, payload=payload, headers=headers)
    elif choice == 3:
        response = delete_entry(
            api_url=api_url, payload=payload)
    elif choice == 4:
        extension = input("Enter the extension: ").strip()
        response = create_set_entry(
            api_url=api_url, extension=extension, payload=payload, headers=headers)
    else:
        print('Invalid Choice')


except FileNotFoundError:
    print("payload.json not found.")
except json.JSONDecodeError:
    print("Invalid JSON in payload.json.")
except requests.exceptions.RequestException as e:
    print("Request failed:", e)

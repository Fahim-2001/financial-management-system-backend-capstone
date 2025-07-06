import requests


def create_entry(api_url, payload, headers):
    for pl in payload:
        response = requests.post(api_url, json=pl, headers=headers)
        if response.status_code in [200, 201]:
            print("Success:", response.json())
        else:
            print("-------------------------Error------------------------\n",
                  response.status_code, response.text)
            break


def update_entry(api_url, payload, headers):
    for pl in payload:
        api_url = api_url + str(pl['id'])
        response = requests.put(api_url, json=pl, headers=headers)
        if response.status_code in [200, 201]:
            print("Success:", response.json())
        else:
            print("-------------------------Error------------------------\n",
                  response.status_code, response.text)
            break


def delete_entry(api_url, payload):
    for pl in payload:
        api_url = api_url + str(pl['id'])
        response = requests.delete(api_url)
        if response.status_code in [200, 204]:
            print("Success: Entry deleted")
        else:
            print("-------------------------Error------------------------\n",
                  response.status_code, response.text)
            break


def create_set_entry(api_url, extension, payload, headers):
    for pl in payload:
        # api_url = f"{api_url}/{pl['loan_id']}/{extension}"
        response = requests.post(f"{api_url}/{pl['loan_id']}/{extension}", json=pl, headers=headers)
        if response.status_code in [200, 201]:
            print("Success:", response.json())
        else:
            print("-------------------------Error------------------------\n",
                  response.status_code, response.text)
            break

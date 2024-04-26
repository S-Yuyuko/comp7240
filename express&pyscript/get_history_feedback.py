import pandas as pd
import json

def csv_to_json(file_path):
    try:
        # Load the CSV file
        data = pd.read_csv(file_path)

        # Convert the DataFrame to a list of dictionaries
        data_dict = data.to_dict(orient='records')

        # Serialize the list of dictionaries to a JSON string
        # Ensure NaN values are converted to null in JSON
        json_data = json.dumps(data_dict, default=str, allow_nan=False)

        # Print the JSON data to stdout for the Node.js process to read
        print(json_data)
        return json_data
    except FileNotFoundError:
        print(json.dumps({"error": "File not found"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

file_path = './csv/user_feedback.csv'
result = csv_to_json(file_path)
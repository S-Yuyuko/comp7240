import os
import csv
import json
import sys
from datetime import datetime

def process_feedback(user_feedback):
    # Define the path and headers for the CSV file
    file_path = './csv/user_feedback.csv'
    headers = ['rating', 'feedback', 'timestamp']  # Add 'timestamp' to the headers

    # Attempt to open and write to the CSV file
    try:
        # Check if the file exists and whether we need to write headers
        file_exists = os.path.isfile(file_path)

        # Open the file in append mode, so data is added at the end of the file
        with open(file_path, mode='a', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=headers)

            # Write headers only if the file does not exist
            if not file_exists:
                writer.writeheader()

            # Add the current timestamp to the user feedback
            user_feedback['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # Write the user feedback data along with the timestamp
            writer.writerow(user_feedback)

        # Successfully processed feedback
        return json.dumps({"status": "success", "message": "Feedback processed"})

    except Exception as e:
        # Handle exceptions that may occur during file operations
        return json.dumps({"status": "error", "message": str(e)})

def main():
    input_str = sys.stdin.read()
    input_json = json.loads(input_str)
    
    if input_json.get('function') == 'submit_user_feedback':
        result = process_feedback(input_json['userFeedback'])
        print(result)

if __name__ == '__main__':
    main()
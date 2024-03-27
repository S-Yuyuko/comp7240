import pandas as pd
import json  # Ensure json is imported if you're directly manipulating JSON strings

def extract_movie_details_to_json(csv_file_path):
    """
    Extracts specific movie details from a given CSV file and returns a JSON string.
    
    Parameters:
    - csv_file_path: The path to the CSV file.
    
    Returns:
    - A JSON string containing the specified movie details, or an error message.
    """
    # Columns to extract from the CSV file
    columns = ['Release_Date', 'Title', 'Overview', 'Popularity', 'Vote_Count', 'Poster_Url']
    
    try:
        # Load the specified columns of the CSV file into a pandas DataFrame
        df = pd.read_csv(csv_file_path, usecols=columns, engine='python')
        
        # Handle missing values as needed. This line is optional and customizable.
        # For example: Fill missing Poster_Url values with a default placeholder
        df['Poster_Url'].fillna('default_poster_url.jpg', inplace=True)
        
        # Convert the DataFrame to a JSON formatted string
        return df.to_json(orient='records')
        
    except FileNotFoundError:
        error_message = {"error": f"Error: The file '{csv_file_path}' was not found."}
        return json.dumps(error_message)
    except Exception as e:
        error_message = {"error": f"An error occurred: {e}"}
        return json.dumps(error_message)

# Example usage

# Specify the path to your CSV file here
csv_file_path = './csv/mymoviedb.csv'

# Directly call the function and print the JSON string
movie_details_json = extract_movie_details_to_json(csv_file_path)
print(movie_details_json)

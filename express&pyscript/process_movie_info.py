# Import the pandas library for handling CSV data
import pandas as pd

def extract_movie_details(csv_file_path):
    """
    Extracts specific movie details from a given CSV file and returns a pandas DataFrame.
    
    Parameters:
    - csv_file_path: The path to the CSV file.
    
    Returns:
    - A pandas DataFrame containing the specified movie details.
    """
    # Columns to extract from the CSV file
    columns = ['Release_Date', 'Title', 'Overview', 'Popularity', 'Vote_Count', 'Poster_Url']
    
    try:
        # Load the specified columns of the CSV file into a pandas DataFrame
        df = pd.read_csv(csv_file_path, usecols=columns, engine='python')
        
        # Handle missing values as needed. This line is optional and customizable.
        # Example: Fill missing Poster_Url values with a default placeholder
        # df['Poster_Url'].fillna('default_poster_url.jpg', inplace=True)
        
        return df
    except FileNotFoundError:
        print(f"Error: The file '{csv_file_path}' was not found.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    # Specify the path to your CSV file here
    csv_file_path = 'express&pyscript\\csv\\mymoviedb.csv'
    
    # Extract movie details from the CSV file
    movie_details_df = extract_movie_details(csv_file_path)
    
    if movie_details_df is not None:
        # Print the first few rows of the DataFrame to verify the output
        print(movie_details_df.head())
        
        # Optionally, save the DataFrame to a new CSV file
        # Uncomment the line below to save the output
        # movie_details_df.to_csv('extracted_movie_details.csv', index=False)

if __name__ == "__main__":
    main()

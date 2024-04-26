import csv
import json
import pandas as pd

def extract_genres_to_json(csv_file_path):
    unique_genres = set()

    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['Genre']:  # Check if the genre entry exists and is not empty
                    genres = row['Genre'].split(',')
                    for genre in genres:
                        unique_genres.add(genre.strip())
        
        # Convert the set of unique genres to a sorted list
        sorted_genres = sorted(list(unique_genres))
        
        # Serialize the list to JSON
        genres_json = json.dumps(sorted_genres)
        return genres_json
    except Exception as e:
        return json.dumps({'error': str(e)})

# Example usage
csv_file_path = './csv/mymoviedb.csv'
genres_json = extract_genres_to_json(csv_file_path)
print(genres_json)

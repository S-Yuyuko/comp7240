import sys
import json
import pandas as pd

# Assuming this path; update it to your actual CSV file location
CSV_FILE_PATH = './csv/mymoviedb.csv'

def get_recommended_movies(genres):
    try:
        df = pd.read_csv(CSV_FILE_PATH)
        df.fillna({'Genre': '', 'Popularity': 0, 'Vote_Count': 0, 'Vote_Average': 0}, inplace=True)

        if genres:
            def genre_match(row):
                movie_genres = row['Genre'].split(',')
                return any(genre.strip() in movie_genres for genre in genres)

            df['GenreMatch'] = df.apply(genre_match, axis=1)
            df = df[df['GenreMatch'] == True]

        # Sort by Popularity as default or additional sorting logic here
        sorted_df = df.sort_values(by=['Popularity', 'Vote_Count', 'Vote_Average'], ascending=False)

        return sorted_df.to_json(orient='records')
    except Exception as e:
        return json.dumps({"error": str(e)})

def main():
    # Reading input from stdin
    input_str = sys.stdin.read()
    input_json = json.loads(input_str)

    if input_json.get('function') == 'get_recommended_movies':
        genres = input_json.get('genres', [])
        result = get_recommended_movies(genres)
        print(result)
    else:
        print(json.dumps({"error": "No valid function called."}))

if __name__ == '__main__':
    main()

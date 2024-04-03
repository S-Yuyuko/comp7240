import sys
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

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
    

def generate_recommendations(liked_movies, historySubmit, top_n=5):
    try:
        # Load and preprocess the dataset
        movies_df = pd.read_csv(CSV_FILE_PATH)
        movies_df['Vote_Count'] = pd.to_numeric(movies_df['Vote_Count'], errors='coerce')
        movies_df['Vote_Average'] = pd.to_numeric(movies_df['Vote_Average'], errors='coerce')
        movies_df.fillna({'Genre': '', 'Popularity': 0, 'Vote_Count': 0, 'Vote_Average': 0}, inplace=True)

        # Normalize features
        scaler = MinMaxScaler()
        movies_df[['Popularity', 'Vote_Count', 'Vote_Average']] = scaler.fit_transform(movies_df[['Popularity', 'Vote_Count', 'Vote_Average']])

        # Calculate TF-IDF for genres and cosine similarity for the entire dataset
        tfidf_vectorizer = TfidfVectorizer(tokenizer=lambda x: x.split(', '), stop_words='english')
        tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['Genre'])
        cosine_sim_genres = cosine_similarity(tfidf_matrix, tfidf_matrix)

        # Extracting genres from liked movies
        liked_genres_matrix = tfidf_vectorizer.transform([', '.join({genre for movie in liked_movies for genre in movie['Genre'].split(', ')})])
        genre_similarity_scores = cosine_similarity(liked_genres_matrix, tfidf_matrix).flatten()

        # Determine if history is empty
        is_history_empty = not historySubmit or all(len(v) == 0 for v in historySubmit.values())

        if is_history_empty:
            # Directly use genre similarity for recommendations if history is empty
            movies_df['Genre_Similarity'] = genre_similarity_scores
        else:
            # Factor in the scores from historySubmit and liked_movies if history is present
            comprehensive_list = liked_movies + [item for sublist in historySubmit.values() for item in sublist]
            movies_df['Score_Weighted'] = 0.0

            for movie in comprehensive_list:
                if 'Score' in movie:
                    movie_genres_matrix = tfidf_vectorizer.transform([movie['Genre']])
                    movie_genre_similarity = cosine_similarity(movie_genres_matrix, tfidf_matrix).flatten()
                    movies_df['Score_Weighted'] += movie_genre_similarity * movie['Score']

            # Normalize Score_Weighted and add Genre_Similarity
            max_score_weighted = movies_df['Score_Weighted'].max()
            if max_score_weighted > 0:
                movies_df['Score_Weighted'] /= max_score_weighted
            movies_df['Genre_Similarity'] = genre_similarity_scores

        # Calculate the final score considering genre similarity and score weighted
        movies_df['Final_Score'] = movies_df['Genre_Similarity'] + movies_df.get('Score_Weighted', 0)
        movies_df['Final_Score'] /= 2  # Averaging the scores for a balanced metric

        # Exclude movies already liked from the final recommendations
        liked_titles = [movie['Title'] for movie in liked_movies]
        filtered_recommendations = movies_df[~movies_df['Title'].isin(liked_titles)]

        # Select top_n recommendations based on the final score
        recommendations = filtered_recommendations.sort_values(by='Final_Score', ascending=False).head(top_n)

        return recommendations[['Title', 'Genre', 'Final_Score']].to_json(orient='records')
    
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
    elif input_json.get('function') == 'generate_recommendations':
        liked_movies_container = input_json.get('likedMovies', [])
        liked_movies = liked_movies_container.get('likedMovies', [])
        history_submit = liked_movies_container.get('historySubmit', [])
        result = generate_recommendations(liked_movies, history_submit)
        print(result)
    else :
        print(json.dumps({"error": "No valid function called."}))

if __name__ == '__main__':
    main()
    
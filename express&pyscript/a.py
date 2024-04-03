import sys
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
# Assuming this path; update it to your actual CSV file location
CSV_FILE_PATH = 'express&pyscript\csv\mymoviedb.csv'
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import json

def generate_recommendations(liked_movies, top_n=5):
    try:
        movies_df = pd.read_csv(CSV_FILE_PATH)
        movies_df.fillna({'Genre': '', 'Popularity': 0, 'Vote_Count': 0, 'Vote_Average': 0}, inplace=True)

        # Initialize TF-IDF Vectorizer for genres, considering genres are split by commas
        tfidf = TfidfVectorizer(stop_words='english', tokenizer=lambda x: x.split(','))
        tfidf_matrix = tfidf.fit_transform(movies_df['Genre'])

        # Calculate cosine similarity matrix for all movies
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

        # Initialize scores array to hold the similarity scores for all movies
        similarity_scores = np.zeros(len(movies_df))

        # Calculate similarity scores based on liked movies
        for liked_movie in liked_movies:
            # Find the index of the liked movie in the DataFrame
            idx = movies_df[movies_df['Title'] == liked_movie['Title']].index[0]
            # Add the cosine similarity scores, weighted by the liked movie's score
            similarity_scores += cosine_sim[idx] * liked_movie['Score']
        
        # Normalize similarity scores
        similarity_scores_normalized = MinMaxScaler().fit_transform(similarity_scores.reshape(-1, 1)).flatten()

        # Incorporate Popularity, Vote_Count, and Vote_Average into the scoring
        normalized_popularity = MinMaxScaler().fit_transform(movies_df[['Popularity']].to_numpy().reshape(-1, 1)).flatten()
        normalized_vote_count = MinMaxScaler().fit_transform(movies_df[['Vote_Count']].to_numpy().reshape(-1, 1)).flatten()
        normalized_vote_average = MinMaxScaler().fit_transform(movies_df[['Vote_Average']].astype(float).to_numpy().reshape(-1, 1)).flatten()

        # Calculate the final recommendation score
        recommendation_score = 0.4 * similarity_scores_normalized + 0.2 * normalized_popularity + 0.2 * normalized_vote_count + 0.2 * normalized_vote_average

        # Add the recommendation score to the DataFrame
        movies_df['RecommendationScore'] = recommendation_score

        # Sort the DataFrame based on the recommendation score and select top_n movies
        recommended_movies = movies_df.sort_values(by='RecommendationScore', ascending=False).head(top_n)

        # Return the top_n recommendations in JSON format
        return recommended_movies[['Title', 'Genre', 'RecommendationScore']].to_json(orient='records')

    except Exception as e:
        # Return a JSON-formatted error message
        return json.dumps({"error": str(e)})

# Example liked_movies input
liked_movies = [
    {"Title": "Some Movie Title", "Score": 8},
    {"Title": "Another Movie Title", "Score": 9}
]

# Assuming the CSV_FILE_PATH is set to a valid path
print(generate_recommendations(liked_movies, top_n=5))
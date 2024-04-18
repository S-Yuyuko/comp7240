import os
import sys
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

liked_movies = [
    {'Title': 'Inception', 'Score': 9.0, 'Genre': 'Action, Adventure, Science Fiction'},
    {'Title': 'The Matrix', 'Score': 8.7, 'Genre': 'Action, Science Fiction'},
    {'Title': 'Interstellar', 'Score': 9.1, 'Genre': 'Adventure, Drama, Science Fiction'}
]
# Assuming this path; update it to your actual CSV file location
csv_file_path = 'express&pyscript/csv/mymoviedb.csv'
ratings_csv_path= 'express&pyscript/csv/user_ratings.csv'

def get_recommended_movies(genres):
    try:
        df = pd.read_csv(csv_file_path)
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
        # Load and preprocess the movie dataset
        movies_df = pd.read_csv(csv_file_path)
        movies_df['Vote_Count'] = pd.to_numeric(movies_df['Vote_Count'], errors='coerce').fillna(0).astype('float32')
        movies_df['Vote_Average'] = pd.to_numeric(movies_df['Vote_Average'], errors='coerce').fillna(0).astype('float32')
        movies_df.fillna({'Genre': '', 'Popularity': 0}, inplace=True)

        # Normalize features using MinMaxScaler
        scaler = MinMaxScaler()
        movies_df[['Nor_Popularity', 'Nor_Vote_Count', 'Nor_Vote_Average']] = scaler.fit_transform(
            movies_df[['Popularity', 'Vote_Count', 'Vote_Average']]
        )

        # Calculate TF-IDF for genres
        tfidf_vectorizer = TfidfVectorizer(tokenizer=lambda x: x.split(', '), stop_words='english')
        genre_tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['Genre'])

        # Load or initialize the ratings DataFrame
        if os.path.exists(ratings_csv_path):
            ratings_df = pd.read_csv(ratings_csv_path)
        else:
            ratings_df = pd.DataFrame(columns=['User_ID', 'Title', 'Score', 'Genre'])

        # Update ratings DataFrame with new history data
        new_data = []
        new_user_id = ratings_df['User_ID'].max() + 1 if not ratings_df.empty else 1
        for _, movies in historySubmit.items():
            for movie in movies:
                new_data.append({
                    'User_ID': new_user_id,
                    'Title': movie['Title'],
                    'Score': movie['Score'],
                    'Genre': movie['Genre']
                })

        # Append new ratings to existing data, drop duplicates, and save
        new_ratings_df = pd.DataFrame(new_data)
        ratings_df = pd.concat([ratings_df, new_ratings_df], ignore_index=True)
        ratings_df.drop_duplicates(subset=['User_ID', 'Title'], keep='last', inplace=True)
        ratings_df.to_csv(ratings_csv_path, index=False)

        # Create user-item matrix for CF
        user_item_matrix = ratings_df.pivot_table(index='User_ID', columns='Title', values='Score', fill_value=0)
        user_item_matrix = user_item_matrix.reindex(columns=movies_df['Title'], fill_value=0)

        # Calculate CF scores using cosine similarity
        user_similarity = cosine_similarity(user_item_matrix.T)  # Transpose to get item-item similarity
        cf_scores = user_similarity.mean(axis=0) * 1000

        # Calculate genre similarity scores
        liked_movie_titles = [movie['Title'] for movie in liked_movies]
        liked_indices = movies_df[movies_df['Title'].isin(liked_movie_titles)].index
        liked_genres_scores = cosine_similarity(genre_tfidf_matrix, genre_tfidf_matrix[liked_indices]).mean(axis=1)

        # Combine CF and CBF scores
        weight_cf = 0.4
        weight_cbf = 0.4
        weight_popularity = 0.05
        weight_vote_count = 0.05
        weight_vote_average = 0.1
                # Apply weights
        final_scores = (cf_scores * weight_cf + 
                        liked_genres_scores * weight_cbf + 
                        movies_df['Nor_Popularity'] * weight_popularity + 
                        movies_df['Nor_Vote_Count'] * weight_vote_count + 
                        movies_df['Nor_Vote_Average'] * weight_vote_average)

        movie_indices = np.argsort(final_scores)[-top_n:][::-1]
        recommended_movies = movies_df.iloc[movie_indices]

        # Format recommended movies with reasons
        recommendations = [{
            'Title': movie.Title,  # Correctly accessing attributes of a named tuple
            'Release_Date': movie.Release_Date,
            'Overview': movie.Overview,
            'Popularity': movie.Popularity,
            'Vote_Count': movie.Vote_Count,
            'Vote_Average': movie.Vote_Average,
            'Original_Language': movie.Original_Language,
            'Genre': movie.Genre,
            'Poster_Url': movie.Poster_Url,
            'Reason': f"CF Score: {cf_scores[idx]:.2f}, Genre Score: {liked_genres_scores[idx]:.2f}, Combined Score: {final_scores[idx]:.2f}"
        } for idx, movie in zip(movie_indices, recommended_movies.itertuples(index=False))]
        print(movies_df.head())
        print(ratings_df.head())
        print(user_item_matrix.head())
        print(user_similarity)
        print(cf_scores)
        return json.dumps(recommendations)


    except Exception as e:
        return json.dumps({"error": str(e)})
    

print(generate_recommendations(liked_movies, {}))


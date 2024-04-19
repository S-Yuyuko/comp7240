import os
import sys
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

# Assuming this path; update it to your actual CSV file location
base_directory = './csv'
csv_file_path = './csv/mymoviedb.csv'
ratings_csv_path='./csv/user_ratings.csv'
feedback_csv_path = os.path.join(base_directory, 'Hy_Recommendations.csv')
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
        new_user_id = int(ratings_df['User_ID'].iloc[-1]) + 1 if not ratings_df.empty else 1
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
        weights = {'cf': 0.4, 'cbf': 0.4, 'popularity': 0.05, 'vote_count': 0.05, 'vote_average': 0.1}
        final_scores = (cf_scores * weights['cf'] +
                        liked_genres_scores * weights['cbf'] +
                        movies_df['Nor_Popularity'] * weights['popularity'] +
                        movies_df['Nor_Vote_Count'] * weights['vote_count'] +
                        movies_df['Nor_Vote_Average'] * weights['vote_average'])
        movie_indices = np.argsort(final_scores)[-top_n:][::-1]
        recommended_movies = movies_df.iloc[movie_indices]

        # Format recommended movies with reasons
        recommendations = [{
            'User_ID': new_user_id,
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

        return json.dumps(recommendations)


    except Exception as e:
        return json.dumps({"error": str(e)})
           
def generate_adjusted_recommendations(feedback_movies, top_n=5):
    try:
        # Load and preprocess the movie dataset
        movies_df = pd.read_csv(csv_file_path)
        movies_df['Vote_Count'] = pd.to_numeric(movies_df['Vote_Count'], errors='coerce').astype('float32')
        movies_df['Vote_Average'] = pd.to_numeric(movies_df['Vote_Average'], errors='coerce').astype('float32')
        movies_df.fillna({'Genre': '', 'Popularity': 0, 'Vote_Count': 0, 'Vote_Average': 0}, inplace=True)
        movies_df['Popularity'] = movies_df['Popularity'].astype('float32')

        # Setup TF-IDF for genres
        tfidf_vectorizer = TfidfVectorizer(tokenizer=lambda x: x.split(', '), stop_words='english')
        tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['Genre'])

        # Filter movies based on feedback
        feedback_titles = [movie['Title'] for movie in feedback_movies if 'Title' in movie]
        movies_to_recommend = movies_df[~movies_df['Title'].isin(feedback_titles)].copy()

        # Normalize and adjust scores based on feedback
        scaler = MinMaxScaler()
        movies_to_recommend['Normalized_Vote_Average'] = scaler.fit_transform(movies_to_recommend[['Vote_Average']])
        movies_to_recommend['Adjusted_Score'] = 0.0

        for feedback in feedback_movies:
            if all(key in feedback for key in ['Genre', 'State']):  # Check for necessary keys
                feedback_genre_matrix = tfidf_vectorizer.transform([feedback['Genre']])
                genre_similarity = cosine_similarity(feedback_genre_matrix, tfidf_matrix).flatten()
                adjustment = 1 if feedback['State'] == 'like' else -1
                movies_to_recommend['Adjusted_Score'] += genre_similarity * adjustment

        movies_to_recommend['Adjusted_Score'] = scaler.fit_transform(movies_to_recommend[['Adjusted_Score']])
        random_component = np.random.uniform(0.4, 0.6, len(movies_to_recommend))
        movies_to_recommend['Final_Score'] = movies_to_recommend['Adjusted_Score'] * (1 - random_component) + movies_to_recommend['Normalized_Vote_Average'] * random_component

        recommendations = movies_to_recommend.sort_values(by='Final_Score', ascending=False).head(top_n)
        return recommendations.to_json(orient='records')

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
    elif input_json.get('function') == 'generate_adjusted_recommendations':
        feedback_movies = input_json.get('feedbackMovies', [])
        feedback_movies = input_json.get('feedbackMovies', [])
        result = generate_adjusted_recommendations(feedback_movies)
        print(result)
    else :
        print(json.dumps({"error": "No valid function called."}))

if __name__ == '__main__':
    main()
    
import pandas as pd
import numpy as np

def generate_user_ratings(file_path, output_path, num_users=5000, movies_per_user=5):
    try:
        # Load the movie data
        movie_df = pd.read_csv(file_path)
        
        # Check if there are enough movies to sample from
        if len(movie_df) < movies_per_user:
            raise ValueError("Not enough movies in the database to sample from.")
        
        # Prepare the output DataFrame
        ratings_data = {
            'User_ID': [],
            'Title': [],
            'Score': [],
            'Genre': []
        }
        
        # Setting a random seed for reproducibility (optional)
        np.random.seed(42)
        
        # Generate ratings for each user
        for user_id in range(num_users):
            # Randomly select movies
            sampled_movies = movie_df.sample(n=movies_per_user, replace=False)
            
            # Generate random scores
            scores = np.random.randint(0, 11, size=movies_per_user)
            
            # Append data to the lists
            ratings_data['User_ID'].extend([user_id] * movies_per_user)
            ratings_data['Title'].extend(sampled_movies['Title'].values)
            ratings_data['Score'].extend(scores)
            ratings_data['Genre'].extend(sampled_movies['Genre'].values)
        
        # Create DataFrame
        ratings_df = pd.DataFrame(ratings_data)
        
        # Save to CSV
        ratings_df.to_csv(output_path, index=False)
        print(f"User ratings saved to {output_path}")
    
    except Exception as e:
        print(f"An error occurred: {e}")


# Specify the path to your movie database and output file
file_path = 'express&pyscript\\csv\\mymoviedb.csv'  # Update this path accordingly
output_path = 'express&pyscript\\csv\\user_ratings.csv'  # Update this path accordingly

# Call the function
generate_user_ratings(file_path, output_path)
import json

def get_genres():
    genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller', 'Documentary']
    return genres

if __name__ == "__main__":
    genres = get_genres()
    print(json.dumps(genres))  # Convert the list to a JSON string and print it
from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/get-movie-genres', methods=['GET'])
def get_movie_genres():
    df = pd.read_csv('./csv/100_movies_datasets.csv')
    # Convert to JSON
    genres_json = df.to_json(orient='records')
    return jsonify(genres_json)

if __name__ == '__main__':
    app.run(debug=True)
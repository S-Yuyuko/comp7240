import pandas as pd
import json

def int64_to_int(obj):
    if isinstance(obj, pd.Series):
        return obj.to_dict()
    elif isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient='records')
    elif isinstance(obj, pd.Index):
        return obj.tolist()
    elif isinstance(obj, (pd.np.int64, int)):  # pd.np.int64 is deprecated, directly use int can be enough in newer pandas versions
        return int(obj)
    elif isinstance(obj, (pd.np.float64, float)):
        return float(obj)
    raise TypeError("Type %s not serializable" % type(obj))

def read_and_combine_csvs(base_path):
    try:
        files_keys = {
            'Hy_Recommendations.csv': 'Hy_method',
            'CF_Recommendations.csv': 'CF_method',
            'CBF_Recommendations.csv': 'CBF_method'
        }
        
        combined_data = {}
        analytics = {}
        
        for file_name, key in files_keys.items():
            full_path = f"{base_path}/{file_name}"
            df = pd.read_csv(full_path)
            
            if 'State' in df.columns:
                liked_count = int((df['State'] == 'liked').sum())
                total_count = int(len(df))
                disliked_count = int((df['State'] == 'disliked').sum())
                precision = float(liked_count / total_count) if total_count > 0 else 0.0

                analytics[key] = {
                    'liked_movies': liked_count,
                    'disliked_movies': disliked_count,
                    'total_movies': total_count,
                    'precision': precision
                }
            
            combined_data[key] = df.to_dict(orient='records')

        return json.dumps({
            'analytics': analytics
        }, default=int64_to_int)

    except Exception as e:
        return json.dumps({'error': str(e)})

# Usage example
base_path = "./csv"
combined_data_json = read_and_combine_csvs(base_path)
print(combined_data_json)

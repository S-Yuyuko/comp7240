const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 4000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/get-genres', (req, res) => {
    const pythonProcess = spawn('python3', ['./process_genres.py']); // Adjust the path as needed

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`);
            return res.status(500).json({ error: "Failed to execute Python script" });
        }

        try {
            // Assuming the Python script outputs a JSON string
            const data = JSON.parse(dataString);
            res.setHeader('Content-Type', 'application/json');
            res.send(data); // Send the parsed JSON data as the response
        } catch (error) {
            console.error('Error parsing JSON from Python script:', error);
            res.status(500).json({ error: "Error parsing JSON from Python script" });
        }
    });
});

app.post('/get-recommended-movies', (req, res) => {
    const genres = req.body.genres || [];
    
    // Spawn Python process
    const pythonProcess = spawn('python3', ['process_movie_info.py']);
    let dataString = '';

    // Send function name and parameters to Python script via stdin
    pythonProcess.stdin.write(JSON.stringify({ function: 'get_recommended_movies', genres: genres }));
    pythonProcess.stdin.end();

    // Collect data from script
    pythonProcess.stdout.on('data', function(data) {
        dataString += data.toString();
    });

    pythonProcess.on('close', function(code) {
        if (code !== 0 || !dataString) {
            return res.status(500).send({ error: "Failed to execute Python script or received empty output" });
        }
        try {
            const parsedData = JSON.parse(dataString);
            res.send(parsedData);
        } catch (error) {
            console.error("Failed to parse JSON from Python script:", error);
            res.status(500).send({ error: "Failed to parse JSON output from Python script" });
        }
    });
    
});

app.post('/recommendations-from-liked', (req, res) => {
    const likedMovies = req.body;
    // Spawn the Python process
    const pythonProcess = spawn('python3', ['process_movie_info.py']);
    let dataString = '';

    // Send the liked movies data to the Python script
    pythonProcess.stdin.write(JSON.stringify({ function: 'generate_recommendations', likedMovies: likedMovies }));
    pythonProcess.stdin.end();

    // Collect data from script
    pythonProcess.stdout.on('data', function(data) {
        dataString += data.toString();
    });

    pythonProcess.on('close', function(code) {
        if (code !== 0 || !dataString) {
            return res.status(500).send({ error: "Failed to execute Python script or received empty output" });
        }
        try {
            const parsedData = JSON.parse(dataString);
            res.send(parsedData);
        } catch (error) {
            console.error("Failed to parse JSON from Python script:", error);
            res.status(500).send({ error: "Failed to parse JSON output from Python script" });
        }
    });
});

app.post('/recommendations-from-liked', (req, res) => {
    const likedMovies = req.body;
    // Spawn the Python process
    const pythonProcess = spawn('python3', ['process_movie_info.py']);
    let dataString = '';

    // Send the liked movies data to the Python script
    pythonProcess.stdin.write(JSON.stringify({ function: 'generate_recommendations', likedMovies: likedMovies }));
    pythonProcess.stdin.end();

    // Collect data from script
    pythonProcess.stdout.on('data', function(data) {
        dataString += data.toString();
    });

    pythonProcess.on('close', function(code) {
        if (code !== 0 || !dataString) {
            return res.status(500).send({ error: "Failed to execute Python script or received empty output" });
        }
        try {
            const parsedData = JSON.parse(dataString);
            res.send(parsedData);
        } catch (error) {
            console.error("Failed to parse JSON from Python script:", error);
            res.status(500).send({ error: "Failed to parse JSON output from Python script" });
        }
    });
});

app.post('/recommendations-from-feedback', (req, res) => {
    const feedbackMovies = req.body;
    // Spawn the Python process
    const pythonProcess = spawn('python3', ['process_movie_info.py']);
    let dataString = '';

    // Send the liked movies data to the Python script
    pythonProcess.stdin.write(JSON.stringify({ function: 'generate_adjusted_recommendations', feedbackMovies: feedbackMovies }));
    pythonProcess.stdin.end();

    // Collect data from script
    pythonProcess.stdout.on('data', function(data) {
        dataString += data.toString();
    });

    pythonProcess.on('close', function(code) {
        if (code !== 0 || !dataString) {
            return res.status(500).send({ error: "Failed to execute Python script or received empty output" });
        }
        try {
            const parsedData = JSON.parse(dataString);
            res.send(parsedData);
        } catch (error) {
            console.error("Failed to parse JSON from Python script:", error);
            res.status(500).send({ error: "Failed to parse JSON output from Python script" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

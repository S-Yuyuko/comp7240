const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 5000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/get-genres', (req, res) => {
    const pythonProcess = spawn('python', ['./process_genres.py']); // Adjust the path as needed

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

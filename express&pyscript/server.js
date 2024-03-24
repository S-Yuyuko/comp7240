const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 5000;

app.use(cors());

app.get('/get-genres', (req, res) => {
    const pythonProcess = spawn('python', ['process_genres.py']);

    pythonProcess.stdout.on('data', (data) => {
        const genres = JSON.parse(data.toString());  // Parse the JSON string from Python
        res.json({ genres });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Failed to execute Python script');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

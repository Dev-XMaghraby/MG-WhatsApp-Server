const express = require('express');
const { zip } = require('zip-a-folder');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/release', async (_req, res) => {
    try {
        const distPath = path.join(__dirname, '../dist');
        const zipPath = path.join(__dirname, '../dist.zip');

        // Create zip file from dist folder
        await zip(distPath, zipPath);

        // Send the zip file
        res.download(zipPath, 'dist.zip', async (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            // Clean up: remove the zip file after sending
            try {
                await fs.unlink(zipPath);
            } catch (unlinkError) {
                console.error('Error removing zip file:', unlinkError);
            }
        });
    } catch (error) {
        console.error('Error creating zip:', error);
        res.status(500).send('Error creating zip file');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
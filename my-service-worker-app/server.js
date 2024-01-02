const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Subscribe Route
app.post('/subscribe', (req, res) => {
    // Get pushSubscription object from the client
    const subscription = req.body;
  
    // Send 201 status - subscription successful
    res.status(201).json({});
  
    const payload = JSON.stringify({ title: 'Push Test' });
  
    // Pass the object into sendNotification
    webpush.sendNotification(subscription, payload).catch(error => console.error(error));
  });
  


const port = 3000;

// Reading the SSL certificate files
const privateKey = fs.readFileSync('ssl_cert/localhost.key', 'utf8');
const certificate = fs.readFileSync('ssl_cert/localhost.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Creating HTTPS server with Express app
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
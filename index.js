const http = require('http');
const express = require('express');
const socket = require('./src/server');


const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('static'));
app.get('*', (req, res) => res.sendFile(__dirname + '/static/index.html'));
const server = http.createServer(app);

socket(server);

server.listen(port, () => console.log(`Application listening on port ${port}`));
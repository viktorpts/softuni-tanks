const express = require('express');


const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('./static'));
app.get('*', (req, res) => res.sendFile(__dirname + '/static/index.html'));

app.listen(port, () => console.log('Application running on port', port));
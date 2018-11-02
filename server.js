/*jshint esversion: 6 */
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorhandler = require(path.resolve( __dirname, 'app/_helpers/error-handler.js'));
const compression = require('compression');

app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + '/pub'));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/pub/index.html'));
});

app.use('/camera', require(path.resolve( __dirname, 'app/camera/camera.controller.js')));
app.use('/ptz', require(path.resolve( __dirname, 'app/ptz/ptz.controller.js')));
app.use('/image', require(path.resolve( __dirname, 'app/image/image.controller.js')));
app.get('*', function(req, res){
  res.send('what???', 404);
});

app.use(errorhandler);

const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});

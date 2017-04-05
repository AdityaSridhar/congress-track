var express = require('express');
var app = express();

app.use(express.static(__dirname));

require ("./server/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);

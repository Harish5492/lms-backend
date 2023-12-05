const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const port = process.env.PORT || 3000;
console.log("port" , port)
const mongoDB = require('./config/database');

const Api = require('./routes/routes');
//conect database
mongoDB();
// app.use

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use('/user', Api);

// listening port
 
app.listen(port, (err) => {
  if (err) {
    return console.log('ERROR', err);
  }
  console.log(`Listening on port ${port}`);
});

app.listen(3000, '10.10.2.29');


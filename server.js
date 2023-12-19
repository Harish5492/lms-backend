const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const port = process.env.PORT || 3000;
// console.log("port" , port)
const mongoDB = require('./config/database');

const userApi = require('./routes/user.routes'); 
// const coursesApi = require('./routes/courses.routes')
//conect database
mongoDB();
// app.use
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use('/user', userApi); 
// app.use('/courses',coursesApi);

// listening port
 
app.listen(port, (err) => {
  if (err) {
    return console.log('ERROR', err);
  }
  console.log(`Listening on port ${port}`);
});

app.listen(3000, '10.10.2.82');


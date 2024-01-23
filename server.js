const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mongoDB = require('./config/database');

const Api = require('./routers/index');
const cors = require('cors')
//conect database
mongoDB();
// app.use

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// app.use('/user', () => Api);

app.use('/user', Api.userRouter); 
app.use('/user', Api.otpRouter); 
app.use('/user', Api.billingRouter); 
app.use('/user', Api.courseRouter); 
app.use('/user', Api.referalRouter); 
app.use('/user', Api.affiliateRouter);

app.use('/admin/adminArea', Api.adminRouter); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// const cron = require('node-cron');
// function logMessage() {
//  console.log('Cron job executed at:', new Date().toLocaleString());
// }
// // Schedule the cron job to run every minute
// cron.schedule('* * * * * *', () => {
//  logMessage();
// });


// listening port

app.listen(port, (err) => {
  if (err) {
    return console.log('ERROR', err);
  }
  console.log(`Listening on port ${port} -- connected successfully`);
});

// app.listen(3000,'10.10.2.82') 

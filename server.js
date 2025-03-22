const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dbConnect = require('./config/dbConnect');
dbConnect();

app.get('/',(req,res)=>{
  res.send('eCommerce wesite is running....');
});

app.use('/api',routes);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
});
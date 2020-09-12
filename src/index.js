const express = require("express");
const fs = require('fs');
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
  require("./db");
  require('./routes')(app);
  fs.access('./files', fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir('./files', (err) => {
        console.error(err)
      })
    }
  });
});

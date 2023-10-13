const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// const PackageController = require('./controllers/PackageController');

// app.use(PackageController);
app.use(require('./controllers/PackageController'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

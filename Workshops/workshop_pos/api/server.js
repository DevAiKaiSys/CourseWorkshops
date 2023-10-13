const express = require('express');
const { request } = require('./controllers/PackageController');
const app = express();
const port = 3000;

// const PackageController = require('./controllers/PackageController');

// app.use(PackageController);
app.use(require('./controllers/PackageController'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

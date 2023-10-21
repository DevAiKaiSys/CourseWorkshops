const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// const PackageController = require('./controllers/PackageController');

// app.use(PackageController);
app.use(require('./controllers/PackageController'));
app.use(require('./controllers/MemberController'));
app.use(require('./controllers/ProductController'));
app.use(require('./controllers/ProductImageController'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

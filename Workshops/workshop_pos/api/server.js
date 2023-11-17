const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// const PackageController = require('./controllers/PackageController');

// app.use(PackageController);
app.use(require('./controllers/PackageController'));
app.use(require('./controllers/MemberController'));
app.use(require('./controllers/ProductController'));
app.use(require('./controllers/ProductImageController'));
app.use(require('./controllers/UserController'));
app.use(require('./controllers/BillSaleController'));
app.use(require('./controllers/StockController'));
app.use(require('./controllers/BankController'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

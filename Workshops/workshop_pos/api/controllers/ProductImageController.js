const express = require('express');
const app = express();
const { isLogin } = require('./Service');
const ProductImageModel = require('../models/ProductImageModel');
const fileUpload = require('express-fileupload');

app.use(fileUpload());

// app.get('/productImage/list/:productId', isLogin, async (req, res) => {
//   try {
//     const results = await ProductImageModel.findAll({ order: [['id', 'DESC']] });
//     res.status(200).send({ results: results });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

app.post('/productImage/insert', isLogin, async (req, res) => {
  try {
    const productImage = req.files.productImage;
    const uploadPath = __dirname + '/../uploads/' + productImage.name;
    // res.status(200).send({ productImage, uploadPath });
    await productImage.mv(uploadPath, (err) => {
      if (err) throw new Error(err);
      res.status(200).send({ message: 'success' });
      // const result = await ProductImageModel.create(req.body);
      // res.status(201).send({ message: 'success', result: result });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// app.delete('/productImage/delete/:id', isLogin, async (req, res) => {
//   try {
//     const result = await ProductImageModel.destroy({ where: { id: req.params.id } });
//     res.status(200).send({ message: 'success', result: result });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

module.exports = app;

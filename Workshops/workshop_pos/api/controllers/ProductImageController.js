const express = require('express');
const app = express();
const { isLogin } = require('./Service');
const ProductImageModel = require('../models/ProductImageModel');
const fileUpload = require('express-fileupload');
const fs = require('fs');

app.use(fileUpload());

app.get('/productImage/list/:productId', isLogin, async (req, res) => {
  try {
    const results = await ProductImageModel.findAll({
      where: { productId: req.params.productId },
      order: [['id', 'DESC']],
    });
    res.status(200).send({ results: results });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/productImage/insert', isLogin, async (req, res) => {
  try {
    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    // const h = myDate.getHours();
    // const mm = myDate.getMinutes();
    // const s = myDate.getSeconds();
    const rand = Math.random();
    const newName = y + '-' + m + '-' + d + '_' + rand;

    const productImage = req.files.productImage;
    const arr = productImage.name.split('.');
    const ext = arr[arr.length - 1];
    const fullNewName = newName + '.' + ext;
    // const uploadPath = __dirname + '/../uploads/' + productImage.name;
    const uploadPath = __dirname + '/../uploads/' + fullNewName;
    // res.status(200).send({ productImage, uploadPath });
    await productImage.mv(uploadPath, async (err) => {
      if (err) throw new Error(err);
      // res.status(200).send({ message: 'success' });
      const result = await ProductImageModel.create({
        isMain: false,
        // imageName: productImage.name,
        imageName: fullNewName,
        productId: req.body.productId,
      });
      res.status(201).send({ message: 'success', result: result });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put('/productImage/chooseMainImage', isLogin, async (req, res) => {
  try {
    await ProductImageModel.update(
      { isMain: false },
      {
        where: { productId: req.body.productId },
      }
    );
    const result = await ProductImageModel.update(
      { isMain: true },
      {
        where: { id: req.body.id },
      }
    );
    res.status(200).send({ message: 'success', result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete('/productImage/delete/:id', isLogin, async (req, res) => {
  try {
    const row = await ProductImageModel.findByPk(req.params.id);
    const imageName = row.imageName;
    // res.status(200).send({ imageName: imageName });

    const result = await ProductImageModel.destroy({
      where: { id: req.params.id },
    });

    try {
      await fs.unlinkSync('uploads/' + imageName);
    } catch (error) {
      console.log(error.message);
    }
    res.status(200).send({ message: 'success' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;

const path = require('path');

const express = require('express');

const adminData = require('./admin');

const router = express.Router();

const productController=require("../controllers/products");
router.get('/', productController.getProducts)

module.exports = router;

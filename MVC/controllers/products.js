const Products=require('../mdoels/products');

exports.getAddProducts = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};


exports.postAddProducts = (req, res, next) => {
    const products=new Products(req.body.title);
    products.save()
  res.redirect('/');
};


exports.getProducts = (req, res, next) => {
Products.fetchAllProducts((products)=>{
    res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
});
  
};

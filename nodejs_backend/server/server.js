const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const { mongoose } = require('../db/mongoose');
const { Category } = require('../models/categories');
const { Subcategory } = require('../models/subcategories');
const { SubSubcategory } = require('../models/subsubcategories');
const { SliderImage } = require('../models/sliderImage');
const { Product } = require('../models/products');
const { User } = require('../models/users');
const bcrypt = require('bcryptjs');
const setToken = require('./authentication');
const deliveryAddrRouter = require('./routes/delivery_address');
const searchMod= require('./modules/searchModule');

app.use(bodyParser.json());
app.use('/address', deliveryAddrRouter);
app.use(cors());
app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log("node server started at port 3000");
});

var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/upload/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});
var upload = multer({ storage: store }).single('myfile');
//============================ apis for get data===========================//
app.get('/api/getData', async (req, res) => {
    var cat = await Category.find();
    var sub = [], subsubList = [];
    var subcat = [], subsubcat = [];
    for (category of cat) {
        sub = await Subcategory.find({ "category_id": category._id });
        subcat.push(sub);
        for (subcategory of sub) {
            subsubcat.push(await SubSubcategory.find({ "subcategory_id": subcategory._id }));
            if (sub.length == subsubcat.length) {
                subsubList.push(subsubcat);
                subsubcat = [];
            }
        }
    }
    res.send({ cat, subcat, subsubList });
});
app.get('/api/getSliderImage', async (req, res) => {
    res.send(await SliderImage.find());
});
app.get('/api/getProducts', async (req, res) => {
    res.send(await Product.find().sort({ "$natural": -1 }));
});
app.post('/api/getProductNameWise', async (req, res) => {
    res.send(await Product.find(req.body).sort({ "$natural": -1 }));
});
app.post('/api/checkMobileExist', async (req, res) => {
    res.send(await User.findOne(req.body));
});

app.post('/api/getWishList', async (req, res) => {
    res.send(await User.findOne(req.body, "-_id user_wishlist"));
});
app.post('/api/getWishListProducts', async (req, res) => {
    var wishlistId=await User.findOne(req.body, "-_id user_wishlist");
    wishlistId=wishlistId.user_wishlist.split(',');
    var products=[];
    for(let productId of wishlistId){
        var product=await Product.findOne({ _id: productId });
        var subsubcategory = await SubSubcategory.findOne({ _id: product.product_subsubcategory_id},"-_id subsubcategory_name");
        product= product.toObject();
        product.subsubcategory_name=subsubcategory.subsubcategory_name;
        products.push(product);
    }
    res.send(products);
});

app.post('/api/getOrders', async (req, res) => {
    var order= await User.findOne(req.body, "-_id user_order");
    res.send(order);
});

app.get('/api/getSearchData', async (req, res) => {
    var catData = await Category.find(null, "-_id category_name");
    var subcat = await Subcategory.find(null, "-_id subcategory_name");
    var subsubcat = await SubSubcategory.find(null, "-_id subsubcategory_name");
    var productData = await Product.find(null, "-_id product_name");
    catData = catData.map((cat) => cat.category_name);
    subcat = subcat.map((subcat) => subcat.subcategory_name);
    subsubcat = subsubcat.map((subsubcat) => subsubcat.subsubcategory_name);
    productData = productData.map((product) => product.product_name);
    var result = {
        "cat": catData,
        "subcat": subcat,
        "subsubcat": subsubcat,
        "products": productData
    }
    res.send(result);
});

app.post('/api/getSearchedProducts', async (req, res) => {
    // res.send({'t':'test'});
    var searchName = req.body.searchName;
    var searchType = req.body.searchType;
    var result = [];
    switch (searchType) {
        case 0:
            var cat_id = await Category.findOne({ category_name: searchName }, "_id");
            await result.push(...await searchMod.getSubcategory(cat_id));
            break;

        case 1:
            var subcat_id = await Subcategory.findOne({ subcategory_name: searchName }, "_id");
            result.push(...await searchMod.getSubSubcategory(subcat_id));
            break;

        case 2:
            var subsubcat_id = await SubSubcategory.findOne({ subsubcategory_name: searchName }, "_id");
            result= await searchMod.getProducts(subsubcat_id);
            // result = await Product.find({ product_subsubcategory_id: subsubcat_id }).sort({ "$natural": -1 });
            break;

        case 3:
            result = await Product.find({ product_name: searchName }).sort({ "$natural": -1 });
            break;
        default: break;
    }
    res.send(result);
});

app.post('/api/getSearchedProductsByWholeSearch', async(req, res)=>{
    var search= req.body.searchData;

    var result= [];
    var catIds = await Category.find({category_name: { $regex: search, $options: 'i'}},"_id");
    for(let catId of catIds){
        result.push(...await searchMod.getSubcategory(catId));
    }
    var subcatIds = await Subcategory.find({subcategory_name: { $regex: search, $options: 'i'}},"_id");
    for(let subcatId of subcatIds){
        result.push(...await searchMod.getSubSubcategory(subcatId));
    }
    var subsubcatIds = await SubSubcategory.find({subsubcategory_name: { $regex: search, $options: 'i'}},"_id");
    for(let subsubcatId of subsubcatIds){
        result.push(...await searchMod.getProducts(subsubcatId));
    }
    var productIds = await Product.find({product_name: { $regex: search, $options: 'i'}},"_id");
    for(let productId of productIds){
        result.push(...await Product.find({ _id: productId }).sort({ "$natural": -1 }));
    }
    result = result.filter(function(elem, pos, self) {
        return pos === self.findIndex(el=>{
        //as el._id is an object so address comparision is performed so converted it to string
                return el._id.toString()== elem._id.toString();
            });
    });
    res.send(result);
});
//============================ apis for add data===========================//
app.post('/api/storeSubcategory', async (req, res) => {

    const subcategory = new Subcategory(req.body);
    const result = await subcategory.save();
    res.send(result);
});
app.post('/api/storeSubSubcategory', async (req, res) => {

    const subsubcategory = new SubSubcategory(req.body);
    const result = await subsubcategory.save();
    res.send(result);
});
app.post('/api/addSliderImage', async (req, res) => {
    const img = new SliderImage(req.body);
    const result = await img.save();
    res.send(result);
});
app.post('/api/addProduct', async (req, res) => {
    req.body.product_image_list = JSON.stringify(req.body.product_image_list);
    const product = new Product(req.body);
    const result = await product.save();
    res.send(result);
});
app.post('/api/addUser', async (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.user_password, 8);
    req.body.user_password = hashedPassword;
    const user = new User(req.body);
    try {
        const result = await user.save();
        res.send(result);
    }
    catch (e) {
        var email = await User.findOne({ user_email: req.body.user_email });
        if (email) res.send('Email id already exist');
    }

});

//============================ apis for update data===========================//
app.patch('/api/updateProduct/:id', async (req, res) => {
    var id = req.params.id;
    req.body.product_image_list = JSON.stringify(req.body.product_image_list);
    const result = await Product.findByIdAndUpdate({ _id: id }, { $set: { product_image_list: req.body.product_image_list } });
    res.send(result);

});
app.patch('/api/updateUserCart', async (req, res) => {
    var id = req.body.id;
    var user_cart = JSON.parse(req.body.cart_data);
    const cart_product = await User.findById(id, 'user_cart -_id');
    if (cart_product.user_cart.length > 0) {
        user_cart = JSON.parse(cart_product.user_cart);
        for (let product of JSON.parse(req.body.cart_data)) {
            var exist_product = user_cart.filter(p => { return p._id === product._id; });
            if (!exist_product.length)
                user_cart.push(product);

        }
    }
    var result = await User.updateOne({ _id: id }, { $set: { user_cart: JSON.stringify(user_cart) } });
    if (result.n == 1) {
        updatedResult = await User.findById(id, "-user_password");
        res.send({ user_cart: updatedResult.user_cart });
    }
    // console.log(result);
    // res.send(result.user_cart);
});

app.post('/api/removeProductFromCart', async (req, res) => {
    var result = await User.updateOne({ _id: req.body.id }, { $set: { user_cart: req.body.cart_data } });
    if (result.n == 1) {
        result = await User.findById(req.body.id, "-user_password");
        res.send(result);
    }
});

app.post('/api/removeProductFromWishlist', async (req, res) => {
    var userData = await User.findOne({ _id: req.body._id }, "user_wishlist");
    userData= userData.user_wishlist.split(',');
    if(userData.indexOf(req.body.productId) !== -1)
        userData.splice(userData.indexOf(req.body.productId), 1);
    result = await User.updateOne({ _id: req.body._id }, { $set: { "user_wishlist": userData.toString() } });
    res.send(result);
});

app.patch('/api/addProductToWishlist', async (req, res) => {
    var userData = await User.findOne({ _id: req.body.userId }, "user_wishlist");
    var result, wishlist = ''; wantToAdd = true;
    if (userData.user_wishlist === "") {
        wishlist = req.body.productId;
    }
    else {
        var wishlistArr = userData.user_wishlist.split(',');
        if (!userData.user_wishlist.includes(req.body.productId)) {
            wishlist = userData.user_wishlist + "," + req.body.productId;
        }
        else {
            wishlistArr = wishlistArr.filter((id) => {
                return id !== req.body.productId
            });
            wishlist = wishlistArr.toString();
            wantToAdd = false;
        }
    }
    result = await User.updateOne({ _id: req.body.userId }, { $set: { "user_wishlist": wishlist } });
    result.added = wantToAdd;
    res.send(result);
});
//============================ api to authenticate users======================//
app.post('/api/user/authenticate', async (req, res) => {
    var user_login = req.body.user_login;
    let userData, u = {};
    if (isNaN(Number(user_login)))
        userData = await User.findOne({ "user_email": user_login });
    else
        userData = await User.findOne({ "user_mobileNo": user_login });

    if (!userData)
        res.send({ "errorMsg": "You are not registered with us please sign Up" });
    else {
        // Beacause mongoose query results are not extensible!
        userData = userData.toObject();
        userData.token = await setToken(userData, req.body.user_password);
        u.us = userData; u.token = userData.token;
        res.send(userData);
    }
});

//============================ api for uploading image======================//
app.post('/api/upload', async (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.status(501).send(err);
        }
        res.send({ originalname: req.file.originalname, uploadname: req.file.filename });
    });
});
app.post('/api/getFile', async (req, res) => {
    // path.join(__dirname, '/upload/',req.body.imgname);
    // res.send(req.body);
    // res.type('html');
    res.sendFile(path.join(__dirname, '/upload/', req.body.imgname));
    // var bitmap = fs.readFileSync(path.join(__dirname, '/upload/',req.body.imgname));
    // var img= new Buffer(bitmap).toString('base64');
    // res.send({'imgname': img});
});

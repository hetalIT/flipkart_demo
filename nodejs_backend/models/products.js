var mongoose= require('mongoose');
var Product= mongoose.model('product', {
    product_name: {
        type: String,
        trim: true
    },
    product_price: {
        type: Number
    },
    product_image: {
        type: String,
        trim: true
    },
    product_image_list: {
        type: String,
        trim: true
    },
    product_short_description: {
        type: String,
        trim: true
    },
    product_long_description: {
        type: String,
        trim: true
    },
    product_subsubcategory_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    product_quantity:{
        type: Number
    },
    product_seller:{
        type: String,
        trim: true
    }
});
module.exports= { Product };
var mongoose= require('mongoose');
var SubSubcategory= mongoose.model('subsubcategory',{
    category_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    subcategory_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    subsubcategory_name: {
        type: String,
        trim: true
    }
});
module.exports= { SubSubcategory };
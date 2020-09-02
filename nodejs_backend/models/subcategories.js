var mongoose= require('mongoose');
var Subcategory= mongoose.model('subcategory',{
    category_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    subcategory_name: {
        type: String,
        trim: true,
        unique: true
    }
});
module.exports= { Subcategory };
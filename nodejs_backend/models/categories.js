var mongoose= require('mongoose');
var Category= mongoose.model('category',{
    category_name:{
        type: String,
        trim: true,
        unique: true
    }
});
module.exports= { Category };
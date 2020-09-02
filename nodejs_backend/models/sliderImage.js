var mongoose= require('mongoose');
var SliderImage= mongoose.model('sliderImage',{
    img_name:{
        type: String,
        trim: true
    }
});
module.exports= { SliderImage };
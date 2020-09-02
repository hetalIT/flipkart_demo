var mongoose= require("mongoose");
var User= mongoose.model('user',{
    user_name:{
        type: String,
        trim: true,
        },
    user_mobileNo: {
        type: String,
        trim: true,
        unique: true
    },
    user_email:{
        type: String,
        unique: true,
        trim: true
    },
    user_password:{
        type: String,
        trim: true
    },
    user_address:{
        type: String,
        trim: true
    },
    user_cart:{
        type: String,
        trim: true,
        default: '[]'
    },
    user_wishlist:{
        type: String,
        trim: true,
        default: ''
    },
    user_delivery_address:{
        type: Object,
        default:''
    },
    user_order:{
        type: Object,
        default:''
    }
});
module.exports ={ User };

var express= require("express");
var router= express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { User } = require('../../models/users');
router.use(cors());
router.use(bodyParser.json());

router.post('/addDeliveryAddress', async(req,res)=>{
    var delivery_address={
        addr_name: req.body.addr_name,
        delivery_mobile_no: req.body.delivery_mobile_no,
        pincode: req.body.pincode,
        locality: req.body.locality,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        landmark: req.body.landmark,
        alternate_mobile_no: req.body.alternate_mobile_no,
        addr_type : req.body.addr_type
    };
    var result = await User.updateOne({ _id: req.body.user_id }, { $set: { user_delivery_address: delivery_address } });
    res.send(result);
});
router.post('/getDeliveryAddress', async(req,res)=>{
    res.send(await User.findOne(req.body, "-_id user_delivery_address"));
});

router.post('/addOrder', async(req, res)=>{
    // var result = await User.updateOne({ _id: req.body.user_id }, { $set: { user_delivery_address: delivety_address } });
    // res.send(result);
    var order= req.body.order;
    var result = await User.updateOne({ _id: req.body._id }, { $set: { user_order: order } });
    if(result.nModified===1){
        await User.updateOne({ _id: req.body._id }, { $set: { user_cart: '[]' } });
    }
    res.send(result);
});
module.exports=router;

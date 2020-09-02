const bcrypt= require('bcryptjs');
const njwt= require('njwt');

const config= require('./config');
var setToken=async(user, entered_password)=>{
    if(await bcrypt.compareSync(entered_password, user.user_password))
    {
        var jwt= njwt.create({id: user._id}, config.secret);
        jwt.setExpiration(new Date().getTime()+ (24*60*60*1000));
        return jwt.compact();
    }
    
    else
       return null;
}
module.exports= setToken;
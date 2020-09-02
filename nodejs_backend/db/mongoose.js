var mongoose= require("mongoose");
mongoose.Promise= global.Promise;
mongoose.connect("mongodb://localhost:27017/flipkartDB",
{ useNewUrlParser: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(()=>{
    console.log('mongoose is up');
}, err=>{
    console.log("something went wrong");
    console.log(err);
});
module.exports= {mongoose};
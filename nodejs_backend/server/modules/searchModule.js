/**
 * Created by lcom122 on 11/12/19.
 */
const { Product } = require('../../models/products');
const { Category } = require('../../models/categories');
const { Subcategory } = require('../../models/subcategories');
const { SubSubcategory } = require('../../models/subsubcategories');
var searchFunctions = {
    getProducts: async(subsubcat_id) => {
        return await Product.find({ product_subsubcategory_id: subsubcat_id }).sort({ "$natural": -1 });
    },

    getSubcategory: async(cat_id)=>{
        var result= [];
        var subcatIds=await Subcategory.find({ category_id: cat_id },"_id").sort({ "$natural": -1 });
        for(let subcatId of subcatIds){
            result.push(...await searchFunctions.getSubSubcategory(subcatId));
        }
        return result;
    },

    getSubSubcategory: async(subcat_id) => {
        var result =[];
        var subsubcatIds = await SubSubcategory.find({ subcategory_id: subcat_id }, "_id").sort({ "$natural": -1 });
        for(let subsubcatId of subsubcatIds){
            // var data = await searchFunctions.getProducts(subsubcatId);
            result.push(...await searchFunctions.getProducts(subsubcatId));
        }
        return result;
    },


}
module.exports= searchFunctions;

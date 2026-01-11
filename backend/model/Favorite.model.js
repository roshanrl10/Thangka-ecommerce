import mongoose from "mongoose";

const favoritesSchema = new mongoose.Schema({
   addToCart:{
    type:String,
    require:true,
   }
});
const favorites = mongoose.model('Favorites',favoritesSchema);
export default Cart;
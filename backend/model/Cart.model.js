import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   buyNow:{
    type:String,
    require:true,
   }
});
const Cart = mongoose.model('Cart',cartSchema);
export default Cart;
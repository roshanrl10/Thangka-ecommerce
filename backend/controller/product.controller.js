import mongoose from "mongoose";

import Product from "./model/Product.model";
export const getProduct = async(req,res)=>{
    try {
        const products = await Product.find({})       
        res.status(200).json({success:true,data:products})
    } catch (error) {
        console.log("error while fetching the dat",error.message)
        res.status(500).json({success:false,message:"server error"})
        
    }
}

export const creatProduct =async (req,res)=>{
    const Product= req.body;//user will send this data
    if(!Product.name||!Product.price||!Product.image){
        return res.status(400).json({mesage:"please provide all field"})
    
    }

    const newProduct = new Product(product)
    try {
        await newProduct.save();
        res.status(201).json({success:true,data: newdata})
        
    } catch (error) {
        console.error("error in creating product",error.mesage)
        res.status(500).json({success:false,message:"server erorr"})


        
    }
}

export const updateProduct =async(req,res)=>{
    const {id}=req.params;
    const Product= req.body;
    
    try {
        const updateProduct = await Product.findByIdAndUpdate(id,product,{new:true})
        res.status(200).json({success:true,data:newdata})
    } catch (error) {
        
        res.status(500).json({success:false,message:"server error"})
    }
}

export const deleteProduct = async(req,res)=>{
    const{id}=req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"Product deleted successfully"})

        
    } catch (error) {
        console.error("error in deleteing the product",error.message)
        res.status(500).json({success:false,message:"id not found"})
        
    }

}
import express from "express";
import { getProduct,creatProduct, updateProduct, deleteProduct } from "../controller/product.controller";
const router = express.Router();

router.get("/",getProduct)

router.put("/:id",updateProduct)

router.post("/",creatProduct)

router.delete("/:id",deleteProduct)

export default router;
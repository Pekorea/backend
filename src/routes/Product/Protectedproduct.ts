import express, { Request } from "express";
import { CreateProductInput } from "src/types/ProductInterface";
import { ISession } from "src/types/express";
//databse helper which is prisma
import { db } from "src/utils/db";
import { isVendorAuthenticated } from "../authRouth";
import { body } from "express-validator";
import { CreateProduct } from "src/handlers/product";
import { handleInputErrors } from "src/modules/middleware";

// custom.d.ts (or any other .d.ts file in your project)

const protectedProduct = express.Router();
const createProductValidator = [
  body("description").toString(),
  body("price"),
  body("product_image").toString(),
  body("product_name").toString(),
  body("quantity"),
  body("categories"),
  body("vendor").toString(),
];
// Get all products
product.get("/products:id", async (req, res) => {
  try {
    const products = await db.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get all products for a vendor
product.get("/products", async (req, res) => {
  try {
    const products = await db.product.findMany({
      where: {
        vendorId: (req.session as ISession).vendor_id,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a product by ID
product.get("/products/:id", async (req, res) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new product
protectedProduct.post(
  "/products_create",
  createProductValidator,
  handleInputErrors,
  CreateProduct
);

// Update a product
product.put("/products/:id", isVendorAuthenticated, async (req, res) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await db.product.update({
      where: {
        id: req.params.id,
      },
      data: {},
    });
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(400).json({ error: "Bad request" });
  }
});

// Delete a product
product.delete("/products/:id", isVendorAuthenticated, async (req, res) => {
  try {
    const product = await db.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await db.product.delete({ where: { id: req.params.id } });
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = protectedProduct;

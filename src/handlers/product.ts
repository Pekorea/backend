import { Request, RequestHandler, Response } from "express";
import { db } from "src/utils/db";
import { body, validationResult } from "express-validator";

export const getProductsById =
  (body("id").toString(),
  async (req: Request, res: Response) => {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json({ product });
  });

export const CreateProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const vendor = await db.vendor.findUnique({
    where: {
      id: req.body.vendor,
    },
  });
  if (!vendor) {
    return res.status(400).json({
      message: "vendor not found",
    });
  }
  const product = await db.product.create({
    data: {
      description: req.body.description,
      price: req.body.price,
      product_image: req.body.product_image,
      product_name: req.body.product_name,
      quantity: req.body.quantity,
      categories: req.body.categories,
      vendor: {
        connect: {
          id: req.body.vendor,
        },
      },
    },
  });
  res.json({ product });
};

export const getProductForAVendorbyId = async (req: Request, res: Response) => {
  const product = await db.product.findMany({
    where: {
      vendorId: req.params.vendorId,
    },
  });
  res.json({ product });
};
export const updateProductbyId = async (req: Request, res: Response) => {
  const product = await db.product.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  const updatedProduct = await db.product.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });
  res.json({ updatedProduct });
};

export const deleteProductbyId = async (req: Request, res: Response) => {
  const product = await db.product.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  const deleteProduct = await db.product.delete({
    where: {
      id: req.params.id,
    },
  });
  res.json({ deleteProduct });
};

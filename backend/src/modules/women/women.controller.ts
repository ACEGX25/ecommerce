import { Request, Response } from "express";
import {
  getAllWomenService,
  getWomenByIdService,
  createWomenService,
  updateWomenService,
  deleteWomenService,
} from "./women.service";

export const getAllWomen = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllWomenService();
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getWomenById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    const product = await getWomenByIdService(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createWomen = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdBy = (req as any).user?.id;
    const product = await createWomenService(req.body, createdBy);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateWomen = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    const product = await updateWomenService(id, req.body);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWomen = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    await deleteWomenService(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
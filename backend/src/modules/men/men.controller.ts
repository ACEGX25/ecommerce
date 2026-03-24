import { Request, Response } from "express";
import {
  getAllMenService,
  getMenByIdService,
  getMenByCategoryService,
  createMenService,
  updateMenService,
  deleteMenService,
  getMenCategoriesService,
} from "./men.service";

export const getAllMen = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllMenService();
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMenByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const subcategory = req.params.subcategory as string;
    const products = await getMenByCategoryService(subcategory);
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMenCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getMenCategoriesService();
    res.status(200).json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMenById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    const product = await getMenByIdService(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createMen = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdBy = (req as any).user?.id;
    const product = await createMenService(req.body, createdBy);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMen = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    const product = await updateMenService(id, req.body);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMen = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }
    await deleteMenService(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadMenImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as any;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    res.status(200).json({ image_url: file.path });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
import { Request, Response } from "express";
import {
  createOrderService,
  getOrdersByUserService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService,
  deleteOrderService,
} from "./purchase.service";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const order = await createOrderService(req.body, userId);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const orders = await getOrdersByUserService(userId);
    res.status(200).json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }
    const userId = (req as any).user?.id;
    const order = await getOrderByIdService(orderId, userId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }
    const order = await updateOrderStatusService(orderId, req.body);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }
    await deleteOrderService(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
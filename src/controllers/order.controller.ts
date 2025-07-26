import { Response } from "express";
import OrderModel, { orderDTO, OrderStatus, TypeOrder, TypeVoucher } from "../models/order.model";
import TicketModel from "../models/ticket.model";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";
import { getId } from "../utils/id";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {
                ...req.body,
                createdBy: userId
            } as TypeOrder

            await orderDTO.validate(payload);
            const ticket = await TicketModel.findById(payload.ticket);

            if (!ticket) {
                return response.notFound(res, "Ticket not found");
            }
            if (ticket.quantity < payload.quantity) {
                return response.error(res, null, "Ticket not enough");
            }
            const total: number = +ticket?.price * +payload.quantity;

            Object.assign(payload, { total: total });

            const result = await OrderModel.create(payload);
            response.success(res, result, "Success create an order");
        }
        catch (error) {
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TypeOrder> = {};
            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search
                    }
                })
            }

            const result = await OrderModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            const count = await OrderModel.countDocuments(query);

            response.pagination(res, result, {
                totalPages: Math.ceil(count / limit),
                current: page,
                total: count
            }, "Success find all order");
        } catch (error) {
            response.error(res, error, "Failed find all order");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;

            if (!isValidObjectId(orderId)) {
                return response.notFound(res, "Failed find an order");
            }

            const result = await OrderModel.findById(orderId);

            if (!result) {
                return response.notFound(res, "Order not found");
            }

            response.success(res, result, "Success find an order");
        } catch (error) {
            response.error(res, error, "Failed find an order");
        }
    },

    async findAllByMember(req: IReqUser, res: Response) {

    },

    async complete(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;

            if (!isValidObjectId(orderId)) {
                return response.notFound(res, "Failed complete an order");
            }

            const userId = req.user?.id;

            const order = await OrderModel.findOne({ orderId, createdBy: userId });

            if (!order) {
                return response.notFound(res, "Order not found");
            }
            if (order.status === OrderStatus.COMPLETED) {
                return response.error(res, null, "Order already completed");
            }

            // create vouchers
            const vouchers: TypeVoucher[] = Array.from({ length: order.quantity }, () => {
                return { isPrint: false, voucherId: getId() } as TypeVoucher;
            });

            const result = await OrderModel.findOneAndUpdate({ orderId, createdBy: userId }, { status: OrderStatus.COMPLETED, vouchers }, { new: true });

            // update the quantity of the ticket
            const ticket = await TicketModel.findById(order.ticket);

            if (!ticket) {
                return response.notFound(res, "Ticket not found");
            }

            await TicketModel.updateOne({ _id: ticket._id }, { quantity: ticket.quantity - order.quantity }, { new: true });

            response.success(res, result, "Success complete an order");
        } catch (error) {
            response.error(res, error, "Failed complete an order");
        }
    },

    async pending(req: IReqUser, res: Response) {
        try {
        } catch (error) {
            response.error(res, error, "Failed pending an order");
        }
    },

    async cancel(req: IReqUser, res: Response) {
        try {

        } catch (error) {
            response.error(res, error, "Failed canceled an order");
        }
    }
}
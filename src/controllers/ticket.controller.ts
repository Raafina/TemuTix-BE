
import { Response } from "express";
import { IReqUser, IPaginationQuery } from "../utils/interface";
import response from "../utils/response";
import TicketModel, { ticketDTO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await ticketDTO.validate(req.body);
            const result = await TicketModel.create(req.body);
            response.success(res, result, "Success create ticket");
        }
        catch (error) {
            response.error(res, error, "Failed create ticket");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TypeTicket> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search
                    }
                })
            }

            const result = await TicketModel.find(query)
                .populate("events")
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await TicketModel.countDocuments(query);

            response.pagination(res, result, {
                totalPages: Math.ceil(count / limit),
                current: page,
                total: count
            }, "Success find all ticket");
        }

        catch (error) {
            response.error(res, error, "Failed find all ticket");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find a ticket");
            }

            const result = await TicketModel.findById(id);

            if (!result) {
                return response.notFound(res, "Ticket not found");
            }

            response.success(res, result, "Success find a ticket");
        }
        catch (error) {
            response.error(res, error, "Failed find a ticket");
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed update a ticket");
            }

            const result = await TicketModel.findByIdAndUpdate(id, req.body, { new: true });

            if (!result) {
                return response.notFound(res, "Ticket not found");
            }

            response.success(res, result, "Success update a ticket");
        }
        catch (error) {
            response.error(res, error, "Failed update a ticket");
        }
    },

    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed remove a ticket");
            }

            const result = await TicketModel.findByIdAndDelete(id, { new: true });

            if (!result) {
                return response.notFound(res, "Ticket not found");
            }

            response.success(res, result, "Success remove a ticket");
        }
        catch (error) {
            response.error(res, error, "Failed remove a ticket");
        }
    },

    async findAllByEvent(req: IReqUser, res: Response) {
        try {
            const { eventId } = req.params;

            if (!isValidObjectId(eventId)) {
                return response.notFound(res, "Event not found");
            }

            const result = await TicketModel.find({ events: eventId }).exec();

            if (!result) {
                return response.notFound(res, "Ticket not found");
            }

            response.success(res, result, "Success find all ticket by event");
        }
        catch (error) {
            response.error(res, error, "Failed find all ticket by event");
        }
    },



}
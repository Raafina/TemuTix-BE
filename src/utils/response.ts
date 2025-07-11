import { Response } from "express";
import * as Yup from "yup";

type Pagination = {
    totalPages: number;
    current: number;
    total: number;
};

export default {
    success(res: Response, data: any, message: string) {
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
        });
    },

    error(res: Response, error: unknown, message: string) {
        if (error instanceof Yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message,
                },
                data: error.errors,
            });
        }
        return res.status(500).json({
            meta: {
                status: 500,
                message,
            },
            data: error,
        });
    },

    unauthorized(res: Response, message: string = "Unauthorized") {
        res.status(403).json({
            meta: {
                status: 403,
                message: message,
            },
            data: null,
        });
    },

    pagination(res: Response, data: any[], pagination: Pagination, message: string) {
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
            pagination,
        });
    },
}
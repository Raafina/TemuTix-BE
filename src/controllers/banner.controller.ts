import { Response } from "express";
import { IReqUser, IPaginationQuery } from "../utils/interface";
import response from "../utils/response";
import BannerModel, { bannerDTO, TypeBanner } from "../models/banner.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await bannerDTO.validate(req.body);
            const result = await BannerModel.create(req.body);
            response.success(res, result, "Success create a banner");
        } catch (error) {
            response.error(res, error, "Failed create a banner");
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const {
                limit = 10,
                page = 1,
                search,
            } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TypeBanner> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search,
                    },
                });
            }
            const result = await BannerModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();
            const count = await BannerModel.countDocuments(query);

            response.pagination(
                res,
                result,
                {
                    total: count,
                    current: page,
                    totalPages: Math.ceil(count / limit),
                },
                "Success find all banners"
            );
        } catch (error) {
            response.error(res, error, "Failed find all banners");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find a banner");
            }

            const result = await BannerModel.findById(id);

            if (!result) {
                return response.notFound(res, "Banner not found");
            }

            response.success(res, result, "Success find a banner");
        } catch (error) {
            response.error(res, error, "Failed find a banner");
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed update a banner");
            }

            const result = await BannerModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!result) {
                return response.notFound(res, "Banner not found");
            }

            response.success(res, result, "Success update a banner");
        } catch (error) {
            response.error(res, error, "Failed update a banner");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed remove a banner");
            }

            const result = await BannerModel.findByIdAndDelete(id, {
                new: true,
            });

            if (!result) {
                return response.notFound(res, "Banner not found");
            }

            response.success(res, result, "Success remove a banner");
        } catch (error) {
            response.error(res, error, "Failed remove a banner");
        }
    },
};

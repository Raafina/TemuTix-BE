import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

export interface IUserToken
    extends Omit<
        User,
        | 'isActive'
        | 'password'
        | 'activationCode'
        | 'email'
        | 'fullName'
        | 'profilePicture'
        | 'username'
    > {
    id?: Types.ObjectId;
}

export interface IReqUser extends Request {
    user?: IUserToken;
}
export interface IPaginationQuery {
    page: number;
    limit: number;
    search?: string;
}
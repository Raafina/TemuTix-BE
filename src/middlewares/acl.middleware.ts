import { Response, NextFunction } from "express";
import { IReqUser } from "../utils/interface";
export default (roles: string[]) => { // ["admin", "member"]
    return (req: IReqUser, res: Response, next: NextFunction) => {
        const role = req.user?.role;  // 'manager
        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                data: null,
                message: "Forbidden",
            })
        }
        next();
    }
}
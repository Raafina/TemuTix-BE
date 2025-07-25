import { IReqUser } from '../utils/interface';
import { Request, Response, NextFunction } from 'express';
import { getUserData } from '../utils/jwt';
import response from '../utils/response';

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unauthorized(res);
  }

  const [prefix, token] = authorization.split(' ');
  if (!(prefix === 'Bearer' && token)) {
    return response.unauthorized(res);
  }

  const user = getUserData(token);

  if (!user) {
    return response.unauthorized(res);
  }

  (req as IReqUser).user = user;

  next();
};

import jwt from 'jsonwebtoken';
import { IUserToken } from '../utils/interface';

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, process.env.SECRET || '', {
    expiresIn: '1d',
  });

  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, process.env.SECRET || '') as IUserToken;
  return user;
};

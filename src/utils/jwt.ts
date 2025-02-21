import { Types } from 'mongoose';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

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

import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../utils/interface';
import response from '../utils/response';

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface TLogin {
  identifier: string;
  password: string;
}

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(6, 'Password must be at least 6 characters')
    .test(
      'at-least-one-uppercase-letter',
      'Contains at least one uppercase letter',
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      })
    .test(
      'at-least-one-number',
      'Contains at least one number',
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
      }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), ''], 'Password not match'),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody{
       required: true,
       schema: {$ref: "#/components/schemas/RegisterRequest"}
     }
     */
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });

      response.success(res, result, 'Success registration');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, 'Failed registration');
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody{
      required: true,
      schema: {$ref: "#/components/schemas/LoginRequest"}
     }
     */
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      // get user data from identifier -> email or username
      const userByIdentifier = await UserModel.findOne({
        $or: [
          { email: identifier },
          { username: identifier }],
        isActive: true // just user who active account
      });

      if (!userByIdentifier) {
        return response.unauthorized(res, 'User not found');
      }

      // validate req password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, 'Password not match');
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, { token }, 'Login success');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, 'Login failed');
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{ "bearerAuth": [] }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);
      response.success(res, result, 'Success get user profile');
      if (!result) {

      }
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, err.message);
    }
  },

  async activation(req: Request, res: Response) {
    /**
     * #swagger.tags = ['Auth']
     * #swagger.requestBody{
        required: true,
        schema: {$ref: "#/components/schemas/ActivationRequest"}
     }
     */
    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate({
        activationCode: code,
      }, {
        isActive: true,
      }, {
        new: true, // exactly execute the query
      });

      response.success(res, user, 'Activation success');
    }
    catch (error) {
      const err = error as unknown as Error;
      response.error(res, err, err.message);
    }
  }
};

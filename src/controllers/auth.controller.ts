import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../utils/interface';

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface Login {
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

      res.status(200).json({
        message: 'Register Success',
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
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
    const { identifier, password } = req.body as unknown as Login;
    try {
      // get user data from identifier -> email or username
      const userByIdentifier = await UserModel.findOne({
        $or: [
          { email: identifier },
          { username: identifier }],
        isActive: true // just user who active account
      });

      if (!userByIdentifier) {
        return res.status(403).json({
          message: 'User not found',
          data: null,
        });
      }

      // validate req password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return res.status(403).json({
          message: 'User not match',
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({
        message: 'Login Success',
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{ "bearerAuth": [] }]
     */
    try {
      const user = req.user;
      console.log(req.user, 'user');
      const result = await UserModel.findById(user?.id);
      console.log(result);
      res.status(200).json({
        message: 'Success get user profile',
        data: result,
      });
      if (!result) {
        return res.status(404).json({
          message: 'User not found',
          data: null,
        });
      }
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
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


      return res.status(400).json({
        message: 'User succesfully activated',
        data: user,
      });

    }
    catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
};

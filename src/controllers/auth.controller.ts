import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel, { userDTO, userLoginDTO, userUpdatePasswordDTO } from '../models/user.model';
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

export default {
  async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { fullName, profilePhoto } = req.body;
      const result = await UserModel.findByIdAndUpdate(userId, {
        fullName,
        profilePhoto,
      },
        {
          new: true,
        }
      );

      if (!result) {
        return response.notFound(res, 'User not found');
      }

      response.success(res, result, 'Success update profile');
    } catch (error) {
      response.error(res, error, 'Failed update profile');
    }
  },

  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, password, confirmPassword } = req.body;

      await userUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      })

      const user = await UserModel.findById(userId);

      if (!user || user.password !== encrypt(oldPassword)) {
        return response.notFound(res, "user not found")
      }

      const result = await UserModel.findByIdAndUpdate(userId, {
        password: encrypt(password),
      },
        {
          new: true
        }
      )

      response.success(res, result, "Success to update password")

    } catch (error) {
      response.error(res, error, 'Failed update password');
    }
  },

  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await userDTO.validate({
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

    const { identifier, password } = req.body;
    try {
      await userLoginDTO.validate({
        identifier,
        password
      });

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

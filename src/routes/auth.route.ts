import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/contants";

const router = express.Router();

router.post(
    "/register",
    authController.register
    /*
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/RegisterRequest"
       }
     }
     */
);

router.post(
    "/login",
    authController.login
    /*
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/LoginRequest"
       }
     }
     */
);

router.get(
    "/me",
    authMiddleware,
    authController.me
    /*
    #swagger.tags = ['Auth']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    */
);

router.post(
    "/activation",
    authController.activation
    /*
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/ActivationRequest"
      }
    }
    */
);

router.put(
    "/update-profile",
    [authMiddleware, aclMiddleware([ROLES.MEMBER])],
    authController.updateProfile
    /*
     #swagger.tags = ['Auth']
     #swagger.security = [{
       "bearerAuth": {}
     }]
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/UpdateProfileRequest"
       }
     }
     */
);

router.put(
    "/update-password",
    [authMiddleware, aclMiddleware([ROLES.MEMBER])],
    authController.updatePassword
    /*
     #swagger.tags = ['Auth']
     #swagger.security = [{
       "bearerAuth": {}
     }]
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/UpdatePasswordRequest"
       }
     }
     */
);

export default router;
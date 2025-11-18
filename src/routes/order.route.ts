import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/contants';
import orderController from '../controllers/order.controller';

const router = express.Router();

router.post(
    "/",
    [authMiddleware, aclMiddleware([ROLES.MEMBER])],
    orderController.create
    /*
    #swagger.tags = ['Order']
    #swagger.security = [{
        "bearerAuth": ""
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateOrderRequest"
        }
    }
    */
)

router.get(
    "/",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.findAll
    /*
    #swagger.tags = ['Order']
    #swagger.security = [{
        "bearerAuth": ""
    }]
    */)

router.get(
    "/history",
    [authMiddleware, aclMiddleware([ROLES.MEMBER])],
    orderController.findAllByMember
        /*
        #swagger.tags = ['Order']
        #swagger.security = [{
            "bearerAuth": ""
        }]
        */)

router.get(
    "/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
    orderController.findOne
    /*
    #swagger.tags = ['Order']
    #swagger.security = [{
        "bearerAuth": ""
    }]
    */
)

router.put(
    "/:id/completed",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.complete
    /*
    #swagger.tags = ['Order']
    #swagger.security = [{
        "bearerAuth": ""
    }]
    */
)

router.put(
    "/:id/pending",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.pending
    /*
    #swagger.tags = ['Order']
    #swagger.security = [{
        "bearerAuth": ""
    }]
    */)

router.put(
    "/:id/cancelled",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.cancelled
    /*
    #swagger.tags = ['Order']
    #swagger.security = [{
        "bearerAuth": ""
    }]
    */)


router.delete(
    "/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.remove
            /*
            #swagger.tags = ['Order']
            #swagger.security = [{
                "bearerAuth": ""
            }]
            */)

export default router;
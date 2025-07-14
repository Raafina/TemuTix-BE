import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import categoryController from '../controllers/category.controller';
import { ROLES } from '../utils/contants';

const router = express.Router();

router.post('/', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.create
    /*
      #swagger.tags = ['Category']
      #swagger.security = [{
        "bearerAuth": {}
    }]
      #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCategoryRequest"
        }
    }
    */
);


router.get('/', categoryController.findAll
    /*
      #swagger.tags = ['Category']
      */
);


router.get('/:id', categoryController.findOne
    /*
      #swagger.tags = ['Category']
      */
);

router.put('/:id', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update
    /*
     #swagger.tags = ['Category']
     #swagger.security = [{
       "bearerAuth": {}
     }]
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/CreateCategoryRequest"
       }
     }
    */
);

router.delete('/:id', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    */
);

export default router;
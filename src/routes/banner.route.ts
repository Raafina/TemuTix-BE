import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import bannerController from '../controllers/banner.controller';
import { ROLES } from '../utils/contants';

const router = express.Router();

router.post(
  "/",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.create
  /*
  #swagger.tags = ['Banners']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateBannerRequest"
    }
  }
  */
);
router.get(
  "/",
  bannerController.findAll
  /*
  #swagger.tags = ['Banners']
  */
);
router.get(
  "/:id",
  bannerController.findOne
  /*
  #swagger.tags = ['Banners']
  */
);
router.put(
  "/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.update
  /*
  #swagger.tags = ['Banners']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateBannerRequest"
    }
  }
  */
);
router.delete(
  "/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.remove
  /*
  #swagger.tags = ['Banners']
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
);

export default router;
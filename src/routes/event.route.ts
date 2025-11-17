import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import eventController from '../controllers/event.controller';
import { ROLES } from '../utils/contants';

const router = express.Router();

router.post(
  '/',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
  /*
   #swagger.tags = ['Events']
   #swagger.security = [{
     "bearerAuth": {}
   }]
   #swagger.requestBody = {
     required: true,
     schema: {
       $ref: "#/components/schemas/CreateEventRequest"
     }
   }
   */
);

router.get(
  '/',
  eventController.findAll
  /*
   #swagger.tags = ['Events']
   #swagger.parameters['limit'] = {
     in: 'query',
     type: 'number',
     default: 10
   }
   #swagger.parameters['page'] = {
     in: 'query',
     type: 'number',
     default: 1
   }
   #swagger.parameters['category'] = {
     in: 'query',
     type: 'string'
   }
   #swagger.parameters['isOnline'] = {
     in: 'query',
     type: 'boolean'
   }
   #swagger.parameters['isPublish'] = {
     in: 'query',
     type: 'boolean'
   }
   #swagger.parameters['isFeatured'] = {
     in: 'query',
     type: 'boolean'
   }
   */
);

router.get(
  '/:id',
  eventController.findOne
  /*
    #swagger.tags = ['Events']
    */
);

router.get(
  '/:slug/slug',
  eventController.findOneBySlug
  /*
   #swagger.tags = ['Events']
   */
);

router.put(
  '/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
  /*
   #swagger.tags = ['Events']
   #swagger.security = [{
     "bearerAuth": {}
   }]
   #swagger.requestBody = {
     required: true,
     schema: {
       $ref: "#/components/schemas/CreateEventRequest"
     }
   }
   */
);

router.delete(
  '/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
  /*
   #swagger.tags = ['Events']
   #swagger.security = [{
     "bearerAuth": {}
   }]
   */
);

export default router;
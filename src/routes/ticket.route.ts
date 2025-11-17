import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import ticketController from '../controllers/ticket.controller';
import { ROLES } from '../utils/contants';

const router = express.Router();

router.post(
  '/',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.create
  /*
   #swagger.tags = ['Tickets']
   #swagger.security = [{
     "bearerAuth": {}
   }]
   #swagger.requestBody = {
     required: true,
     schema: {
       $ref: "#/components/schemas/CreateTicketRequest"
     }
   }
   */
);

router.get(
  '/',
  ticketController.findAll
  /*
   #swagger.tags = ['Tickets']
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
  ticketController.findOne
  /*
    #swagger.tags = ['Tickets']
    */
);

router.get(
  '/:eventId/events',
  ticketController.findAllByEvent
  /*
   #swagger.tags = ['Tickets']
   */
);


router.put(
  '/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.update
  /*
   #swagger.tags = ['Tickets']
   #swagger.security = [{
     "bearerAuth": {}
   }]
   #swagger.requestBody = {
     required: true,
     schema: {
       $ref: "#/components/schemas/CreateTicketRequest"
     }
   }
   */
);
router.delete(
  '/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.remove
  /*
   #swagger.tags = ['Tickets']
   #swagger.security = [{
     "bearerAuth": {}
   }]
   */
);

export default router;
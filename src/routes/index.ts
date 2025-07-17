import express from 'express';
import authRoute from './auth.route';
import mediaRoute from './media.route';
import categoryRoute from './category.route';
import regionRoute from './region.route';
import eventRoute from './event.route';
import ticketRoute from './ticket.route'
import bannerRoute from './banner.route'

const router = express.Router();

router.use('/auth', authRoute)
router.use('/media', mediaRoute);
router.use('/category', categoryRoute);
router.use('/regions', regionRoute);
router.use('/events', eventRoute);
router.use('/tickets', ticketRoute);
router.use('/banners', bannerRoute);

export default router;
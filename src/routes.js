import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import ListMeetupController from './app/controllers/ListMeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/meetups', upload.single('file'), MeetupController.store);
routes.delete('/meetups/:meetupId', MeetupController.delete);
routes.get('/meetups', MeetupController.index);
routes.get('/meetups/list', ListMeetupController.index);
routes.put(
  '/meetups/:meetupId',
  upload.single('file'),
  MeetupController.update
);

routes.post('/subscription/:meetupId', SubscriptionController.store);
routes.get('/subscription', SubscriptionController.index);

export default routes;

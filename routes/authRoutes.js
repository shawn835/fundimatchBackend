import {
  registerUserController,
  registerFundiController,
} from '../controllers/userController.js';

export const authRoutes = [
  {
    route: '/api/register/customer',
    method: 'POST',
    handler: registerUserController,
  },
  {
    route: '/api/register/fundi',
    method: 'POST',
    handler: registerFundiController,
  },
];

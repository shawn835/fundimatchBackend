import { loginUser } from '../controllers/userController/loginuser.js';
import { registerUserController } from '../controllers/userController/registerCustomer.js';
import { updateCustomer } from '../controllers/userController/updateCustomer.js';
import { updatePassword } from '../controllers/userController/updatePassword.js';
import { registerFundiController } from '../controllers/userController/registerFundi.js';
import { updateFundi } from '../controllers/userController/updateFundi.js';
import { handleVerifyCode } from '../Services/verifyEmail.js';
import { resendCode } from '../Services/resendCode.js';
import { getMeController } from '../controllers/userController/getMe.js';
import { deleteUser } from '../controllers/userController/deleteUser.js';
import { logoutUser } from '../controllers/userController/logoutUser.js';
export const routes = [
  {
    method: 'POST',
    route: '/api/register/customer',
    handler: registerUserController,
  },
  {
    method: 'POST',
    route: '/api/register/fundi',
    handler: registerFundiController,
  },
  {
    method: 'POST',
    route: '/api/login',
    handler: loginUser,
  },
  {
    method: 'POST',
    route: '/api/verify/code',
    handler: handleVerifyCode,
  },

  {
    method: 'POST',
    route: '/api/resend/code',
    handler: resendCode,
  },
  {
    method: 'PATCH',
    route: '/api/update/customer',
    protected: true,
    handler: updateCustomer,
  },
  {
    method: 'PATCH',
    route: '/api/update/fundi',
    protected: true,
    handler: updateFundi,
  },
  {
    method: 'PATCH',
    route: '/api/update/password',
    protected: true,
    handler: updatePassword,
  },
  {
    method: 'DELETE',
    route: '/api/delete/user',
    protected: true,
    handler: deleteUser,
  },
  {
    method: 'DELETE',
    route: '/api/logout/user',
    protected: true,
    handler: logoutUser,
  },
  {
    method: 'GET',
    route: '/api/me',
    protected: true,
    handler: getMeController,
  },
];

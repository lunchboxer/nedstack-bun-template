import { changePassword } from '../controllers/auth/change-password.js'
import { loginController } from '../controllers/auth/login.js'
import { logoutController } from '../controllers/auth/logout.js'
import { registerController } from '../controllers/auth/register.js'
import { showLogin } from '../controllers/auth/show-login.js'
import { showRegister } from '../controllers/auth/show-register.js'
import {
    allUsers,
    createUser,
    deleteUser,
    editUser,
    showChangePasswordForm,
    showUser,
    showUserEditForm
} from '../controllers/userController.js'
import { onlyAdmins, onlyAdminsOrSelf, onlyAuthenticated } from '../middleware/auth.js'

export const routes = [
// Method,  Path,                        Handler or Template         Auth Middleware
  ['GET',   '/',                         'index.html'                                   ],

  ['GET',   '/auth/login',               showLogin                                      ],
  ['GET',   '/auth/register',            showRegister                                   ],
  ['GET',   '/auth/profile',             'auth/profile.html',         onlyAuthenticated ],
  ['GET',   '/auth/logout',              logoutController                               ],
  ['POST',  '/auth/login',               loginController                                ],
  ['POST',  '/auth/register',            registerController                             ],

  ['GET',   '/user',                     allUsers,                    onlyAdmins        ],
  ['GET',   '/user/create',              'user/create.html',          onlyAdmins        ],
  ['POST',  '/user/create',              createUser,                  onlyAdmins        ],
  ['GET',   '/user/:id',                 showUser,                    onlyAdminsOrSelf  ],
  ['POST',  '/user/:id',                 editUser,                    onlyAdminsOrSelf  ],
  ['GET',   '/user/:id/edit',            showUserEditForm,            onlyAdminsOrSelf  ],
  ['POST',  '/user/:id/delete',          deleteUser,                  onlyAdmins        ],
  ['GET',   '/user/:id/change-password', showChangePasswordForm,      onlyAdminsOrSelf  ],
  ['POST',  '/user/:id/change-password', changePassword,              onlyAdminsOrSelf  ],

  ['GET',   '/error-test',    (_ctx, _req, _params) => {throw new Error('This is an error')}],
]

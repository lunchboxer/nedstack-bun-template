import { handleChangePassword } from '../controllers/auth/change-password.js'
import { handleLogin, renderLogin } from '../controllers/auth/login.js'
import { handleLogout } from '../controllers/auth/logout.js'
import { renderProfile } from '../controllers/auth/profile.js'
import { handleRegister, renderRegister } from '../controllers/auth/register.js'
import { renderHomepage } from '../controllers/index.js'
import {
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUser,
    renderAllUsers,
    renderCreateUser,
    renderEditUser,
    renderPasswordForm,
    renderUserDetail
} from '../controllers/userController.js'
import { onlyAdmins, onlyAdminsOrSelf, onlyAuthenticated } from '../middleware/auth.js'

// Consider the following naming convention for route handlers:
//  - renderPage for function that just passes data to the template and returns a rendered page
//  - handleOperation for function that does something with the data and returns a rendered page
//  - handle[CRUD verb]model for crud operations
//
export const routes = [
// Method,  Path,                        Handler                     Auth Middleware
  ['GET',   '/',                         renderHomepage                                 ],

  ['GET',   '/auth/login',               renderLogin                                    ],
  ['GET',   '/auth/register',            renderRegister                                 ],
  ['GET',   '/auth/profile',             renderProfile,              onlyAuthenticated  ],
  ['GET',   '/auth/logout',              handleLogout                                   ],
  ['POST',  '/auth/login',               handleLogin                                    ],
  ['POST',  '/auth/register',            handleRegister                                 ],

  ['GET',   '/user',                     renderAllUsers,              onlyAdmins        ],
  ['GET',   '/user/create',              renderCreateUser,            onlyAdmins        ],
  ['POST',  '/user/create',              handleCreateUser,            onlyAdmins        ],
  ['GET',   '/user/:id',                 renderUserDetail,            onlyAdminsOrSelf  ],
  ['POST',  '/user/:id',                 handleUpdateUser,            onlyAdminsOrSelf  ],
  ['GET',   '/user/:id/edit',            renderEditUser,              onlyAdminsOrSelf  ],
  ['POST',  '/user/:id/delete',          handleDeleteUser,            onlyAdmins        ],
  ['GET',   '/user/:id/change-password', renderPasswordForm,          onlyAdminsOrSelf  ],
  ['POST',  '/user/:id/change-password', handleChangePassword,        onlyAdminsOrSelf  ],

  ['GET',   '/error-test',    (_ctx, _req, _params) => {throw new Error('This is an error')}],
]

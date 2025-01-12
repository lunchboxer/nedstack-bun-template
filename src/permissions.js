// const onlyAuthenticated = context => {
//   if (!context.user) {
//     return 'You must be logged in to access this page'
//   }
// }

const onlyAdminsCanEditRoles = context => {
  if (context.user?.role !== 'admin' && context.body?.role) {
    return "You must be an admin to edit this user's role"
  }
}

const onlyAdmins = context => {
  if (context.user?.role !== 'admin') {
    return 'You must be an admin to access this page'
  }
}

const onlyAdminsOrSelf = (context, _request, params) => {
  if (context.user?.role !== 'admin' && context.user?.id !== params.id) {
    return 'You must be an admin or the same user to access this page'
  }
}

export const routeAuthRules = {
  '/user': {
    all: onlyAdmins,
  },
  '/user/:id/edit': {
    all: [onlyAdminsOrSelf, onlyAdminsCanEditRoles],
  },
}

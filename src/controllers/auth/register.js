import { User } from '../../models/userModel.js'
import { setAlert } from '../../utils/alert.js'
import { setCookie } from '../../utils/cookies.js'
import { generateJwt } from '../../utils/crypto.js'
import { redirect } from '../../utils/redirect.js'

export const registerController = async (context, request) => {
  try {
    if (!context.body) {
      throw new Error('Missing request body')
    }
    const { data: user, errors } = await User.create(context.body)

    if (errors) {
      return context.sendPage('auth/register.html', {
        ...context.body,
        errors,
      })
    }

    const token = await generateJwt({ id: user.id }, process.env.JWT_SECRET)

    setCookie(context, 'auth', token, undefined, true)
    setAlert(
      context,
      `You're now logged in as new user ${user.username}!`,
      'success',
    )
    const url = new URL(request.url, `http://${request.headers.host}`)
    const redirectUrl = url.searchParams.get('redirect') || '/'
    return redirect(context, redirectUrl)
  } catch (error) {
    return context.sendPage('auth/register.html', {
      ...context.body,
      errors: { all: error.message },
    })
  }
}

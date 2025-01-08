import { User } from '../../models/userModel.js'
import { setAlert } from '../../utils/alert.js'
import { setCookie } from '../../utils/cookies.js'
import { generateJwt, passwordMatches } from '../../utils/crypto.js'
import { redirect } from '../../utils/redirect.js'
import { loginPage } from '../../views/auth/login.html.js'

export const handleLogin = async (context, request) => {
  const url = new URL(request.url)
  const redirectUrl = url.searchParams.get('redirect') || '/'

  try {
    const { username, password } = context.body

    if (!(username && password)) {
      throw new Error('Username and password are required')
    }

    // Find the user by username
    const { data: user, errors } = User.findByUsername(username, true)
    if (errors) {
      throw new Error('Invalid credentials')
    }

    // Validate the password
    const isPasswordValid = await passwordMatches(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Generate a JWT token
    const token = await generateJwt({ id: user.id }, process.env.JWT_SECRET)

    setCookie(context, 'auth', token)
    setAlert(context, `You're now logged in as ${user.username}!`, 'success')

    return redirect(context, redirectUrl)
  } catch (error) {
    console.error('error', error)
    return context.sendPage(loginPage, {
      errors: { all: error.message },
    })
  }
}

export const renderLogin = (context, _request) => {
  if (context.user) {
    setAlert(context, 'You are already logged in')
    return redirect(context, '/')
  }
  return context.sendPage(loginPage)
}

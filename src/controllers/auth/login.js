import { User } from '../../models/userModel.js'
import { setAlert } from '../../utils/alert.js'
import { setCookie } from '../../utils/cookies.js'
import { generateJwt, passwordMatches } from '../../utils/crypto.js'
import { redirect } from '../../utils/redirect.js'

export const loginController = async (context, request) => {
  const url = new URL(request.url)
  const redirectUrl = url.searchParams.get('redirect') || '/'

  try {
    const { username, password } = context.body

    if (!(username && password)) {
      throw new Error('Username and password are required')
    }

    // Find the user by username
    const { data: user, errors } = await User.findByUsername(username, true)
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

    setCookie(context, 'auth', token, undefined, true)
    setAlert(context, `You're now logged in as ${user.username}!`, 'success')

    return redirect(context, redirectUrl)
  } catch (error) {
    console.error('error', error)
    return context.sendPage('auth/login.html', {
      errors: { all: error.message },
    })
  }
}

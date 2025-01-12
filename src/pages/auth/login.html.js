import { userModel } from '../../models/userModel.js'
import { setAlert } from '../../utils/alert.js'
import { setCookie } from '../../utils/cookies.js'
import { generateJwt, passwordMatches } from '../../utils/crypto.js'
import { html } from '../../utils/html.js'
import { redirect } from '../../utils/redirect.js'
import { layout } from '../_layout.html.js'

const title = 'Log in'

const headExtras = html`
<link rel="prefetch" href="/auth/register">
`

const content = () => html`

<form action="/auth/login" method="post">

  <h2>Login</h2>

  <label for="username">Username</label>
  <input type="text" name="username" id="username" required />

  <label for="password">Password</label>
  <input type="password" name="password" id="password" required />

  <div class="button-group">
    <input type="submit" value="Log in" />
  </div>
</form>
<p>Don't have an account? <a href="/auth/register">Create one now.</a></p>

`

export const loginPage = data => layout({ title, content, data, headExtras })

export const GET = (context, _request) => {
  if (context.user) {
    setAlert(context, 'You are already logged in')
    return redirect(context, '/')
  }
  return context.sendPage(loginPage)
}

export const POST = async (context, request) => {
  const url = new URL(request.url)
  const redirectUrl = url.searchParams.get('redirect') || '/'

  try {
    const { username, password } = context.body

    if (!(username && password)) {
      throw new Error('Username and password are required')
    }

    const { data: user, errors } = userModel.findByUsername(username, true)
    if (errors) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await passwordMatches(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

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

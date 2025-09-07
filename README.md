![Header](./nerdy-ned-banner.webp)
# NEDStack template

- Bun
- That's it, okay?

This is a template for an [Bun](http://bun.sh) web server using tagged template literals to compose html. There is almost no frontend javascript. You can add yours on an as needed basis.

Requires Bun v1.1.14 or higher.

## Other features

- CSS only theme switcher. Some JS is used to persist the theme across page loads.
- CSS largely based on [milligram](https://milligram.io/)
- biome for linting and formatting
- [feather icons](https://feathericons.com/)
- Simple cookie-based JWT authentication with password and username
- SQLite database migrations with [atlas](https://atlasgo.io)
- SQLite database using native [bun](https://bun.sh) sqlite driver
- Simple in memory session store
- Simple error handling
- Cookie-based alert system
- secure headers a-la [helmet](https://helmetjs.github.io/)
- role-base auth with route middleware to restrict access where needed
- file-based routing
- hot-reloading for frontend files

## Getting started

Since it's a template, you'll need to make a copy of it. I recommend using [degit](https://github.com/Rich-Harris/degit) to do this.

```bash
bunx degit lunchboxer/nedstack-bun-template my-project
cd my-project
```

You'll need to have [atlas](https://atlasgo.io) installed for the database migrations. `curl -sSf https://atlasgo.sh | sh` should do the trick. With atlas installed run `./database/migrate-dev.sh`  and `./database/migrate-prod.sh` to create the local sqlite databases and set them up according to `./database/schema.sql`.

Install dependencies with `bun install`.

Create a `.env` file with the following contents:

```env
JWT_SECRET=changeme
NODE_ENV=development
```

Create the first admin user with `bun run seed`
Run the server with `bun run dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

The production server uses brotli to serve static files. So you'll need to run `bun run compress` to update the static compressed files.

### Quick start

```bash
# clone the repo
bunx degit lunchboxer/nedstack-bun-template my-project
cd my-project

# set up databases (dev & prod)
./database/migrate-dev.sh
./database/migrate-prod.sh

# add required env vars
cat <<EOF > .env
JWT_SECRET=changeme
NODE_ENV=development
EOF

# seed an admin user
bun run seed

# start the dev server
bun run dev
```

After the last command finishes, open http://localhost:3000 in your browser and log in with the seeded admin credentials.

## html templates

You'll notice the views directory has files with `.html.js` extension. This is nothing special. It helps me to know that this is a module for outputting html. It's also used by my text editor (neovim BTW) to trigger the right tooling for fun and easy editing.

Html is written inside of javascript tagged template literals like this:

```js
import { html } from '../html.js'

const someHtml = (data) => html`<p>${data?.text}</p>`
```

You could you a plain template literal, but my editor uses this to know if it's dealing with html or javascript. It also trims extra whitespace off the ends. That is all it does. Your secure headers are not quite enough to fend of threats from potential xss attacks. In the above example, if `data.text` is not strictly under your control then it will need to be sanitized first. This could be done automatically, but with NedStack it's done manually

```js
import { sanitize, html } from '../html.js'

const someHtml = (data) => html`<p>${sanitize(data?.text)}</p>`
```

There is no special syntax to learn and you need not struggle to figure out what the abstractions are doing that goes against your intuition. Everything is just plain javascript.

### Loops, conditionals, partials, and layouts

Yes. All just simple javascript. Want to loop over an array? That looks like this:

```js
const someHtml = (items) => html`
  <ul>
    ${items?.map((item) => html`<li>${item}</li>`).join('')}
  </ul>
  `
```

Want to conditionally render something?

```js
const someHtml = ({ foo, bar }) => html`
<h1>Conditional Rendering</h1>
${foo
? html`<p>Foo is true-ish</p>`
: html`<p>Foo isn't</p>`
}

<div class="${bar && 'bar-is-true-ish'}">
    <p>stuff</p>
</div>
`
```

## Routing

The router looks for functions with the method name in the file matching the route. In order to be able to use the delete method, the functions are named will all caps - "GET", "POST", "PUT", "PATCH", and "DELETE". Route parameters are defined by directories with brackets, so `/user/[id]/index.html.js` will match a request to route '/user/nw9anW0_al-4bhw' and pass in argument `parameters = { id: nw9anW0_al-4bhw }`.

## Going further

An in-memory session store is used for simplicity, but I would not recommend it on an app with a lot of traffic or complexity. A lot of people use Redis.

## **License**

NedStack template is released under the MIT License. See the **[LICENSE](./LICENSE)** file for details.

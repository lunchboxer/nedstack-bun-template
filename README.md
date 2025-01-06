![Header](./nerdy-ned-banner.webp)
# NEDStack template

- nunjucks
- Bun
- That's it, okay?

This is a template for an [Bun](http://bun.sh) web server using [nunjucks](https://mozilla.github.io/nunjucks/) as the templating engine. There is almost no frontend javascript. You can add yours on an as needed basis.

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
```

Create the first admin user with `bun run seed`
Run the server with `bun run dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

The production server uses brotli to serve static files. So you'll need to run `bun run compress` to update the static compressed files.

## Going further

An in-memory session store is used for simplicity, but I would not recommend it on an app with a lot of traffic or complexity. A lot of people use Redis.

## **License**

NEDStack template is released under the MIT License. See the **[LICENSE](./LICENSE)** file for details.

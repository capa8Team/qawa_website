# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
## 📤 Contact form with MailerSend

This project now includes a contact form that sends messages using the MailerSend email API.

1. Copy `.env.example` to `.env`.
2. Fill the values with your MailerSend data:
   - `MAILERSEND_API_KEY`: tu clave privada de API de MailerSend.
   - `MAILERSEND_FROM_EMAIL`: correo remitente autorizado en MailerSend.
   - `MAILERSEND_TO_EMAIL`: correo donde quieres recibir los mensajes.
   - `MAILERSEND_REPLY_TO_EMAIL` (opcional): correo para respuesta automática, si no existe usa el email del remitente.
3. Ejecuta `npm install` y luego `npm run dev`.
4. Asegúrate de tener activo el dominio o correo remitente en MailerSend.

### Archivo de ejemplo

```env
MAILERSEND_API_KEY=your-mailersend-api-key
MAILERSEND_FROM_EMAIL=webmaster@tudominio.com
MAILERSEND_TO_EMAIL=contacto@qawa.com
MAILERSEND_REPLY_TO_EMAIL=reply@tudominio.com
```

> El formulario envía datos a `/api/contact` y el servidor usa la API de MailerSend para crear el email.
## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

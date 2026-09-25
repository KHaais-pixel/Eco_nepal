# Admin panel

The admin panel lives at **`/admin`**. With it you can:

- **Enquiries**: read messages sent through the contact form, mark them *new / contacted / closed*, and delete them.
- **Products**: edit the name, text, image, applications and specification table of each product.
- **Gallery**: upload photos, retitle or recategorise them, and remove them.
- **Company info**: edit the address, phone numbers, email, website and the chairman's message.

Changes appear on the public website as soon as you save.

## 1. Set up the login

There is a single admin account, configured with three environment variables:

| Variable | What it is |
| --- | --- |
| `ADMIN_EMAIL` | The email address you sign in with. |
| `ADMIN_PASSWORD_HASH` | A hash of the password. The real password is never stored. |
| `SESSION_SECRET` | A random key of at least 32 characters that signs the login cookie. |

To generate the hash and secret, run this on any machine with the project installed:

```bash
npm run admin:hash-password
```

Type the password when prompted; it stays hidden. Then copy the two lines the command prints into the server's environment (see step 2), together with `ADMIN_EMAIL`.

**To change the password later:** run the command again and replace `ADMIN_PASSWORD_HASH`. You can keep the old `SESSION_SECRET` if you like. Changing `SESSION_SECRET` signs out every open session. Restart the app after either change.

If any of the three variables is missing, `/admin/login` shows a "not configured" message and nobody can sign in.

## 2. Deploying on a VPS

```bash
npm ci
npm run build
npm start          # listens on port 3000 (use PORT=xxxx to change it)
```

Put the variables in a `.env.local` file next to `package.json` on the server, or in your process manager's config (systemd `Environment=`, PM2 ecosystem file, etc.):

```ini
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=scrypt:...
SESSION_SECRET=...
DATA_DIR=/var/lib/econepal
```

**Never commit `.env.local` to git.** It is already listed in `.gitignore`.

### Where data is stored: `DATA_DIR`

Everything edited in the admin panel is written to `DATA_DIR`. If it isn't set, the default is the `data/` folder inside the project.

```
DATA_DIR/
  content.json     products, gallery and company info
  enquiries.json   contact-form messages (personal data — keep private)
  uploads/         images uploaded through the admin panel
```

- Point `DATA_DIR` at a folder **outside** the project, such as `/var/lib/econepal`, so a redeploy or a fresh `git clone` never wipes it. The user running the app must be able to write to that folder.
- **Back it up regularly.** A nightly copy is enough, for example `tar czf econepal-$(date +%F).tgz /var/lib/econepal`.
- If `content.json` doesn't exist, the site shows the built-in default content. The first save in the admin panel creates it.

### Reverse proxy (nginx)

Run the app behind nginx with HTTPS. The login cookie is marked `Secure` in production, so login only works over HTTPS. Forward the client IP so the login and contact-form rate limits can tell visitors apart:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 10m;   # image uploads are limited to 8 MB
}
```

Run a **single** instance of the app. Saves are coordinated inside one Node process, and the rate limits are kept in memory.

## Security notes

- Sessions last 8 hours and are held in an `httpOnly` cookie.
- Sign-in is limited to 5 attempts per 15 minutes per IP address.
- Uploads must be real JPEG, PNG or WebP files. The server checks the file contents, not just the file extension. SVG is not accepted.
- All `/admin` pages send `noindex`, so search engines won't list them.

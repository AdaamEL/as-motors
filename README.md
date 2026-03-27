# AS Motors

Plateforme de location de vehicules avec frontend React et backend Node.js/Express.

## Demarrage local

1. Creer vos fichiers d'environnement a partir des exemples.
2. Lancer le backend:

```bash
cd backend
npm install
node app.js
```

3. Lancer le frontend:

```bash
cd frontend
npm install
npm start
```

## Variables d'environnement

Utilisez [\.env.example](.env.example) pour configurer:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `REACT_APP_SITE_URL` (SEO/canonical)
- `REACT_APP_GA_MEASUREMENT_ID` (analytics optionnel)

Ne committez jamais vos fichiers `.env`.

## Production checklist rapide

- Verifier que les pages legales sont a jour.
- Verifier la politique cookies et le consentement analytics.
- Verifier `robots.txt` et `sitemap.xml`.
- Verifier que les secrets ont ete regeneres en cas d'exposition.

# 🔧 Troubleshooting

Encountering an issue? Here are solutions to common problems.

## ❌ Setup & Installation

### Prisma Client Errors
**Error**: `Error: P1001: Can't reach database server` or `Prisma Client has not been initialized`.

**Solution**:
You may need to regenerate the Prisma client.
```bash
npx prisma generate
npx prisma db push
```

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
Another process is using port 3000. Kill it with:
```bash
lsof -ti:3000 | xargs kill
```
Or run on a different port:
```bash
npm run dev -- -p 3001
```

## 🐞 Application Issues

### Google Calendar Sync Failed
**Issue**: Calendar events aren't showing up.

**Checklist**:
1. Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`.
2. Verify the callback URL in Google Cloud Console is exactly: `http://localhost:3000/api/auth/callback/google`
3. Try re-authenticating (Sign out and Sign in).

### "Invalid Date" in Journal
**Issue**: Dates showing as invalid.
- This often happens if the database date format doesn't match the client expectation.
- **Fix**: usually a refresh resolves this, or ensure you are on the latest version of the app.

---

## 📝 Changelog & Versioning

**Current Version**: 1.0.0 (Beta)

### Migration Guide
If you are pulling recent changes, always run:
```bash
npm install
npx prisma migrate dev
```
to ensure your local database schema matches the code.

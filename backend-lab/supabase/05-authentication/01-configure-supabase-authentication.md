# Experiment: Configure Supabase Authentication

**Aim:** Prepare a project so users can register and log in with e-mail and password.

## Steps
1. Dashboard > **Authentication > Providers** -> make sure **Email** is enabled.
2. Under Email provider settings:
   - **Confirm email:** OFF for the lab (users can log in immediately). Turn ON in production.
   - **Minimum password length:** 8 (or more).
   - **Secure password change / Prevent leaked passwords:** optional hardening.
3. **Authentication > URL Configuration**
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** add `http://localhost:3000/**` (used by password-reset and magic-link mails).
4. **Authentication > Email Templates**: customise *Confirm signup*, *Reset password*, *Magic link*.
5. (Optional) **Providers > Google/GitHub**: paste the OAuth client ID and secret from the provider's console.
6. **Authentication > Users**: after sign-up tests, users appear here (you can also *Add user*, *Send password recovery*, *Delete*).
7. Run `00-setup/schema.sql` - it adds a trigger that creates a `profiles` row for every new user.
8. Create the test accounts from `.env.example` (`TEST_EMAIL`, `TEST_EMAIL_2`) by running `02-user-registration.js`.

## Notes
- The built-in mailer is rate-limited (a few e-mails per hour) - configure custom SMTP for heavy testing.
- Passwords are hashed (bcrypt) by Supabase; they are never visible.
- Sessions are JWT access tokens (default 1 hour) plus a refresh token.

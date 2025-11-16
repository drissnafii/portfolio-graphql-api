# Admin User Management

## Creating/Resetting Admin Password

This project includes a script to create or reset the admin user password securely.

### Quick Start

Run the following command to create or update the admin user:

```bash
./create-admin.sh "YourSecurePassword123!"
```

Or using environment variable:

```bash
ADMIN_PASSWORD="YourSecurePassword123!" ./create-admin.sh
```

### Default Credentials (for first login)

After running the script with password `admin123`:

- **Email**: `admin@codefolio.com`
- **Username**: `admin`  
- **Password**: `admin123` (or whatever you set)

### Security Best Practices

1. **Never commit passwords to Git**: The `.env` file is already in `.gitignore`
2. **Change default password immediately** after first login
3. **Use strong passwords**: At least 12 characters with uppercase, lowercase, numbers, and symbols
4. **Keep credentials secure**: Don't share them in chat, documentation, or commit messages

### How It Works

The `create-admin.sh` script:
1. Runs the `create-admin.ts` TypeScript file inside the Docker container
2. Connects to MongoDB using the correct internal Docker network (`db:27017`)
3. Creates a new admin user if none exists, or updates the password if the user already exists
4. Automatically hashes the password using bcrypt before storing

### Environment Variables

You can customize the admin user by setting these environment variables:

- `ADMIN_EMAIL` - Admin email address (default: `admin@codefolio.com`)
- `ADMIN_USERNAME` - Admin username (default: `admin`)
- `ADMIN_PASSWORD` - Admin password (**required**)

### Troubleshooting

**Script won't run?**
```bash
chmod +x create-admin.sh
```

**MongoDB connection error?**
- Ensure Docker containers are running: `docker ps`
- Verify MongoDB is accessible: `docker logs codefolio_db`

**Login still fails?**
- Check that you're using the correct email: `admin@codefolio.com`
- Verify the password matches what you set
- Check the frontend is connecting to the right API URL

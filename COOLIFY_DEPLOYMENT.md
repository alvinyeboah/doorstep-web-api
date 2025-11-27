# Coolify Deployment Guide

This guide outlines the steps to deploy the Doorstep API and Web applications using Coolify.

## Prerequisites

- A Coolify instance set up and running.
- A GitHub repository connected to your Coolify instance.
- A PostgreSQL database (can be provisioned within Coolify).

## 1. Deploying the Backend (API)

1.  **Create a New Service**:
    - Go to your Coolify dashboard.
    - Click "+ New Resource".
    - Select "Application" -> "Public Repository" (or Private if applicable).
    - Enter the repository URL.
    - Select the branch (e.g., `main`).

2.  **Configuration**:
    - **Build Pack**: Select `Dockerfile`.
    - **Base Directory**: Set this to `/` (Root).
    - **Dockerfile Location**: Set this to `/Dockerfile.backend`.
    - **Ports Exposes**: Set to `3000`.

3.  **Environment Variables**:
    - Add the following environment variables:
        - `DATABASE_URL`: Connection string to your PostgreSQL database.
        - `PORT`: `3000` (optional, as it defaults to 3000).
        - Any other variables defined in your `.env` file.

4.  **Deploy**:
    - Click "Deploy".
    - Monitor the deployment logs for any errors.

## 2. Deploying the Frontend (Web)

1.  **Create a New Service**:
    - Click "+ New Resource".
    - Select "Application" -> "Public Repository" (or Private).
    - Enter the repository URL.
    - Select the branch.

2.  **Configuration**:
    - **Build Pack**: Select `Dockerfile`.
    - **Base Directory**: Set this to `/` (Root).
    - **Dockerfile Location**: Set this to `/Dockerfile.frontend`.
    - **Ports Exposes**: Set to `3000`.

3.  **Environment Variables**:
    - Add the following environment variables:
        - `NEXT_PUBLIC_API_URL`: The URL of your deployed Backend service (e.g., `https://api.yourdomain.com`).
        - `NEXTAUTH_URL`: The URL of your deployed Frontend service (e.g., `https://app.yourdomain.com`).
        - `NEXTAUTH_SECRET`: A random string for NextAuth.js.

4.  **Deploy**:
    - Click "Deploy".
    - Monitor the deployment logs.

## 3. Database (PostgreSQL)

If you haven't set up a database yet:
1.  Click "+ New Resource".
2.  Select "Database" -> "PostgreSQL".
3.  Configure the version and credentials.
4.  Use the "Internal Connection URL" for your Backend's `DATABASE_URL` if they are on the same network, or "Public Connection URL" otherwise.

## Troubleshooting

- **Build Failures**: Check the "Build Logs" tab in Coolify. Ensure the Dockerfile paths are correct relative to the root of your repository.
- **Connection Issues**: Ensure the Backend URL is correctly set in the Frontend environment variables. Check CORS settings in the Backend if necessary.

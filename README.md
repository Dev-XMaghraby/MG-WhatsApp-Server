# Maghraby WhatsApp Server

### A WhatsApp server optimized for mobile phones (Android) that allows you to control your WhatsApp account via unofficial client apps.

## Requirements

- Node.js installed
- Any system that supports Node.js (tested on Windows x64 & Linux arm64)

## Installation & Run

It's super easy to install and run. Just download, unzip, and run:

```bash
#!/bin/bash
# Download the latest release
wget <LATEST_RELEASE_URL>

# Unzip the downloaded file
unzip latest.zip

# Run the server using Node.js
node ./dist/index.js
```

## Guide

> This is my first project, so contributions are welcome!

### Build Process

```bash
# Compile TypeScript files
yarn build

# Bundle the application
yarn bundle

# Run tests
yarn test

# Build, bundle, and expose the app
yarn expose

# Build, bundle, copy static files, and start the app
yarn start

# Build and run in development mode
yarn dev

# Copy static files
yarn copy

# Build and bundle the application
yarn compile
```

## API Endpoints

### Authentication

**Login:**

```http
GET /code/{phone_number}
```

### Messaging

**Send a message:**

```http
POST /send/{phone_number}
```

**Request body example:**

```json
{
  "msg": "Example Message"
}
```


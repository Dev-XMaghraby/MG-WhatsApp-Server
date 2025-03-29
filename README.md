# Maghraby WhatsApp Server

### This is a WhatsApp server optimized for mobile phones (Android) that makes you controll your WhatsApp account via unofficial client Apps

## Requirements

* NodeJS installed
* Any system supports nodejs (tested on windows x64 & Linux arm64)

## Installation & Run

It's super easy to install and run you jsut have to download, unzip and run

```bash
!#/bin/bash
# Download latest release
wget ${LATEST RELEASE}
# Unzip
tar -xvf MaghrabyBot.zip
cd MaghrabyBot/
# Run with nodejs
node ./dist/index.js
```

## Guid

> It's my first project so, you are welcome to contribute

### Build

```bash
# Build TypeScript files
yarn build

# Bundle the application
yarn bundle

# Run tests
yarn test

# Build, bundle and expose
yarn expose

# Build, bundle, copy static files and start
yarn start

# Build and run in development mode
yarn dev

# Copy static files
yarn copy

# Build and bundle the application
yarn compile
```

## End-points

`/code/${phone_number}  #GET`

for login

`/send/${phone_number}  #POST`

send messages, body example:

`{"msg": "Example Message"}`


#!/bin/bash

# apt-get update -y && apt-get install -y openssl

npm install

# apt-get install libnss3-dev libgirepository1.0-dev libdbus-1-dev libatk1.0-dev libgtk-3-dev libasound2-dev -y

npx prisma generate

npm run build

npm prune --production

npm run startProd

# npm run dev


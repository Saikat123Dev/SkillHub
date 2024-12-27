# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install necessary build tools and dependencies
RUN apk add --no-cache python3 make g++ git openssl

# Disable telemetry and set the environment to production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install global dependencies
RUN npm install -g prisma

# Install project dependencies
RUN npm install

# Install sharp for optimized image processing
RUN npm install sharp

# Copy the configuration files required for the build
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.js .

# Install TypeScript and Tailwind dependencies for build
RUN npm install --exact --dev typescript
RUN npm install -D tailwindcss postcss autoprefixer

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma/
COPY .env .env
RUN prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

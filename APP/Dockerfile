# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install necessary build tools and dependencies
RUN apk add --no-cache python3 make g++ git openssl

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy package files
COPY package.json ./
COPY package-lock.json ./
# First install prisma CLI globally
RUN npm install -g prisma

# Install dependencies
RUN npm install --legacy-peer-deps

COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.js .

RUN npm install --exact --dev typescript
RUN npm install -D tailwindcss postcss autoprefixer

# Copy prisma schema and generate client
COPY prisma ./prisma/

# Generate Prisma client
RUN prisma generate

# Copy the rest of the application code
COPY . .



# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

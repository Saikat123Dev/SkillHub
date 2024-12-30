FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install eslint eslint-config-next --save-dev

COPY . .

ENV DISABLE_ESLINT_PLUGIN=true

# Disable TypeScript type checking
ENV NEXT_IGNORE_TYPE_CHECK=true
RUN npm install -g prisma
RUN prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

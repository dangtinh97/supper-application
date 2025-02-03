FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
#RUN apk add --no-cache python3 py3-pip && ln -sf /usr/bin/python3 /usr/bin/python
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .

# Expose the application port
EXPOSE 3000
RUN pnpm build
# Start the application
CMD ["pnpm", "start"]

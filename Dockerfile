FROM oven/bun:alpine
WORKDIR /app
COPY package.json ./
RUN bun install
COPY . .
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]

# ---------- 构建阶段 ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
# npm： RUN npm install

COPY . .

# 使用生产环境构建（会自动读取 .env.production）
RUN pnpm build
# npm: RUN npm run build

# ---------- 运行阶段 ----------
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile
# npm: RUN npm install --only=production

# 只拷贝静态资源
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4173

EXPOSE 4173

# 使用 Vite 自带的 preview 静态服务器
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
# npm 时： CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]

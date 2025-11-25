# ---------- 构建阶段 ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 使用国内源，加速依赖安装
RUN npm config set registry https://registry.npmmirror.com \
    && npm install -g pnpm \
    && pnpm config set registry https://registry.npmmirror.com

# 只拷贝 package.json，不拷贝 pnpm-lock.yaml（避免锁到 npmjs 的 URL）
COPY package*.json ./

# 重新解析依赖，走 npmmirror
RUN pnpm install

# 拷贝源码
COPY . .

# 生产构建，生成 dist
RUN pnpm build

# ---------- 运行阶段 ----------
FROM node:20-alpine AS runner

WORKDIR /app

# 同样设置镜像源和 pnpm
RUN npm config set registry https://registry.npmmirror.com \
    && npm install -g pnpm \
    && pnpm config set registry https://registry.npmmirror.com

# 直接复用 builder 阶段的 node_modules 和 package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 再拷贝 dist
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4173

EXPOSE 4173

# 用 Vite 的 preview 来跑静态资源服务
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
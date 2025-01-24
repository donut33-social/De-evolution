FROM node:23.3.0-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    pkg-config \
    python3 \
    make \
    g++ \
    git \
    # canvas 依赖
    libpixman-1-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    build-essential \
    python3-dev \
    librsvg2-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9.15.3

RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY src ./src

RUN pnpm add canvas --ignore-scripts && \
    pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm rebuild canvas
    
RUN pnpm install --frozen-lockfile
RUN pnpm build

RUN mkdir -p /app/dist && \
    chown -R node:node /app && \
    chmod -R 755 /app

USER node

FROM node:23.3.0-slim

# 安装必要的运行时依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    libpixman-1-0 \
    libcairo2 \
    libpango1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 安装 pnpm
RUN npm install -g pnpm@9.15.3

RUN ln -s /usr/bin/python3 /usr/bin/python

COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/src /app/src
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/tsconfig.json /app/
COPY --from=builder /app/pnpm-lock.yaml /app/

WORKDIR /app

EXPOSE 3000
# Dockerfile 예시 (NestJS 프로덕션 빌드용)
# stage 1: 빌드 환경
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# 빌드를 위해 모든 의존성 설치 (dev 포함)
RUN npm install 
COPY . .
# TypeScript 컴파일
RUN npm run build 

# stage 2: 런타임 환경
FROM node:20-alpine

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --omit=dev

# 빌드 스테이지에서 컴파일된 JS 파일 복사
COPY --from=builder /app/dist ./dist

# 환경 변수 (Cloud Run이 PORT를 주입하지만, 명시적으로 설정할 수도 있습니다.)
ENV NODE_ENV production
# Cloud Run은 PORT 환경 변수를 자동으로 주입하므로 여기서는 8080 고정보다는 사용하지 않는 것이 좋습니다.
# ENV PORT 8080

EXPOSE 8080 

CMD [ "node", "dist/main.js" ] 
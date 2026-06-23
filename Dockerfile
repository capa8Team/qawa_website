FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ARG PUBLIC_EMAILJS_SERVICE_ID
ARG PUBLIC_EMAILJS_TEMPLATE_ID
ARG PUBLIC_EMAILJS_PUBLIC_KEY

ENV PUBLIC_EMAILJS_SERVICE_ID=$PUBLIC_EMAILJS_SERVICE_ID
ENV PUBLIC_EMAILJS_TEMPLATE_ID=$PUBLIC_EMAILJS_TEMPLATE_ID
ENV PUBLIC_EMAILJS_PUBLIC_KEY=$PUBLIC_EMAILJS_PUBLIC_KEY

RUN npm run build

FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

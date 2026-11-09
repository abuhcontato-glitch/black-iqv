FROM node:24-alpine
WORKDIR /app
COPY server/onboarding/server.mjs server/onboarding/server.mjs
COPY src/onboarding-app/model.ts src/onboarding-app/model.ts
RUN mkdir /data && chown node:node /data && chmod 700 /data
USER node
ENV PORT=8080 DATA_DIR=/data
EXPOSE 8080
CMD ["node", "server/onboarding/server.mjs"]

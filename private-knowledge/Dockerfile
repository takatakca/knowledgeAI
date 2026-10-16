# Confidential KnowledgeAI service, deliberately SEPARATE from public Vercel.
# Build: docker build -f private-knowledge/Dockerfile private-knowledge
FROM node:22-alpine

ENV NODE_ENV=production PRIVATE_PORT=8301
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
    && npm cache clean --force
COPY --chown=node:node src/ ./src/
USER node:node
EXPOSE 8301
# Health probes use localhost and check the actual private database connection.
# Until protected internal-network binding is explicitly enabled, this container
# will fail closed on the loopback interface (no public/private proxy route).
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:8301/healthz',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node","src/server.cjs"]

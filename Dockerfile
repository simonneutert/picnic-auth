FROM denoland/deno:alpine

WORKDIR /app

COPY LICENSE ./
COPY lib/ ./lib/
COPY deno.json deno.lock server.ts encrypt-password.ts ./

RUN deno install --entrypoint server.ts

CMD ["serve", "--allow-env", "--allow-net", "--parallel", "server.ts"]

FROM rust:1.86-slim

SHELL ["bash", "-c"]

RUN apt-get update && apt-get install -y \
    pkg-config \
    protobuf-compiler \
    clang \
    make \
    jq

RUN cargo install --locked linera-service@0.15.4 linera-storage-service@0.15.4 \
    && rustup target add wasm32-unknown-unknown

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl

# Install Node.js v20 by copying from official image
# This ensures we have the correct version for Next.js 16 and avoids build-time DNS issues with apt repos
COPY --from=node:20-bookworm-slim /usr/local/ /usr/local/

# Install global packages
RUN npm install -g http-server

WORKDIR /build

HEALTHCHECK CMD ["curl", "-s", "http://localhost:3001"]

ENTRYPOINT bash /build/run.bash

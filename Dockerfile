FROM rust:1.86-slim

SHELL ["bash", "-c"]

RUN apt-get update && apt-get install -y \
    pkg-config \
    protobuf-compiler \
    clang \
    make \
    jq \
    curl

# Install Linera tools separately to reduce memory pressure
RUN cargo install --locked linera-storage-service@0.15.6
RUN cargo install --locked linera-service@0.15.6

# Add WASM target for building Linera contracts
RUN rustup target add wasm32-unknown-unknown

# Install Node.js for frontend
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g http-server

WORKDIR /build

HEALTHCHECK CMD ["curl", "-s", "http://localhost:5173"]

ENTRYPOINT bash /build/run.bash

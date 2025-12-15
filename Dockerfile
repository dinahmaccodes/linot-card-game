FROM rust:1.86.0-slim

SHELL ["bash", "-c"]

RUN apt-get update && apt-get install -y \
    pkg-config \
    protobuf-compiler \
    clang \
    make \
    curl

RUN cargo install --locked linera-service@0.15.6 linera-storage-service@0.15.6

# Install Node.js via NVM (template pattern)
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.40.3/install.sh | bash \
    && . ~/.nvm/nvm.sh \
    && nvm install lts/hydrogen \
    && nvm use lts/hydrogen \
    && npm install -g http-server

WORKDIR /build

HEALTHCHECK CMD ["curl", "-s", "http://localhost:5173"]

ENTRYPOINT bash /build/run.bash

UNDERSTANDING VALIDATOR DEPLOYMENT FOR TESTNET

Automatic SSL with Caddy (Recommended)
Starting with the Conway testnet, validators now include Caddy as a built-in web server that automatically handles:

SSL/TLS certificates via Let's Encrypt (ACME protocol)
HTTP/2 and gRPC support out of the box
Automatic HTTPS redirection from port 80 to 443
CORS headers for Web client support
Security headers (HSTS, X-Frame-Options, etc.)
Required ports:

Port 80: HTTP (for ACME challenge and redirect to HTTPS)
Port 443: HTTPS (main validator endpoint)
The deploy script automatically configures Caddy when you provide your email address for Let's Encrypt certificates.


CHECKING INSTALLATION 

Verifying installation
To verify the installation, you can use the linera query-validator command. For example:

$ linera wallet init --faucet https://faucet.testnet-conway.linera.net
$ linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
$ linera query-validator grpcs:my-domain.com:443

RPC API hash: kd/Ru73B4ZZjXYkFqqSzoWzqpWi+NX+8IJLXOODjSko
GraphQL API hash: eZqzuBlLT0bcoQUjOCPf2j22NfZUWG95id4pdlUmhgs
WIT API hash: 4/gsw8G+47OUoEWK6hJRGt9R69RanU/OidmX7OKhqfk
Source code: https://github.com/linera-io/linera-protocol/tree/

0cd20d06af5262540535347d4cc6e5952a921d1a6a7f6dd0982159c9311cfb3e
The last line is the hash of the network's genesis configuration. If this command exits successfully your validator is now operational and ready to be on-boarded.

FIXING PORT ISSUE IF NECESSARY:
Port Conflicts
The validator now uses these ports:

80: HTTP (Caddy for ACME challenge)
443: HTTPS (Caddy reverse proxy)
3000: Grafana dashboard
9090: Prometheus metrics
19100: Internal proxy port (not exposed externally anymore)
If you see port binding errors:

# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services or change ports in docker-compose.yml


Testnet requirements: https://linera.dev/operators/testnets/requirements.html 
Deployment: https://linera.dev/developers/backend/deploy.html 
Check installation: https://linera.dev/operators/testnets/verify-installation.html 
Monitoring: https://linera.dev/operators/testnets/monitoring-logging.html 


I have linera installed 
 linera --version
linera 
Linera protocol: v0.15.8
RPC API hash: K9p3m/MsIPZL32CYddAqlG6PHKprJvMjei5cIiqFgDY
GraphQL API hash: RmwcE5swpH/HkjbetY/YyD6ebNQFS9oeU6ayEAvDjEQ
WIT API hash: 0X+I4jeHCdpD2M0R+OVodI4pH+dF9rt0K/iHENVcnug
Source code: https://github.com/linera-io/linera-protocol/tree/32c047f7891e08503019302b0258c17c2c7c4180


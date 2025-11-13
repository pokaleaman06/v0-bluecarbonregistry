#!/bin/bash

# Blue Carbon Registry Deployment Script
# This script deploys the smart contracts and sets up the environment

set -e

echo "🌊 Blue Carbon Registry Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp env.example .env
    print_warning "Please edit .env file with your configuration before running deployment."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
required_vars=("POLYGON_RPC_URL" "PRIVATE_KEY" "POLYGONSCAN_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_status "Starting deployment process..."

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build shared package
print_status "Building shared package..."
npm run shared:build

# Deploy smart contracts
print_status "Deploying smart contracts..."
cd contracts

# Install contract dependencies
npm install

# Compile contracts
print_status "Compiling smart contracts..."
npm run compile

# Deploy to Polygon (or localhost for testing)
if [ "$NODE_ENV" = "production" ]; then
    print_status "Deploying to Polygon mainnet..."
    npm run deploy:polygon
else
    print_status "Deploying to localhost..."
    npm run deploy:localhost
fi

# Get contract address from deployment
CONTRACT_ADDRESS=$(cat deployment-info.json | grep -o '"contractAddress":"[^"]*"' | cut -d'"' -f4)

if [ -z "$CONTRACT_ADDRESS" ]; then
    print_error "Failed to get contract address from deployment"
    exit 1
fi

print_success "Smart contract deployed at: $CONTRACT_ADDRESS"

# Update environment file with contract address
cd ..
sed -i "s/BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=.*/BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" .env

# Build web application
print_status "Building web application..."
cd apps/web
npm install
npm run build
cd ../..

# Build mobile application (if needed)
if [ "$BUILD_MOBILE" = "true" ]; then
    print_status "Building mobile application..."
    cd apps/mobile
    npm install
    # Note: Mobile builds require Expo CLI and platform-specific setup
    print_warning "Mobile build requires additional setup. Please run 'npm run mobile' manually."
    cd ../..
fi

# Create deployment summary
print_status "Creating deployment summary..."
cat > deployment-summary.md << EOF
# Blue Carbon Registry Deployment Summary

## Deployment Information
- **Date**: $(date)
- **Environment**: ${NODE_ENV:-development}
- **Contract Address**: $CONTRACT_ADDRESS
- **Network**: ${POLYGON_CHAIN_ID:-137}

## Smart Contract Details
- **Contract Name**: BlueCarbonRegistry
- **Deployment Hash**: $(cat contracts/deployment-info.json | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4)
- **Gas Used**: $(cat contracts/deployment-info.json | grep -o '"gasUsed":"[^"]*"' | cut -d'"' -f4)

## Next Steps
1. Update frontend applications with new contract address
2. Verify contract on Polygonscan (if on mainnet)
3. Test all functionality
4. Update documentation

## Environment Variables
Make sure the following are set in your .env file:
- BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
- POLYGON_RPC_URL=$POLYGON_RPC_URL
- POLYGONSCAN_API_KEY=$POLYGONSCAN_API_KEY
EOF

print_success "Deployment completed successfully!"
print_status "Contract Address: $CONTRACT_ADDRESS"
print_status "Deployment summary saved to: deployment-summary.md"

# Verify contract (if on mainnet)
if [ "$NODE_ENV" = "production" ]; then
    print_status "Verifying contract on Polygonscan..."
    cd contracts
    npm run verify $CONTRACT_ADDRESS
    cd ..
fi

print_success "🎉 Blue Carbon Registry is ready for use!"
print_status "Web app: npm run web"
print_status "Mobile app: npm run mobile"
print_status "Admin dashboard: http://localhost:3000/admin"

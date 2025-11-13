#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    log(`Executing: ${command}`, 'blue');
    const result = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
    return result;
  } catch (error) {
    log(`Error executing command: ${command}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function readEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!checkFileExists(envPath)) {
    log('❌ .env file not found. Please create it from env.example', 'red');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  return envVars;
}

function validateEnvironment(envVars) {
  const required = [
    'POLYGON_RPC_URL',
    'PRIVATE_KEY',
    'POLYGONSCAN_API_KEY'
  ];
  
  const missing = required.filter(key => !envVars[key]);
  
  if (missing.length > 0) {
    log(`❌ Missing required environment variables: ${missing.join(', ')}`, 'red');
    process.exit(1);
  }
  
  log('✅ Environment variables validated', 'green');
}

function main() {
  log('🌊 Blue Carbon Registry Deployment Script', 'cyan');
  log('========================================', 'cyan');
  
  // Check if we're in the right directory
  if (!checkFileExists('package.json')) {
    log('❌ Please run this script from the project root directory', 'red');
    process.exit(1);
  }
  
  // Read and validate environment
  log('📋 Reading environment configuration...', 'blue');
  const envVars = readEnvFile();
  validateEnvironment(envVars);
  
  // Install dependencies
  log('📦 Installing dependencies...', 'blue');
  execCommand('npm install');
  
  // Build shared package
  log('🔨 Building shared package...', 'blue');
  execCommand('npm run shared:build');
  
  // Deploy smart contracts
  log('⛓️  Deploying smart contracts...', 'blue');
  process.chdir('contracts');
  
  try {
    execCommand('npm install');
    execCommand('npm run compile');
    
    // Deploy based on environment
    const isProduction = envVars.NODE_ENV === 'production';
    if (isProduction) {
      log('🚀 Deploying to Polygon mainnet...', 'yellow');
      execCommand('npm run deploy:polygon');
    } else {
      log('🏠 Deploying to localhost...', 'yellow');
      execCommand('npm run deploy:localhost');
    }
    
    // Read deployment info
    const deploymentInfoPath = 'deployment-info.json';
    if (checkFileExists(deploymentInfoPath)) {
      const deploymentInfo = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));
      const contractAddress = deploymentInfo.contractAddress;
      
      log(`✅ Smart contract deployed at: ${contractAddress}`, 'green');
      
      // Update .env file with contract address
      process.chdir('..');
      const envPath = '.env';
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update or add contract address
      if (envContent.includes('BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(
          /BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=.*/,
          `BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        envContent += `\nBLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=${contractAddress}`;
      }
      
      fs.writeFileSync(envPath, envContent);
      log('✅ Updated .env file with contract address', 'green');
      
      // Build web application
      log('🌐 Building web application...', 'blue');
      process.chdir('apps/web');
      execCommand('npm install');
      execCommand('npm run build');
      process.chdir('../..');
      
      // Create deployment summary
      const summary = `# Blue Carbon Registry Deployment Summary

## Deployment Information
- **Date**: ${new Date().toISOString()}
- **Environment**: ${envVars.NODE_ENV || 'development'}
- **Contract Address**: ${contractAddress}
- **Network**: ${isProduction ? 'Polygon Mainnet' : 'Localhost'}

## Smart Contract Details
- **Contract Name**: BlueCarbonRegistry
- **Deployment Hash**: ${deploymentInfo.txHash || 'N/A'}
- **Gas Used**: ${deploymentInfo.gasUsed || 'N/A'}

## Next Steps
1. ✅ Contract deployed successfully
2. ✅ Environment variables updated
3. ✅ Web application built
4. 🔄 Test all functionality
5. 🔄 Update documentation

## Access Points
- **Web App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Mobile App**: Run \`npm run mobile\`

## Environment Variables
Make sure the following are set in your .env file:
- BLUE_CARBON_REGISTRY_CONTRACT_ADDRESS=${contractAddress}
- POLYGON_RPC_URL=${envVars.POLYGON_RPC_URL}
- POLYGONSCAN_API_KEY=${envVars.POLYGONSCAN_API_KEY}
`;

      fs.writeFileSync('deployment-summary.md', summary);
      log('✅ Deployment summary saved to deployment-summary.md', 'green');
      
      // Final success message
      log('🎉 Blue Carbon Registry deployed successfully!', 'green');
      log('', 'reset');
      log('📋 Quick Start Commands:', 'cyan');
      log('  npm run web      - Start web application', 'reset');
      log('  npm run mobile   - Start mobile application', 'reset');
      log('  npm run admin    - Access admin dashboard', 'reset');
      log('', 'reset');
      log(`📄 Contract Address: ${contractAddress}`, 'yellow');
      log('📄 Deployment Summary: deployment-summary.md', 'yellow');
      
    } else {
      log('❌ Deployment info file not found', 'red');
      process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Contract deployment failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the deployment
if (require.main === module) {
  main();
}

module.exports = { main };

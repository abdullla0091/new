#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.bright}${colors.magenta}Character AI Clone - Vercel Deployment${colors.reset}\n`);
console.log(`${colors.bright}This script will guide you through deploying the application to Vercel.${colors.reset}\n`);

rl.question(`${colors.yellow}Do you want to proceed with deployment? (y/n) ${colors.reset}`, (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log(`\n${colors.yellow}Deployment cancelled.${colors.reset}`);
    rl.close();
    return;
  }

  try {
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.log(`\n${colors.yellow}Vercel CLI is not installed. Installing now...${colors.reset}`);
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    // Deploy to Vercel (skipping local build, as Vercel will build it)
    console.log(`\n${colors.blue}Deploying to Vercel...${colors.reset}`);
    console.log(`\n${colors.yellow}You may be prompted to log in to Vercel if not already logged in.${colors.reset}`);
    console.log(`${colors.yellow}Follow the instructions in the terminal to complete the setup.${colors.reset}\n`);
    
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log(`\n${colors.green}Deployment completed successfully!${colors.reset}`);
    console.log(`${colors.green}Your application should now be available on Vercel.${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.bright}Error during deployment:${colors.reset}`, error.message);
    console.log(`\n${colors.yellow}For more help, visit: https://vercel.com/docs${colors.reset}\n`);
  }

  rl.close();
}); 
#!/usr/bin/env node
// Script to view Expo/Metro logs

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📱 Trainly Log Viewer\n');
console.log('Checking Expo/Metro status...\n');

// Check if Expo is running
const { execSync } = require('child_process');
try {
  const expoPid = execSync('pgrep -f "expo start" | head -1', { encoding: 'utf-8' }).trim();
  console.log(`✅ Expo is running (PID: ${expoPid})`);
  
  // Try to get some info about what Expo is doing
  console.log('\n📊 Process Info:');
  try {
    const psInfo = execSync(`ps -p ${expoPid} -o pid,pcpu,pmem,etime,command`, { encoding: 'utf-8' });
    console.log(psInfo);
  } catch (e) {
    console.log('Could not get process details');
  }
  
} catch (e) {
  console.log('❌ Expo is not running');
  console.log('Start Expo with: npm start');
  process.exit(1);
}

console.log('\n📝 Application Logs:');
console.log('Application logs appear in:');
console.log('1. Expo terminal (where you ran npm start)');
console.log('2. Device console (if connected)');
console.log('3. Metro bundler output\n');

console.log('🔍 To see real-time logs:');
console.log('- Check the terminal where Expo is running');
console.log('- Look for Metro bundler output');
console.log('- Check for any error messages\n');

console.log('💡 Common log locations:');
console.log('- Expo dev tools: http://localhost:8081');
console.log('- Metro bundler: Check terminal output');
console.log('- Device logs: Use Expo Go app logs\n');

// Check for common issues
console.log('🔧 Checking for common issues...\n');

try {
  // Check if port 8081 is in use (Metro bundler)
  const portCheck = execSync('lsof -ti:8081', { encoding: 'utf-8' }).trim();
  console.log(`✅ Metro bundler port 8081 is active (PID: ${portCheck})`);
} catch (e) {
  console.log('⚠️  Metro bundler port 8081 is not active');
}

try {
  // Check node_modules
  const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
  console.log(`✅ node_modules exists: ${nodeModulesExists}`);
} catch (e) {
  console.log('⚠️  Could not check node_modules');
}

console.log('\n✨ To see detailed logs, check your Expo terminal window!');


#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

const ports = [3000, 3001, 3003];

function killPort(port) {
  return new Promise((resolve) => {
    const isWindows = os.platform() === 'win32';
    
    if (isWindows) {
      // Windows: Find process by port and kill it
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✓ Port ${port} is already free`);
          resolve();
          return;
        }

        const lines = stdout.trim().split('\n');
        const processes = new Set();

        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match) {
            processes.add(match[1]);
          }
        });

        if (processes.size === 0) {
          console.log(`✓ Port ${port} is already free`);
          resolve();
          return;
        }

        let killed = 0;
        processes.forEach(pid => {
          exec(`taskkill /F /PID ${pid}`, (killError) => {
            killed++;
            if (killError) {
              console.log(`⚠ Failed to kill process ${pid} on port ${port}`);
            } else {
              console.log(`✓ Killed process ${pid} on port ${port}`);
            }
            
            if (killed === processes.size) {
              resolve();
            }
          });
        });
      });
    } else {
      // Unix/Linux/macOS: Use lsof and kill
      exec(`lsof -ti:${port}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✓ Port ${port} is already free`);
          resolve();
          return;
        }

        const pids = stdout.trim().split('\n').filter(pid => pid);
        
        if (pids.length === 0) {
          console.log(`✓ Port ${port} is already free`);
          resolve();
          return;
        }

        let killed = 0;
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, (killError) => {
            killed++;
            if (killError) {
              console.log(`⚠ Failed to kill process ${pid} on port ${port}`);
            } else {
              console.log(`✓ Killed process ${pid} on port ${port}`);
            }
            
            if (killed === pids.length) {
              resolve();
            }
          });
        });
      });
    }
  });
}

async function killAllPorts() {
  console.log('🔥 Killing processes on ports:', ports.join(', '));
  console.log('');

  for (const port of ports) {
    await killPort(port);
  }

  console.log('');
  console.log('✅ Done! All specified ports have been checked and cleared.');
}

killAllPorts().catch(console.error);
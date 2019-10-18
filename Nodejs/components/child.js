const { spawn } = require('child_process');

const recommendation = spawn('python3', ['./test.py']);

recommendation.stdout.on('data', (data) => {
   let jsonData = JSON.parse(data)
   console.log(jsonData)
});

recommendation.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

recommendation.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

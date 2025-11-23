const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = function(...args) {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  originalConsoleLog.apply(console, [`[${timestamp}] INFO: ${message}`]);
};

console.error = function(...args) {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  const error = new Error();
  originalConsoleError.apply(console, [`[${timestamp}] ERROR: ${message}\n${error.stack}`]);
};
import express from 'express';
import flowise from './api/flowise.cjs'
import worker from './api/worker.cjs'
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

try {
  // Check for required environment variables
  if (!process.env.FLOWISE_BASE_URL || !process.env.FLOWISE_FLOW_ID) {
    console.error("Error: Missing required environment variables. Please set FLOWISE_BASE_URL and FLOWISE_FLOW_ID in your .env file.");
    process.exit(1);
  }

  const app = express();
  app.use(express.json());
  const port = 3000;

  app.all('/api/flowise', flowise)
  app.all('/api/worker', worker)

  app.listen(port, () => {
    console.log(`Local server listening at http://localhost:${port}`);
  });
}
catch(e) {
  console.error("express js error", e)
}
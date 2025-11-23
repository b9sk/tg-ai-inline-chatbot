import express from 'express';
import flowise from './api/flowise.js'
import worker from './api/worker.js'

try {

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
import express from 'express';
import flowise from './api/flowise.js'
import worker from './api/worker.js'


const app = express();
const port = 3000;

app.get('/api/flowise', flowise)
app.get('/api/worker', worker)

app.listen(port, () => {
  console.log(`Local server listening at http://localhost:${port}`);
});

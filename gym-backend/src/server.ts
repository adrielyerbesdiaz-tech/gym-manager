import express, { Request, Response } from 'express';
import cors from 'cors';
import database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new database('gym.db');

// Test route
app.get('/api/test', (req: Request, res: Response) => {
  const result = db.prepare('SELECT * FROM Clientes').get();
  res.json(result);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
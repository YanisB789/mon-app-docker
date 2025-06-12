const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: 5432,
  database: 'mon_app',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'motdepasse123',
});

app.use(cors());                    
app.use(express.json());           

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Mon backend fonctionne !', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Base de données connectée !', 
      time: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur de connexion à la base de données',
      details: error.message 
    });
  }
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend démarré sur le port ${PORT}`);
});

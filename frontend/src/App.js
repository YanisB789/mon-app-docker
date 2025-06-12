import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Chargement...');
  const [dbTest, setDbTest] = useState('Test en cours...');

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage('Erreur : ' + error.message));

    fetch('http://localhost:5000/api/db-test')
      .then(response => response.json())
      .then(data => setDbTest(data.message))
      .catch(error => setDbTest('Erreur DB : ' + error.message));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Mon Application Docker</h1>
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '15px' }}>
        <h3>Test Backend :</h3>
        <p>{message}</p>
      </div>
      <div style={{ background: '#e8f5e8', padding: '15px' }}>
        <h3>Test Base de Données :</h3>
        <p>{dbTest}</p>
      </div>
    </div>
  );
}

export default App;

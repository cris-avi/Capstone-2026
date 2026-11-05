const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('API de TEA-yudo funcionando y lista para conectarse a PostgreSQL');
});

app.listen(port, () => {
  console.log(`Backend corriendo en el puerto ${port}`);
});
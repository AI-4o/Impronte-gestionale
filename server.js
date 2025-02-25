const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5500;

// Abilita CORS per permettere le richieste dal tuo app Next.js
app.use(cors());

// Servi i file statici dalla cartella public
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
}); 
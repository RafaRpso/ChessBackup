const express = require('express');
const { exec } = require('child_process');
const archiver = require('archiver');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/backup', (req, res) => {
  const nick = req.query.nickname
  const command = `sh ./src/bash/main.sh ${nick} `; 
  console.log(nick)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o comando: ${error}`);
      res.status(500).send('Ocorreu um erro ao gerar o backup.');
      return;
    }
    
    const output = fs.createWriteStream('Chess_Backup.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Nível de compressão máximo
    });

    output.on('close', () => {
      console.log('Backup gerado com sucesso.');
      res.download('Chess_Backup.zip');
    });

    archive.pipe(output);
    archive.directory('Chess_Backup', false);
    archive.finalize();
  });
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});


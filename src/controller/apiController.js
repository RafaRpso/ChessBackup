const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

const cleanBackupDirectory = () => {
  return new Promise((resolve, reject) => {
    const backupPath = './Chess_Backup';
    const zipPath = './Chess_Backup.zip';

    if (fs.existsSync(backupPath)) {
      fs.rm(backupPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(err);
          reject('Failed to remove backup directory.');
        } else {
          console.log('Backup directory removed.');
          resolve();
        }
      });
    } else {
      resolve();
    }

    if (fs.existsSync(zipPath)) {
      fs.rm(zipPath, { force: true }, (err) => {
        if (err) {
          console.error(err);
          reject('Failed to remove zip file.');
        } else {
          console.log('Zip file removed.');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const requestArchives = async (nick) => {
  const request = `https://api.chess.com/pub/player/${nick}/games/archives`;
  const response = await axios.get(request);
  return response.data;
};

const requestGamesForMonth = async (archivesJson) => {
  const archivesArray = archivesJson.archives;
  console.log(archivesArray);
  for (const month of archivesArray) {
    console.log(month);
    await requestMonthGames(month);
  }
};

const requestMonthGames = async (requestUrl) => {
  const response = await axios.get(requestUrl);
  const allGamesMonthArray = response.data.games;
  const arrLength = allGamesMonthArray.length;
  for (let i = 0; i < arrLength; i++) {
    const dateTimestamp = response.data.games[i].end_time;
    if (dateTimestamp !== null) {
      const date = new Date(dateTimestamp * 1000).toISOString();
      const monthYear = new Date(dateTimestamp * 1000)
        .toLocaleString('default', { month: 'short', year: 'numeric' })
        .replace(/\s/g, '_');
      const pgn = response.data.games[i].pgn;
      createDirAndConfigFiles(i, date, pgn, monthYear);
    } else {
      break;
    }
  }
};

const createDirAndConfigFiles = (gameNumber, gameDate, pgn, monthYear) => {
  const filename = `chess_bkp_${gameDate}.txt`;
  if (!fs.existsSync('./Chess_Backup')) {
    fs.mkdirSync('./Chess_Backup');
    createDirAndConfigFiles(gameNumber, gameDate, pgn, monthYear);
  } else {
    createMonthDir(monthYear, pgn, filename);
  }
};

const createMonthDir = (monthYear, pgn, filename) => {
  const pathChess = `./Chess_Backup/${monthYear}`;
  if (fs.existsSync(pathChess)) {
    console.log(`CRIANDO ARQUIVO... ${pathChess}/${filename}`);
    fs.writeFileSync(`${pathChess}/${filename}`, pgn);
  } else {
    fs.mkdirSync(pathChess);
    createMonthDir(monthYear, pgn, filename);
  }
};

const createZipArchive = () => {
  return new Promise((resolve, reject) => {
    exec('zip -r Chess_Backup.zip Chess_Backup', (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        reject('Failed to create zip archive.');
      }
      console.log(stdout);
      console.error(stderr);
      resolve();
    });
  });
};


module.exports = {
  cleanBackupDirectory,
  requestArchives,
  requestGamesForMonth,
  createZipArchive
};

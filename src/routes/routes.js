const express = require('express');
const router = express.Router();
const path = require('path');
const app = express(); 
const { cleanBackupDirectory, requestArchives, requestGamesForMonth, createZipArchive } = require('../controller/apiController');

app.use(cors());

router.use(express.static(path.join(__dirname, '../../public')));

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/backup', async (req, res) => {
  try {
    await cleanBackupDirectory();

    const nickname = req.query.nickname;
    if (!nickname) {
      return res.status(400).send('Please provide a nickname.');
    }

    const archives = await requestArchives(nickname);
    await requestGamesForMonth(archives);

    await createZipArchive();

    res.download('./Chess_Backup.zip');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to generate backup.');
  }
});

module.exports = router;

const express = require('express');
const routes = require('./routes/routes');

const app = express();

app.use(express.json());
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const app = require('./app'); //Import Express app từ file app.js.
const config = require('./app/config');

const PORT = config.app.port; //Lấy port.

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
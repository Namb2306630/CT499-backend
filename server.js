const app = require('./app'); //Import Express app từ file app.js.
const config = require('./app/config');
const MongoDB = require('./app/utils/mongodb.util');

const PORT = config.app.port; //Lấy port.
const MONGODB_URI = config.db.uri; //Lấy URI kết nối MongoDB.

async function startServer() {
  try {
    await MongoDB.connect(MONGODB_URI); 
    console.log('Connected to the database!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Cannot connect to the database:', error);
    process.exit();
  }
}

startServer();
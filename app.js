const express = require('express'); //Import thư viện: express để tạo server
const cors = require('cors'); //Import thư viện: cors để cho phép frontend khác port gọi backend

const contactRouter = require('./app/routes/contact.route'); 

const ApiError = require('./app/api-error'); 

const app = express(); //app chính là server

app.use(cors()); //Cho phép frontend khác port gọi backen
app.use(express.json()); //Cho Express hiểu dữ liệu JSON gửi lên.

app.get('/', (req, res) => {
  res.json({ message: 'Welcomne to contact book application.' });
});

app.use('/api/contacts', contactRouter); //Khi có request đến /api/contacts sẽ được xử lý bởi contactRouter

// Handle 404 route not found
app.use((req, res, next) => {
  return next(new ApiError(404, 'Resource not found'));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
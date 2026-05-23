const express = require('express'); //Import thư viện: express để tạo server
const cors = require('cors'); //Import thư viện: cors để cho phép frontend khác port gọi backend

const contactRouter = require('./app/routes/contact.route'); //Import router contact

const app = express(); //app chính là server

app.use(cors()); //Cho phép frontend khác port gọi backen
app.use(express.json()); //Cho Express hiểu dữ liệu JSON gửi lên.

app.get('/', (req, res) => {
  res.json({ message: 'Welcomne to contact book application.' });
});

app.use('/api/contacts', contactRouter); //Khi có request đến /api/contacts sẽ được xử lý bởi contactRouter

module.exports = app;
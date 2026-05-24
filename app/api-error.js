class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // gọi constructor của lớp cha (Error) để thiết lập message new Error(message)
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ApiError;
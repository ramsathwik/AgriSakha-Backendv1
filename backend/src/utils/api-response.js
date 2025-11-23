class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.success = this.statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
export { ApiResponse };

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    error = [],
    stack = ""
  ) {
    super(message)
    this.statusCode = statusCode,
      this.message = message
    this.data = error
    this.error = error,
      this.success = false
  }

}

export default ApiError
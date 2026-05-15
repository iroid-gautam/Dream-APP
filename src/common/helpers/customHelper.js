class CustomHelper {
  static async success(res, message, data, meta = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data }),
      ...(meta && { meta }),
    });
  }

  static async error(res, message, statusCode = 422) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

export default CustomHelper;

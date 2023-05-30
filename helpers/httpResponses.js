function validationError(res, data) {
  res.status(400).json({
    ok: false,
    error: data.name || "Validation Error",
    data: data.errors || data.message || data,
  });
}

function error(
  res,
  message = "An error while process the request",
  statusCode = 400
) {
  res.status(statusCode).json({
    ok: false,
    error: true,
    message,
    statusCode,
  });
}
function success(
  res,
  data = "The request processed successfuly",
  statusCode = 200
) {
  res.status(statusCode).json({
    ok: true,
    error: false,
    data,
    statusCode,
  });
}

module.exports = {
  validationError,
  success,
  error,
};

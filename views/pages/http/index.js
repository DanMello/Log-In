
exports.http500 = function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('pages/http/500', {
      message: err.message,
      error: err.stack
  })
}
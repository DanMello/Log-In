
exports.errorHandler = function(err, req, res, next) {

  if (err.status === 400) {

  	let page = err.page || '/400'

  	res.render('pages/http' + err.page, {
  		message: err.message,
  		account: req.user.email || {}
  	})
    
  }
  
  if (err.status === 500) {
    res.render('pages/http/500', {
        message: err.message,
        error: err.stack
    })
  }
}

exports.errorHandler = function(err, req, res, next) {

  if (err.status === 400) {

    /* 

      Made this 400 route for more custom errors, this lets me pass in an object with properties for more detail on the error
      
      but if I don't pass an object its fine it will just render whatever the err message is.

      more detail being like the email or something like that, also render custom error pages

    */

  	let page = err.page || '/defaultError'
    let errorObject = err.object

  	res.render('pages/http' + req.filepath + page, errorObject || { message: err.message })
    
  } else {

    res.render('pages/http' + req.filepath + '/defaultError', {
        message: err.message,
        error: err.stack
    })

  }

}
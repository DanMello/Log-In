exports.notOnlyInt = function(value) {

  return /[a-zA-Z]{1,}/.test(value)
}

exports.isName = function (value) {

  return /^[a-zA-Z\s]*$/.test(value)
}
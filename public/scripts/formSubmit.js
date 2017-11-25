let formSubmit = (function () {

  function disable (form) {

    let button = form.querySelector('input[type="submit"]')

    button.disabled = true

    return true

  }

  return {
    disable
  }
  
})();
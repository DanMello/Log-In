let imageFunctions = (function() {
  
  let uploadPhoto = document.querySelectorAll('#profilePicInput, #coverPhotoInput').forEach(input => {

    input.addEventListener('change', handlePicture)
  })

  function handlePicture () {

    let imageFile = this.files[0]
    let cropImageBound = cropImageModule.cropImage.bind(this)
    let parentContainer
    
    cropImageBound().then(results => {

      let imageSrc = results.src
      let relativeUrl = imageSrc.replace(/^(?:\/\/|[^\/]+)*\//, "/")

      results.src = relativeUrl
      results.type = this.dataset.typePicture

      results.submitButton.innerText = ''

      parentContainer = results.parentContainer

      addLoader(results.submitButton, 'Cropping and Saving...', 20, 'ajaxBlue.gif')

      return fetch(window.location.origin + '/account/update/cropAndSave', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(results)
      })

    }).then(response => {

      return response.json()

    }).then(responseJson => {

      parentContainer.parentNode.removeChild(parentContainer)

      responseHandler('mainContainer', responseJson.message, 'green')

    }).catch(err => {

      parentContainer.parentNode.removeChild(parentContainer)

      responseHandler('mainContainer', err.message, 'red')
    })

    this.value = null
  }

  let existingMessages = []

  function responseHandler (parentId, message, color) {

    if (existingMessages.length > 0) {

      existingMessages.forEach(item => item.parentNode.removeChild(item))
      existingMessages = []
    }

    let container = document.querySelector('#' + parentId)
    let messageContainer = document.createElement('span')

    let messageContainerStyles = {
      'color':'white',
      'display':'block',
      'background':color,
      'padding':'3px',
      'width':'100%',
      'text-align':'center'
    }
    
    let messageContainerStyle = messageContainer.style

    for (const prop in messageContainerStyles) {

      messageContainerStyle[prop] = messageContainerStyles[prop]
    }

    messageContainer.innerText = message

    container.insertBefore(messageContainer, container.firstElementChild)

    existingMessages.push(messageContainer)
  }

})()
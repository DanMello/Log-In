let imageFunctions = (function() {

  let uploadPhoto = document.querySelectorAll('#profilePicInput, #coverPhotoInput').forEach(input => {

    input.addEventListener('change', handlePicture)
  })

  function getOrientation (file) {

    return new Promise((resolve, reject) => {

      let reader = new FileReader()

      reader.onload = function (event) {

        let view = new DataView(event.target.result)

        if (view.getUint16(0, false) != 0xFFD8) resolve(-2)

        let length = view.byteLength
        let offset = 2

        while (offset < length) {

          let marker = view.getUint16(offset, false)

          offset += 2

          if (marker == 0xFFE1) {

            if (view.getUint32(offset += 2, false) != 0x45786966) {

              resolve(-1)
            }

            let little = view.getUint16(offset += 6, false) == 0x4949

            offset += view.getUint32(offset + 4, little)

            let tags = view.getUint16(offset, little)

            offset += 2

            for (let i = 0; i < tags; i++) {
              
              if (view.getUint16(offset + (i * 12), little) == 0x0112) {

                resolve(view.getUint16(offset + (i * 12) + 8, little))
              }

            }

          } else if ((marker & 0xFF00) != 0xFF00) {

            break

          } else {

            offset += view.getUint16(offset, false)
          }
        }

        resolve(-1)
      }

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024))

    }).catch(err => {

      throw err
    })

  }

  function resetOrientation (image, srcOrientation) {

    return new Promise((resolve, reject) => {

      let width = image.width
      let height = image.height
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext("2d")
      
      if (4 < srcOrientation && srcOrientation < 9) {

        canvas.width = height
        canvas.height = width

      } else {

        canvas.width = width
        canvas.height = height
      }
    
      switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height , width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

      ctx.drawImage(image, 0, 0)

      resolve(canvas.toDataURL('image/jpeg'))

    }).catch(err => {

      throw err
    })

  }

  function handlePicture () {

    addLoader()

    let imageFile = this.files[0]

    getOrientation(imageFile).then(result => {

      return new Promise((resolve, reject) => {

        let image = new Image()

        image.onload = function () {

          resolve({
            image: image,
            orientation: result
          })
        }

        image.onerror = function (e) {

          reject('Please select an image')
        }

        image.src = URL.createObjectURL(imageFile)

      }).catch(err => {

        throw new Error(err)

      })

    }).then(results => {

      return resetOrientation(results.image, results.orientation)

    }).then(fixedImage => {

      let body = document.body
      let newContainer = document.createElement('div')
      let centerCropContainer = document.createElement('div')
      let headingContainer = document.createElement('div')
      let containerHeading = document.createElement('h1')
      let closeButton = document.createElement('i')
      let hr = document.createElement('hr')
      let pictureContainer = document.createElement('div')
      let previewImage = document.createElement('img')
      let submitButton = document.createElement('span')

      let styleObject = {
        newContainer: {
          'display': 'flex',
          'justify-content': 'center',
          'align-items':'center',
          'width': '100%',
          'height': '100%',
          'background-color': 'rgba(0, 0, 0, 0.5)',
          'position': 'fixed',
          'top': '0',
          'z-index': '998'
        },
        centerCropContainer: {
          'width': this.dataset.bigWidth,
          'height': this.dataset.bigHeight,
          'display': 'flex',
          'flex-direction': 'column',
          'justify-content': 'space-between',
          'align-items': 'center',
          'background': '#f0f3f4',
          'border-radius': '10px',
        },
        headingContainer: {
          'width': '100%',
          'display': 'flex',
          'justify-content':'space-between',
          'align-items':'center',
          'margin-top': '20px',
          'padding-left':'20px',
          'padding-right':'20px'
        },
        containerHeading: {
          'font-size': '23px',
        },
        closeButton: {
          'font-size':'21px',
          'cursor':'pointer'
        },
        hr: {
          'margin-top': '20px',
          'margin-bottom': '20px',
          'display': 'block',
          'height': '1px',
          'border': '0',
          'border-top': '1px solid #ccc',
          'padding': '0', 
          'width': '100%'
        },
        pictureContainer: {
          'height': this.dataset.smallHeight,
          'width': this.dataset.smallWidth,
          'overflow':'hidden',
          'position':'relative',
        },
        previewImage: {
          'width': '100%',
          'position':'absolute',
          'cursor':'pointer',
          'top': '0px'
        },
        submitButton: {
          'display': 'block',
          'background': '#5b88e8',
          'color': 'white',
          'font-size': '20px',
          'border-radius': '5px',
          'padding': '10px',
          'margin-bottom': '20px',
          'margin-right': '20px',
          'cursor': 'pointer',
          'align-self': 'flex-end'
        }
      }

      for (const prop in styleObject) {

        for (const innerProp in styleObject[prop]) {

          switch (prop) {
            case 'newContainer': newContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'centerCropContainer': centerCropContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'headingContainer': headingContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'containerHeading': containerHeading.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'closeButton': closeButton.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'hr': hr.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'pictureContainer': pictureContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'previewImage': previewImage.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'submitButton': submitButton.style[innerProp] = styleObject[prop][innerProp]; break;
          }
        }
      }

      centerCropContainer.dataset.parentName = 'uploadPhotoContainer'
      containerHeading.innerText = this.dataset.heading
      closeButton.className = 'fa fa-times'
      previewImage.src = fixedImage
      submitButton.innerText = 'Submit Photo'
      this.newContainer = newContainer
      this.previewImage = previewImage

      body.appendChild(newContainer)
      newContainer.appendChild(centerCropContainer)
      centerCropContainer.appendChild(pictureContainer)
      centerCropContainer.insertBefore(headingContainer, pictureContainer)
      headingContainer.appendChild(containerHeading)
      headingContainer.appendChild(closeButton)
      centerCropContainer.insertBefore(hr, pictureContainer)
      centerCropContainer.appendChild(hr.cloneNode(true))
      centerCropContainer.appendChild(submitButton)
      pictureContainer.appendChild(previewImage)

      previewImage.addEventListener('mousedown', grabImage)
      previewImage.addEventListener('mousemove', moveImage)
      previewImage.addEventListener('mouseup', dropOrCancel)
      previewImage.addEventListener('mouseout', dropOrCancel)

      closeButton.addEventListener('click', deleteAll.bind(this))
      submitButton.addEventListener('click', cropAndSave.bind(this))

      this.value = null

      removeLoader()

    }).catch(err => {

      this.value = null

      removeLoader()

      responseHandler('mainContainer', err.message, 'red')

      console.log(err)
    })

  }

  let draggableImage = null,
    topInterger = 0,
    imageContainerHeight,
    maxHeight,
    offsetY,
    coordY

  function deleteAll () {

    this.newContainer.parentNode.removeChild(this.newContainer)
  }

  function grabImage (e) {

    e.preventDefault()

    draggableImage = true
    coordY = parseInt(this.style.top)
    offsetY = e.clientY
    imageContainerHeight = parseInt(this.parentElement.style.height, 10)
    maxHeight = this.height - 400
  }

  function moveImage (e) {

    e.preventDefault()

    if (!!draggableImage) {

      topInterger = parseInt(coordY + e.clientY - offsetY, 10)
      
      let value = Math.abs(topInterger)
      let bottomIteger = imageContainerHeight + value

      if (topInterger > 0 || (bottomIteger > this.height)) {

        if (topInterger > 0) { topInterger = 0 }
        else if (value > maxHeight) { topInterger = -Math.abs(maxHeight) }

        draggableImage = null

        return

      } else {

        this.style.top = coordY + e.clientY - offsetY + 'px'
      }
    }
  }

  function dropOrCancel (e) {

    e.preventDefault()

    draggableImage = null
  }

  function cropAndSave () {

    return new Promise((resolve, reject) => {

      addLoader()

      let croppedImage = this.previewImage
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext("2d")

      canvas.width = parseInt(this.dataset.smallWidth, 10)
      canvas.height = parseInt(this.dataset.smallHeight, 10)
    
      ctx.drawImage(croppedImage, 0, topInterger, croppedImage.width, croppedImage.height)

      resolve(canvas.toDataURL('image/jpeg'))
      
    }).then(finalImage => {

      return fetch('http://localhost/account/update/uploadPhoto', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          imagebase64: finalImage,
          type: this.dataset.typePicture
        })
      })

    }).then(results => {

      return results.json()

    }).then(resultsJson => {

      if (resultsJson.error) throw new Error(resultsJson.message)

      this.newContainer.parentNode.removeChild(this.newContainer)

      removeLoader()

      responseHandler('mainContainer', resultsJson.message, 'green')

    }).catch(err => {

      this.newContainer.parentNode.removeChild(this.newContainer)

      removeLoader()

      responseHandler('mainContainer', err.message, 'red')

      console.log(err)
    })
    
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
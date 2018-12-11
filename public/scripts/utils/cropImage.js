let cropImageModule = (function() {

  let containerState = {
    containerWidth: null,
    containerHeight: null,
    imageContainerHeight: null,
    imageContainerWidth: null,
    top: 0,
    left: 0,
    offsetY: null,
    offsetX: null,
    coordinateY: null, 
    coordinateX: null,
    draggable: null,
    loading: false,
    image: null,
    promiseResolve: null,
    parentContainer: null
  }

  function cropImage () {

    return new Promise((resolve, reject) => {

      let body = document.body
      let darkBackground = document.createElement('div')
      let mainContainer = document.createElement('div')
      let topContainer = document.createElement('div')
      let heading = document.createElement('h1')
      let closeButton = document.createElement('i')
      let hr = document.createElement('hr')
      let cropContainer = document.createElement('div')
      let image = document.createElement('img')
      let bottomContainer = document.createElement('div')
      let sliderContainer = document.createElement('div')
      let sliderInput = document.createElement('input')
      let submitButton = document.createElement('span')

      if (this.tagName === 'IMG') {

        image.src = this.src

        if (this.width > this.height) {
          //Landscape
          containerState.containerWidth = 900
          containerState.containerHeight = 600
          containerState.imageContainerWidth = 900
          containerState.imageContainerHeight = 300

        } else {
          //Portrait
          containerState.containerWidth = 500
          containerState.containerHeight = 600
          containerState.imageContainerWidth = 400
          containerState.imageContainerHeight = 400
        }

      } else if (this.tagName === 'INPUT') {

        containerState.containerWidth = parseInt(this.dataset.bigWidth)
        containerState.containerHeight = parseInt(this.dataset.bigHeight)
        containerState.imageContainerWidth = parseInt(this.dataset.smallWidth)
        containerState.imageContainerHeight = parseInt(this.dataset.smallHeight)

        sliderInput.disabled = true
        sliderInput.style.opacity = '.5'
        closeButton.style.opacity = '.5'
        submitButton.style.opacity = '.5'

        let formData = new FormData()

        formData.append(this.files[0].name, this.files[0])
        formData.append('type', this.dataset.typePicture)

        addLoader(cropContainer, 'Uploading picture...', 20, 'ajaxDefault.gif')

        containerState.loading = true

        fetch(window.location.origin + '/account/update/uploadTmpPicture', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: formData
        }).then(result => {

          return result.json()

        }).then(result => {

          image.src = result.tmpPath

          containerState.loading = false
          sliderInput.disabled = false
          sliderInput.style.opacity = '1'
          closeButton.style.opacity = '1'
          submitButton.style.opacity = '1'

        }).catch(err => {

          reject(err)
        })
      }

      let styleObject = {
        darkBackground: {
          'display': 'flex',
          'justify-content': 'center',
          'align-items':'center',
          'width': '100%',
          'height': '100%',
          'background-color': 'rgba(0, 0, 0, 0.5)',
          'position': 'fixed',
          'top': '0',
          'z-index': '999'
        },
        mainContainer: {
          'width': containerState.containerWidth + 'px',
          'height': containerState.containerHeight + 'px',
          'display': 'flex',
          'flex-direction': 'column',
          'justify-content': 'space-between',
          'align-items': 'center',
          'background': '#f0f3f4',
          'border-radius': '10px',
        },
        topContainer: {
          'width': '100%',
          'display': 'flex',
          'justify-content':'space-between',
          'align-items':'center',
          'margin-top': '20px',
          'padding-left':'20px',
          'padding-right':'20px' 
        },
        heading: {
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
        cropContainer: {
          'height': containerState.imageContainerHeight + 'px',
          'width': containerState.imageContainerWidth + 'px',
          'overflow':'hidden',
          'position':'relative'
        },
        image: {
          'width': '100%',
          'position':'absolute',
          'cursor':'pointer',
          'top': '0px',
          'left': '0px'
        },
        bottomContainer: {
          'display': 'flex',
          'width': '100%',
          'height': '50px',
          'justify-content': 'space-between',
          'align-items': 'center',
          'margin-bottom': '20px',
          'padding-left': '10px',
          'padding-right': '10px'
        },
        submitButton: {
          'display': 'block',
          'background': '#5b88e8',
          'color': 'white',
          'font-size': '20px',
          'border-radius': '5px',
          'padding': '10px',
          'cursor': 'pointer',
        }
      }

      for (const prop in styleObject) {

        for (const innerProp in styleObject[prop]) {

          switch (prop) {
            case 'darkBackground': darkBackground.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'mainContainer': mainContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'topContainer': topContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'heading': heading.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'closeButton': closeButton.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'hr': hr.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'cropContainer': cropContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'image': image.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'bottomContainer': bottomContainer.style[innerProp] = styleObject[prop][innerProp]; break;
            case 'submitButton': submitButton.style[innerProp] = styleObject[prop][innerProp]; break;
          }
        }
      }

      heading.innerText = "Let's crop your picture!"
      closeButton.className = 'fa fa-times'
      sliderInput.type = 'range'
      sliderInput.min = '1'
      sliderInput.max = '2'
      sliderInput.value = '1'
      sliderInput.step = '0.01'
      submitButton.innerText = 'Crop picture'

      body.appendChild(darkBackground)
      darkBackground.appendChild(mainContainer)
      mainContainer.appendChild(cropContainer)
      mainContainer.insertBefore(topContainer, cropContainer)
      topContainer.appendChild(heading)
      topContainer.appendChild(closeButton)
      mainContainer.insertBefore(hr, cropContainer)
      cropContainer.appendChild(image)
      mainContainer.appendChild(hr.cloneNode(true))
      mainContainer.appendChild(bottomContainer)
      bottomContainer.appendChild(sliderContainer)
      sliderContainer.appendChild(sliderInput)
      bottomContainer.appendChild(submitButton)

      sliderInput.addEventListener('input', scalePicture)
      image.addEventListener('mousedown', grabImage)
      image.addEventListener('mousemove', moveImage)
      image.addEventListener('mouseup', dropOrCancel)
      image.addEventListener('mouseout', dropOrCancel)
      closeButton.addEventListener('click', deleteAll)
      submitButton.addEventListener('click', cropAndSave)

      containerState.image = image
      containerState.submitButton = submitButton
      containerState.parentContainer = darkBackground
      containerState.promiseResolve = resolve

    }).catch(err => {

      deleteAll()

      throw err
    })
  }

  function scalePicture (e) {

    if (containerState.loading) return

    let scale = parseFloat(e.target.value)
    let imageWidth = parseInt(containerState.imageContainerWidth, 10)
    let imageHeight = parseInt(containerState.imageContainerHeight, 10)

    containerState.image.style.width = imageWidth * scale + 'px'
    containerState.image.style.height = 'auto'

    if ((parseInt(containerState.image.style.top, 10) + containerState.image.height) < imageHeight) {

      let overflowY = imageHeight - (parseInt(containerState.image.style.top, 10) + containerState.image.height)
      let overflowYCalculation = overflowY + parseInt(containerState.image.style.top, 10)

      containerState.image.style.top = overflowYCalculation + 'px'
    }

    if ((parseInt(containerState.image.style.left, 10) + containerState.image.width) < imageWidth) {

      let overflowX = imageWidth - (parseInt(containerState.image.style.left, 10) + containerState.image.width)
      let overflowXCalculation = overflowX + parseInt(containerState.image.style.left, 10)

      containerState.image.style.left = overflowXCalculation + 'px'
    }
  }

  function grabImage (e) {

    e.preventDefault()

    containerState.draggable = true

    //Top
    containerState.coordinateY = parseInt(this.style.top)
    containerState.offsetY = e.clientY

    //Left
    containerState.coordinateX = parseInt(this.style.left)
    containerState.offsetX = e.clientX
  }

  function moveImage (e) {

    e.preventDefault()

    if (!!containerState.draggable) {

      containerState.top = containerState.coordinateY + e.clientY - containerState.offsetY
      containerState.left = containerState.coordinateX + e.clientX - containerState.offsetX
      
      //Position greater than width or height
      let absoluteTop = Math.abs(containerState.top)
      let absoluteLeft = Math.abs(containerState.left)

      let positionFromBottom = containerState.imageContainerHeight + absoluteTop
      let positionFromRight = containerState.imageContainerWidth + absoluteLeft

      if (containerState.left < 0 && positionFromRight < this.width) {

        this.style.left = containerState.left + 'px'
      }

      if (containerState.top < 0 && positionFromBottom < this.height) {

        this.style.top = containerState.top + 'px'
      }
    }
  }

  function dropOrCancel (e) {

    e.preventDefault()

    containerState.draggable = false
  }

  function deleteAll () {

    if (containerState.loading) return

    containerState.parentContainer.parentNode.removeChild(containerState.parentContainer)
  }

  function cropAndSave () {

    if (containerState.loading) return

    containerState.promiseResolve({
      src: containerState.image.src,
      top: containerState.image.style.top,
      left: containerState.image.style.left,
      containerWidth: containerState.imageContainerWidth,
      containerHeight: containerState.imageContainerHeight,
      width: containerState.image.width,
      height: containerState.image.height,
      parentContainer: containerState.parentContainer,
      submitButton: containerState.submitButton
    })
  }

  return {
    cropImage
  }

})()

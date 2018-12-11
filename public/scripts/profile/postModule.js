let postModule = (function() {

  // Module state
  let loading = false
  let activeLiItems = []
  let activeLiInstructions = []
  let activeLiEvents = []
  let postsForm = document.querySelector('#postModuleForm')
  let picturesAndVideosPreview = []
  let picturesAndVideos
  let previewFiles = 0
  let seeMoreActive = false
  let containsType = {
    image: false,
    video: false,
    imageLiItems: [],
    videoLiItems: []
  }

  let textAreaforPosts = postsForm.querySelector('#postArea')

  let resizeTextArea = function () {

    this.style.height = this.scrollHeight + 'px'
  }

  textAreaforPosts.addEventListener('input', resizeTextArea)
  textAreaforPosts.addEventListener('change', resizeTextArea)

  let uploadPhoto = postsForm.querySelectorAll('#postPictureInput, #postVideoInput').forEach(input => {

    input.addEventListener('change', handleUpload)
  })

  function handleUpload () {

    loading = true

    let formData = new FormData()

    let parentElementReference = this.parentElement
    let newContainer = document.createElement('div')
    let topContainer = document.createElement('div')
    let heading = document.createElement('h1')
    let subContainer = document.createElement('div')
    let imageContainer = document.createElement('div')
    let editContainer = document.createElement('div')
    let editUl = document.createElement('ul')
    let closeButton = document.createElement('i')
    let editLi = [
      { message: 'Remove a picture or video', functionName: removePost, icon: 'fa fa-times', type: 'both' },
      { message: 'Add more pictures or videos', functionName: addmorePosts, icon: 'fa fa-plus', input: true, type: 'both' },
      { message: 'Crop picture', functionName: cropPicture, icon: 'fa fa-crop', type: 'image' },
      { message: 'Trim video', functionName: trimVideo, icon: 'fa fa-compress', type: 'video' },
      { message: 'Larger view', functionName: largerView, icon: 'fa fa-table', type: 'both' }
    ]

    let stylesObject = {
      newContainer: {
        'display': 'flex',
        'flex-direction':'column',
        'margin-top':'10px',
        'margin-bottom':'20px',
        'border-top':'1px solid #ccc',
        'padding-top':'20px'
      },
      topContainer: {
        'width': '100%',
        'display': 'flex',
        'justify-content':'space-between',
        'align-items':'center',
        'padding-left':'20px',
        'padding-right':'20px'
      },
      subContainer: {
        'display':'flex',
        'margin-top':'20px',
        'margin-left':'20px',
        'margin-right':'20px'
      },
      imageContainer: {
        'display':'flex',
        'width':'60%',
        'height':'200px',
        'margin-right':'20px',
        'overflow-x':'scroll',
        'border':'1px solid #ccc',
        'padding': '5px 0px 0px 5px'
      },
      editContainer: {
        'flex-basis':'50%'
      },
      editUl: {
        'list-style-type':'none',
      },
      closeButton: {
        'font-size':'21px',
        'opacity':'.5'
      }
    }

    for (const prop in stylesObject) {

      for (const innerProp in stylesObject[prop]) {

        switch (prop) {
          case 'newContainer': newContainer.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'topContainer': topContainer.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'heading': heading.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'subContainer': subContainer.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'imageContainer': imageContainer.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'editContainer': editContainer.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'editUl': editUl.style[innerProp] = stylesObject[prop][innerProp]; break;
          case 'closeButton': closeButton.style[innerProp] = stylesObject[prop][innerProp]; break;
        }
      }
    }

    while (parentElementReference.tagName !== 'FORM') {

      if (parentElementReference.id === 'uploadIconParent') {

        parentElementReference.style.opacity = '.5'
        
        parentElementReference.querySelectorAll('i').forEach(icon => {

          icon.style.cursor = 'default'
        })

        parentElementReference.querySelectorAll('input').forEach(input => {

          input.disabled = true
        })
      }

      parentElementReference = parentElementReference.parentElement
    }

    parentElementReference.insertBefore(newContainer, parentElementReference.lastElementChild)
    newContainer.appendChild(topContainer)
    topContainer.appendChild(heading)
    topContainer.appendChild(closeButton)
    newContainer.appendChild(subContainer)
    subContainer.appendChild(imageContainer)
    subContainer.appendChild(editContainer)
    editContainer.appendChild(editUl)

    editLi.map(item => {

      if (!!item.input) {

        let label = document.createElement('label')
        let icon = document.createElement('i')
        let input = document.createElement('input')

        label.style.padding = '5px'
        label.style.color = '#3366FF'
        label.style.opacity = '.5'
        label.style['font-size'] = '18px'

        label.className = 'editliItems'
        label.innerText = item.message

        icon.style['margin-right'] = '5px'

        icon.className = item.icon

        input.type = 'file'
        input.accept ='image/*, .mp4, .mov'
        input.multiple = true

        input.style.opacity = '0.0001'
        input.style.position = 'absolute'
        input.style.cursor = 'pointer'

        input.addEventListener('change', item.functionName.bind(this))
        input.addEventListener('click', activeLiItem)

        editUl.appendChild(label)
        label.appendChild(input)
        label.insertBefore(icon, label.firstChild)

      } else {

        let li = document.createElement('li')
        let icon = document.createElement('i')

        li.style.padding = '5px'
        li.style.color = '#3366FF'
        li.style.opacity = '.5'
        li.style['font-size'] = '18px'

        li.classList.add('editliItems')
        li.innerText = item.message

        icon.style['margin-right'] = '5px'

        icon.className = item.icon

        if (item.type === 'image') containsType.imageLiItems.push(li)
        if (item.type === 'video') containsType.videoLiItems.push(li)

        li.addEventListener('click', item.functionName.bind(this))
        li.addEventListener('click', activeLiItem)

        editUl.appendChild(li)
        li.insertBefore(icon, li.firstChild)        
      }
    })

    this.newContainer = newContainer
    this.topContainer = topContainer
    this.imageContainer = imageContainer

    newContainer.id = 'postModuleParent'
    imageContainer.id = 'filesPreviewContainer'
    closeButton.className = 'fa fa-times'
    closeButton.addEventListener('click', destroyPostsEditor.bind(this))

    Array.from(this.files).forEach((file, i) => {

      let index = i + 1

      if (index <= 5) {

        picturesAndVideosPreview.push(file)

        reusable.createElementPreview(file, imageContainer)
      }

      formData.append(file.name, file)
    })

    addLoader(newContainer, 'Uploading files...', 20, 'ajaxDefault.gif')

    fetch(window.location.origin + '/account/update/uploadPicsOrVids', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: formData
    }).then(result => {

      return result.json()

    }).then(resultJson => {

      if (resultJson.error) {

        throw resultJson.message

      } else {

        picturesAndVideos = resultJson.files

        let heading = newContainer.querySelector('h1')
        let liItems = newContainer.querySelectorAll('.editliItems')
        let closeButton = newContainer.querySelector('.fa-times')
        let length = resultJson.files.length

        for (i = 0; i < length; i++) {

          let index = i + 1

          if (index <= 5) {

            previewFiles++

            reusable.appendFile(resultJson.files[i], imageContainer)

          } else {

            reusable.seeMore(imageContainer)

            break
          }
        }

        newContainer.style.opacity = '1'
        
        heading.innerText = "Let's have a look!"

        liItems.forEach(item => {

          item.style.cursor = 'pointer'
          item.style.opacity = '1'
        })

        closeButton.style.opacity = '1'
        closeButton.style.cursor = 'pointer'
      }

      loading = false

      removeLoader()

    }).catch(err => {

      handlePostError(err, newContainer)
    })

    this.value = null
  }

  function activeLiItem (e) {

    if (loading) return false

    if (this.classList.contains('disabled')) return false

    if (this.tagName === 'INPUT') {

      if (activeLiInstructions.length > 0) {

        activeLiInstructions[0].parentElement.removeChild(activeLiInstructions[0])

        activeLiInstructions.pop()
      }

      if (activeLiEvents.length > 0) {

        activeLiEvents.forEach(obj => {

          obj.item.removeEventListener(obj.type, obj.functionName)
        })

        activeLiEvents = []
      }
    }

    if (activeLiItems.length > 0) {

      if (activeLiItems[0] === this) {

        return false

      } else {

        activeLiItems[0].style.color = 'rgb(51, 102, 255)'
        activeLiItems[0].style['text-decoration'] = 'none'
        activeLiItems[0].style['font-size'] = '18px'

        activeLiItems.pop()
      }
    }

    this.style.color = 'purple'
    this.style['text-decoration'] = 'underline'
    this.style['font-size'] = '20px'

    activeLiItems.push(this)
  }

  function removePost () {

    if (loading) return false

    let instructions

    function removeThis () {

      picturesAndVideosPreview.forEach((file, i) => {

        if (file.name === this.dataset.oldName) picturesAndVideosPreview.splice(i, 1)
      })

      picturesAndVideos.forEach((file, i) => {

        if (file.newName === this.alt || file.newName === this.dataset.videoName) picturesAndVideos.splice(i, 1)
      })

      parent = this.parentElement

      while (parent.id !== 'filesPreviewContainer') {

        parent = parent.parentElement
      }

      parent.removeChild(this.parentElement)

      previewFiles--

      if (picturesAndVideos.length >= 5) {

        let files = parent.querySelectorAll('img, video')
        let filesMapped = Array.from(files).map(x => x.alt || x.dataset.videoName)
        let extrafileName = picturesAndVideos.map(x => x.newName).find(x => !filesMapped.includes(x))
        let extrafile = picturesAndVideos.reduce((newFile, currentFile) => {
          
          if (currentFile.newName === extrafileName) newFile = currentFile

          return newFile
        }, {})

        reusable.createElementPreview(extrafile, parent)
        reusable.appendFile(extrafile, parent)
      }

      let length = picturesAndVideos.length
      let imageContainer = parent

      events.emit('filesUpdated', { length, imageContainer, instructions })
    }

    instructions = {
      instructionsFunction: reusable.createInstructions.bind(this),
      functionEvents: [
        {type: 'mouseover', functionName: reusable.hoverTarget},
        {type: 'click', functionName: removeThis},
        {type: 'mouseout', functionName: reusable.removeHover}
      ],
      function: 'removePicOrVideo',
      message: 'Click on the images or videos you would like to delete.', 
      for: 'both'
    }

    instructions.instructionsFunction(
      instructions.function, 
      instructions.message, 
      instructions.for,
      instructions.functionEvents, false)
  }

  function addmorePosts (e) {

    if (loading) return false

    let files = e.target.files
    let formData = new FormData()

    Array.from(files).forEach(file => {

      formData.append(file.name, file)
    })

    reusable.checkfilesPreview(files, this.imageContainer)

    addLoader(this.newContainer, 'Uploading files...', 20, 'ajaxDefault.gif')

    loading = true

    fetch(window.location.origin + '/account/update/uploadPicsOrVids', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: formData
    }).then(result => {

      return result.json()

    }).then(resultJson => {

      if (resultJson.error) {

        throw resultJson.message

      } else {

        resultJson.files.forEach(file => {

          picturesAndVideos.push(file)
        })

        let length = picturesAndVideos.length
        let imageContainer = this.imageContainer
        let files = resultJson.files

        events.emit('filesUpdated', { length, imageContainer, files })
      }

      loading = false

      removeLoader()

    }).catch(err => {

      console.log(err)

      handlePostError(err, this.newContainer)
    })

    e.target.value = null
  }

  function cropPicture () {

    if (loading || !containsType.image) return false

    let cropPictureFunction = function () {

      let cropImageBound = cropImageModule.cropImage.bind(this)
      let parentContainer
      
      cropImageBound().then(results => {

        let imageSrc = results.src
        let relativeUrl = imageSrc.replace(/^(?:\/\/|[^\/]+)*\//, "/")

        results.src = relativeUrl

        results.submitButton.innerText = ''

        parentContainer = results.parentContainer

        addLoader(results.submitButton, 'Cropping Image...', 20, 'ajaxBlue.gif')

        return fetch(window.location.origin + '/account/update/cropAndReturn', {
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

        this.src = responseJson.src
      })
    }

    let instuctions = reusable.createInstructions.bind(this)
    let functionEvents = [
      {type: 'mouseover', functionName: reusable.hoverTarget},
      {type: 'click', functionName: cropPictureFunction},
      {type: 'mouseout', functionName: reusable.removeHover}
    ]

    instuctions(
      'cropPicture',
      'Click on an image you would like to crop.',
      'img',
      functionEvents)
  }

  function trimVideo () {

    if (loading || !containsType.video) return false

    let trimVideoFunction = function () {

      console.log('rannn')

      let trimVideoBound = trimVideoModule.trimVideo.bind(this)

      trimVideoBound()
    }

    let instuctions = reusable.createInstructions.bind(this)
    let functionEvents = [
      {type: 'mouseover', functionName: reusable.hoverTarget},
      {type: 'click', functionName: trimVideoFunction},
      {type: 'mouseout', functionName: reusable.removeHover}
    ]

    instuctions(
      'trimVideo',
      'Click on the video you would like to trim.',
      'video',
      functionEvents)
  }

  function largerView () { 
  }

  function handlePostError (err, postsContainer) {

    let newError = document.createElement('span')
    let parentElement = postsContainer.parentElement

    newError.innerText = err
    newError.style.color = 'white'
    newError.style.padding = '2px'
    newError.style.background = 'red'
    newError.style['text-align'] = 'center'

    this.newContainer = postsContainer

    loading = false

    removeLoader()
    
    destroyPostsEditor.bind(this)()

    parentElement.insertBefore(newError, parentElement.lastElementChild)
  }

  function destroyPostsEditor () {

    if (!loading) {

      let iconParent = this.newContainer.parentElement.querySelector('#uploadIconParent')

      this.newContainer.parentNode.removeChild(this.newContainer)

      iconParent.style.opacity = '1'

      iconParent.querySelectorAll('i').forEach(icon => {

        icon.style.cursor = 'pointer'
      })

      iconParent.querySelectorAll('input').forEach(input => {

        input.disabled = false
      })
    }
  }

  let reusable = {
    hoverTarget: function () {
      this.style.opacity = '.5'
      this.style.cursor = 'default'
    },
    removeHover: function () {
      this.style.opacity = '1'
    },
    createElementPreview: function (file, imageContainer) {

      let elementContainer = document.createElement('div')
      let element

      if (file.type.includes('video/') || file.type === 'video') {

        let alt = document.createElement('span')

        element = document.createElement('video')
        element.autoplay = true
        element.muted = true
        element.loop = true
        element.dataset.videoName = file.name

        alt.innerText = file.name
        alt.style.border = '1px solid #ccc'
        alt.style.display = 'block'

        alt.className = 'videoAlt'

        elementContainer.appendChild(alt)

      } else if (file.type.includes('image/') || file.type === 'image') {

        element = document.createElement('img')
        element.alt = file.name
      }

      elementContainer.style.height = '98%'
      elementContainer.style['margin-right'] = '5px'

      element.style.height = '100%'

      if (!!seeMoreActive) {

        imageContainer.insertBefore(elementContainer, imageContainer.lastElementChild)

      } else {

        imageContainer.appendChild(elementContainer)
      }

      elementContainer.appendChild(element)
    },
    appendFile: function (file, imageContainer) {

      if (file.type === 'image') {
        
        let imageElement = imageContainer.querySelector(`img[alt='${file.name}']`)

        imageElement.dataset.oldName = imageElement.alt
        imageElement.src = file.publicPath
        imageElement.alt = file.newName
      }

      if (file.type === 'video') {

        let videoElement = imageContainer.querySelector(`[data-video-name='${file.name}']`)
        let source = document.createElement('source')
        let alt = videoElement.parentElement.firstElementChild
        
        source.type = 'video/mp4'
        source.src = file.publicPath

        videoElement.appendChild(source)
        videoElement.dataset.oldName = videoElement.dataset.videoName
        videoElement.dataset.videoName = file.newName

        alt.parentElement.removeChild(alt)
      }

      reusable.checkIfThereisImgsorvideos(imageContainer)
    },
    createInstructions: function (id, message, type, events, reset) {

      let instuctionsExist = false

      if (type === 'both') type = 'img, video'

      if (activeLiInstructions.length > 0) {

        if (activeLiInstructions[0].id === id && !reset) {

          return false

        } else {

          activeLiInstructions[0].parentElement.removeChild(activeLiInstructions[0])

          activeLiInstructions.pop()

          activeLiEvents.forEach(obj => {

            obj.item.removeEventListener(obj.type, obj.functionName)
          })

          activeLiEvents = []
        }
      }

      let instructionsContainer = document.createElement('div')
      let instructions = document.createElement('span')
      let cancelButton = document.createElement('span')
      
      instructionsContainer.id = id
      instructionsContainer.style['padding-left'] = '20px'  
      instructionsContainer.style['padding-right'] = '20px'
      instructionsContainer.style['margin-top'] = '5px'

      instructions.innerText = message
      instructions.style['margin-right'] = '5px'

      cancelButton.innerText = 'Click here to cancel'
      cancelButton.style.color = 'blue'
      cancelButton.style.cursor = 'pointer'
      cancelButton.style.display = 'inline-block'

      this.newContainer.insertBefore(instructionsContainer, this.topContainer.nextElementSibling)
      instructionsContainer.appendChild(instructions)
      instructionsContainer.appendChild(cancelButton)

      this.imageContainer.querySelectorAll(type).forEach(item => {

        events.forEach(event => {

          let eventsObj = {
            item: item,
            type: event.type,
            functionName: event.functionName
          }

          activeLiEvents.push(eventsObj)

          item.addEventListener(event.type, event.functionName)
        })
      })

      cancelButton.addEventListener('click', function() {

        instructionsContainer.parentNode.removeChild(instructionsContainer)

        activeLiItems[0].style.color = '#3366FF'
        activeLiItems[0].style['text-decoration'] = 'none'
        activeLiItems[0].style['font-size'] = '18px'

        activeLiItems.pop()
        activeLiInstructions.pop()

        activeLiEvents = []

        this.imageContainer.querySelectorAll(type).forEach(item => {

          item.style.cursor = 'initial'

          events.forEach(event => {

            item.removeEventListener(event.type, event.functionName)
          })
        })
      }.bind(this))

      activeLiInstructions.push(instructionsContainer)
    },
    checkIfThereisImgsorvideos: function (imageContainer) {

      let imagesOrVideos = imageContainer.querySelectorAll('img, video')
      let images = imageContainer.querySelectorAll('img')
      let videos = imageContainer.querySelectorAll('video')

      let parent = imageContainer.parentElement

      if (imagesOrVideos.length === 0) {

        while (parent.id !== 'postModuleParent') {

          parent = parent.parentElement
        }

        let iconParent = parent.parentElement.querySelector('#uploadIconParent')

        parent.parentElement.removeChild(parent)

        iconParent.style.opacity = '1'

        iconParent.querySelectorAll('i').forEach(icon => {

          icon.style.cursor = 'pointer'
        })

        iconParent.querySelectorAll('input').forEach(input => {

          input.disabled = false
        })

        activeLiItems.pop()
        activeLiInstructions.pop()

      } else {

        if (images.length === 0) {

          containsType.image = false

          containsType.imageLiItems.forEach(item => {

            item.classList.add('disabled')
          })

        } else {

          containsType.image = true

          containsType.imageLiItems.forEach(item => {

            item.classList.remove('disabled')
          })
        }

        if (videos.length === 0) {

          containsType.video = false

          containsType.videoLiItems.forEach(item => {

            item.classList.add('disabled')
          })

        } else {

          containsType.video = true

          containsType.videoLiItems.forEach(item => {

            item.classList.remove('disabled')
          })
        }
      }
    },
    checkfilesPreview: function (files, imageContainer) {

      Array.from(files).forEach(file => {

        picturesAndVideosPreview.push(file)

        if (picturesAndVideosPreview.length <= 5) {

          reusable.createElementPreview(file, imageContainer)
        }
      })
    },
    seeMore: function (imageContainer) {

      seeMoreActive = true

      let seeMoreButton = document.createElement('span')
      let icon = document.createElement('i')

      seeMoreButton.innerText = 'See the rest with larger view'
      seeMoreButton.style.cursor = 'pointer'
      seeMoreButton.style['align-self'] = 'center'
      seeMoreButton.style['white-space'] = 'nowrap'
      seeMoreButton.style.color = 'rgb(51, 102, 255)'
      seeMoreButton.style['font-size'] = '18px'
      seeMoreButton.style['padding-right'] = '10px'

      icon.className = 'fa fa-table'
      icon.style['margin-right'] = '3px'

      imageContainer.appendChild(seeMoreButton)
      seeMoreButton.insertBefore(icon, seeMoreButton.firstChild)
    },
    filesUpdated: function (object) {

      if (object.length > 5 && !seeMoreActive) {

        reusable.seeMore(object.imageContainer)
      }

      if (object.length <= 5 && !!seeMoreActive) {

        seeMoreActive = false

        object.imageContainer.removeChild(object.imageContainer.lastElementChild)
      }

      if (previewFiles <= 5 && object.files) {

        for (i = 0; i < object.files.length; i++) {

          previewFiles++

          console.log(previewFiles)

          if (previewFiles <= 5) {

            reusable.appendFile(object.files[i], object.imageContainer)
            
          } else {

            break
          }
        }
      }

      if (object.instructions) {
        object.instructions.instructionsFunction(
          object.instructions.function, 
          object.instructions.message, 
          object.instructions.for,
          object.instructions.functionEvents, true)
      }

      reusable.checkIfThereisImgsorvideos(object.imageContainer)
    }
  }

  events.on('filesUpdated', reusable.filesUpdated)

})()
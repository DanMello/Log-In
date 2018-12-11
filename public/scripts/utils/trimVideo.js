let trimVideoModule = (function() {

  let initialState = {
    containerWidth: 900,
    containerHeight: 600,
    activeVideoSrc: null,
    videoHeight: null,
    videoCopy: null,
    videoSource: null,
    centerContainer: null,
    mainContainer: null,
    sliderInput: null,
    playButton: null,
    restartButton: null,
    volume: null,
    volumeIcon: null,
    volumeLi: null,
    currentTimeDisplay: null,
    trimmedVideosContainer: null,
    timerLi: null,
    durationDisplay: null,
    fullscreenButton: null,
    videoInstructions: null,
    videoSubContainer: null,
    trimmedVideo: [],
    trimming: false,
    startTrimTime: null,
    endTrimTime: null,
    trimButton: null,
    videoInstructionsContainer: null,
    preview: false,
    currentPreview: [],
    previewOptionsContainer: null,
    editCliptUl: null,
    videoControls: null,
    buttonLiIcons: [],
    endTrimOptions: null,
    trimmedUlList: null,
    activeLiItem: [],
    activeEditButton: null,
    headingContainer: null,
    currentVideoPath: null,
    editStartEndUl: null,
    currentOriginalVideo: null,
    editModeStart: null,
    editModeEnd: null,
    editStartList: null,
    editEndList: null,
    parentContainer: null
  }

  let containerState

  function trimVideo () {

    containerState = Object.assign({}, initialState)

    if (this.offsetWidth > this.offsetHeight) {
      //Landscape
      containerState.videoHeight = 300

    } else {
      //Portrait
      containerState.videoHeight = 400
    }

    let body = document.body
    let darkBackground = document.createElement('div')
    let mainContainer = document.createElement('div')
    let topContainer = document.createElement('div')
    let heading = document.createElement('h1')
    let closeButton = document.createElement('i')
    let hr = document.createElement('hr')
    let centerContainer = document.createElement('div')
    let videoContainer = document.createElement('div')
    let videoSubContainer = document.createElement('div')
    let video = document.createElement('video')
    let source = document.createElement('source')
    let videoButtonContainer = document.createElement('div')
    let editOptionsUL = document.createElement('ul')
    let editOptoinsLi = [
      { message: 'Trim', functionName: trim, icon: 'fa fa-compress', type: 'trimButton'}
    ]
    let bottomContainer = document.createElement('div')
    let sliderContainer = document.createElement('div')
    let sliderInput = document.createElement('input')
    let sliderButtonsContainer = document.createElement('div')
    let sliderButtonsUl = document.createElement('ul')
    let sliderButtonsLi = [
      { message: 'Play', functionName: togglePlay, icon: 'fa fa-play', type: 'playButton', event: 'click'},
      { message: 'Restart', functionName: restart, icon: 'fa fa-repeat', type: 'restartButton', event: 'click' },
      { message: 'Volume', functionName: mute, inputFunction: changeVolume, icon: 'fa fa-volume-up', type: 'volume', event: 'input' },
      { message: 'Duration', type: 'string' },
      { message: 'Full Screen', functionName: fullscreen, icon: 'fa fa-arrows-alt', type: 'fullscreen', event: 'click'},
    ]
    let submitButton = document.createElement('span')

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
        'min-height': containerState.containerHeight + 'px',
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
      centerContainer: {
        display: 'flex',
        'justify-content': 'space-around',
        width: '100%'
      },
      videoContainer: {
        height: containerState.videoHeight + 'px',
        'flex-grow': '1',
        'display': 'flex',
        'justify-content': 'center'
      },
      videoSubContainer: {
        height: containerState.videoHeight + 'px',
        display: 'inline-block',
        'position': 'relative'
      },
      video: {
        'height': '100%'
      },
      editOptionsUL: {
        'list-style-type': 'none',
        'flex-grow': '3'
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
      sliderContainer: {
        'flex-grow': '2',
        'margin-right': '20px',
        'margin-left': '20px',
      },
      sliderInput: {
        'width': '100%'
      },
      sliderButtonsUl: {
        'display': 'flex',
        'list-style-type': 'none',
        'align-items': 'center'
      },
      submitButton: {
        'display': 'block',
        'background': '#5b88e8',
        'color': 'white',
        'font-size': '20px',
        'border-radius': '5px',
        'padding': '10px',
        'text-align': 'center',
        'cursor': 'pointer',
        'flex-grow': '1',
        'margin-right': '20px'
      }
    }

    editOptoinsLi.map(listItem => {

        let li = document.createElement('li')
        let icon = document.createElement('i')

        li.style.display = 'inline-block'
        li.style.padding = '5px'
        li.style.color = '#3366FF'
        li.style['font-size'] = '18px'
        li.style.cursor = 'pointer'

        li.classList.add('editliItems')
        li.innerText = listItem.message

        icon.style['margin-right'] = '5px'

        icon.className = listItem.icon

        if (listItem.type === 'trimButton') containerState.trimButton = li

        li.addEventListener('click', listItem.functionName)
        li.addEventListener('click', activeLiItem)

        editOptionsUL.appendChild(li)
        li.insertBefore(icon, li.firstChild)
    })

    sliderButtonsLi.forEach(liItem => {

      let li = document.createElement('li')

      if (liItem.type === 'string') {

        let currentTime = new Date(null)
        let duration = new Date(null)

        currentTime.setSeconds(this.currentTime)
        duration.setSeconds(this.duration)

        let currentTimeResult = currentTime.toISOString().substr(11, 8)
        let durationResult = duration.toISOString().substr(11, 8)

        let currentTimeText = document.createTextNode(currentTimeResult)
        let slash = document.createTextNode(' / ')
        let durationText = document.createTextNode(durationResult)

        li.appendChild(currentTimeText)
        li.appendChild(slash)
        li.appendChild(durationText)

        containerState.currentTimeDisplay = currentTimeText
        containerState.durationDisplay = durationText
        containerState.timerLi = li

        sliderButtonsUl.appendChild(li)

      } else {

        let icon = document.createElement('i')

        li.style.padding = '5px'
        li.style.color = '#3366FF'
        li.style['font-size'] = '18px'
        li.style['margin-right'] = '5px'

        li.classList.add('editliItems')

        icon.className = liItem.icon
        icon.style.width = '15px'
        icon.style.padding = '2px'
        icon.style.cursor = 'pointer'
        
        if (liItem.event === 'input') {

          const sliderInput = document.createElement('input')

          li.style.display = 'flex'

          icon.style['margin-right'] = '10px'

          sliderInput.type = 'range'
          sliderInput.step = '0.1'
          sliderInput.value = '0.7'
          sliderInput.min = '0'
          sliderInput.max = '1'

          sliderInput.style.width = '70px'
          sliderInput.style.cursor = 'pointer'

          li.appendChild(sliderInput)

          sliderInput.addEventListener('input', liItem.inputFunction)

          containerState.volumeIcon = icon
          containerState.volume = sliderInput
          containerState.volumeLi = li
        }

        icon.addEventListener('click', liItem.functionName)
        // li.addEventListener('click', activeLiItem)

        if (liItem.type === 'playButton') containerState.playButton = li
        if (liItem.type === 'restartButton') containerState.restartButton = li
        if (liItem.type === 'fullscreen') containerState.fullscreenButton = li

        containerState.buttonLiIcons =  initialState.buttonLiIcons.concat(icon)

        sliderButtonsUl.appendChild(li)
        li.insertBefore(icon, li.firstChild) 
      }
    })

    for (const prop in styleObject) {

      for (const innerProp in styleObject[prop]) {

        switch (prop) {
          case 'darkBackground': darkBackground.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'mainContainer': mainContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'topContainer': topContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'heading': heading.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'closeButton': closeButton.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'hr': hr.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'centerContainer': centerContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'videoContainer': videoContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'videoSubContainer': videoSubContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'video': video.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'editOptionsUL': editOptionsUL.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'bottomContainer': bottomContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'sliderContainer': sliderContainer.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'sliderInput': sliderInput.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'sliderButtonsUl': sliderButtonsUl.style[innerProp] = styleObject[prop][innerProp]; break;
          case 'submitButton': submitButton.style[innerProp] = styleObject[prop][innerProp]; break;
        }
      }
    }

    heading.innerText = "Let's edit your video!"
    closeButton.className = 'fa fa-times'
    sliderInput.type = 'range'
    sliderInput.min = '0'
    sliderInput.max = this.duration.toString()
    sliderInput.value = '0'
    sliderInput.step = '0.01'
    sliderInput.style.cursor = 'pointer'
    submitButton.innerText = 'Save video'

    body.appendChild(darkBackground)
    darkBackground.appendChild(mainContainer)
    mainContainer.appendChild(centerContainer)
    mainContainer.insertBefore(topContainer, centerContainer)
    topContainer.appendChild(heading)
    topContainer.appendChild(closeButton)
    mainContainer.insertBefore(hr, centerContainer)
    centerContainer.appendChild(videoContainer)
    centerContainer.appendChild(editOptionsUL)
    videoContainer.appendChild(videoSubContainer)
    videoSubContainer.appendChild(video)
    video.appendChild(source)
    mainContainer.appendChild(hr.cloneNode(true))
    mainContainer.appendChild(bottomContainer)
    bottomContainer.appendChild(sliderContainer)
    sliderContainer.appendChild(sliderInput)
    sliderContainer.appendChild(sliderButtonsContainer)
    sliderButtonsContainer.appendChild(sliderButtonsUl)
    bottomContainer.appendChild(submitButton)

    source.type = 'video/mp4'
    source.src = this.firstElementChild.src

    video.dataset.videoName = this.dataset.videoName

    document.addEventListener('keydown', updateVideoTime)
    closeButton.addEventListener('click', closeVideoModule)
    sliderInput.addEventListener('input', updateVideoTime)
    video.addEventListener('timeupdate', updateVideoTime)

    containerState.videoCopy = video
    containerState.videoSource = source
    containerState.activeVideoSrc = this.firstElementChild.src
    containerState.parentContainer = darkBackground
    containerState.videoSubContainer = videoSubContainer
    containerState.mainContainer = mainContainer
    containerState.centerContainer = centerContainer
    containerState.sliderInput = sliderInput
    containerState.videoControls = sliderContainer
    containerState.buttonsControlsUl = sliderButtonsUl
  }

  function closeVideoModule () {

    containerState.parentContainer.parentNode.removeChild(containerState.parentContainer)
  }

  function activeLiItem (e) {

    if (this.classList.contains('disabled')) return

    if (!containerState.activeLiItem) {

      if (containerState.activeLiItem === this) {

        return

      } else {

        containerState.activeLiItem = null
      }
    }

    containerState.activeLiItem = this

    this.style.color = 'purple'
    this.style['text-decoration'] = 'underline'
    this.style['font-size'] = '20px'
  }

  function togglePlay () {

    if (containerState.playButton.classList.contains('disabled')) return

    if (containerState.videoCopy.paused) {

      containerState.videoCopy.play()

      containerState.playButton.lastChild.nodeValue = 'Pause'
      containerState.playButton.firstElementChild.className = 'fa fa-pause'

    } else {

      containerState.videoCopy.pause()

      containerState.playButton.lastChild.nodeValue = 'Play'
      containerState.playButton.firstElementChild.className = 'fa fa-play'
    }
  }

  function restart () {

    if (containerState.restartButton.classList.contains('disabled')) return

    if (containerState.preview) {
     
      containerState.videoCopy.load()
      containerState.videoCopy.play()

      if (containerState.playButton.classList.contains('disabled')) disbleButtons([containerState.playButton])

    } else {

      containerState.videoCopy.currentTime = 0
    }

    if (containerState.videoCopy.paused) {

      containerState.videoCopy.play()

      containerState.playButton.lastChild.nodeValue = 'Pause'
      containerState.playButton.firstElementChild.className = 'fa fa-pause'
    }
  }

  function changeVolume (e) {

    if (containerState.volumeLi.classList.contains('disabled')) return

    containerState.videoCopy.volume = this.value

    let volume = parseFloat(containerState.videoCopy.volume)

    if (volume === 0) containerState.volumeIcon.className = 'fa fa-volume-off'
    if (volume > 0)  containerState.volumeIcon.className = 'fa fa-volume-down'
    if (volume > 0.5)  containerState.volumeIcon.className = 'fa fa-volume-up'
  }

  function mute (e) {

    if (containerState.volumeLi.classList.contains('disabled')) return

    containerState.videoCopy.volume = '0'
    containerState.volume.value = '0'
    containerState.volumeIcon.className = 'fa fa-volume-off'
  }

  function showControls () {

    clearTimeout(containerState.timeoutFunction)

    containerState.timeoutFunction = null

    containerState.videoControls.style.display = 'block'
    containerState.videoCopy.style.cursor = 'default'

    if (!containerState.timeoutFunction) {

      let test = setTimeout(function () {

        containerState.videoControls.style.display = 'none'
        containerState.videoCopy.style.cursor = 'none'

      }, 2000)

      containerState.timeoutFunction = test
    }
  }

  function clearTimeFunction () {

    if (containerState.timeoutFunction) {

      clearTimeout(containerState.timeoutFunction)

      containerState.timeoutFunction = null
    }
  }

  function fullscreen () {

    if (containerState.fullscreenButton.classList.contains('disabled')) return

    let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement

    if (fullscreenElement) {
    
      removeFullscreen()

    } else {

      const page = document.documentElement

      if(page.requestFullscreen) {

        page.requestFullscreen()

      } else if(page.mozRequestFullScreen) {

        page.mozRequestFullScreen()

      } else if(page.webkitRequestFullscreen) {

        page.webkitRequestFullscreen()

      } else if(page.msRequestFullscreen) {

        page.msRequestFullscreen()
      }

      containerState.videoCopy.style.width = '100%'
      containerState.videoCopy.style.height = '100%'
      containerState.videoCopy.style.position = 'fixed'
      containerState.videoCopy.style.top = '0'
      containerState.videoCopy.style.left = '0'
      containerState.videoCopy.style['z-index'] = '999'
      containerState.videoCopy.style['background-color'] = 'black'

      containerState.videoControls.style.position = 'fixed'
      containerState.videoControls.style.width = '100%'
      containerState.videoControls.style.bottom = '0'
      containerState.videoControls.style.left = '0'
      containerState.videoControls.style.margin = '0'
      containerState.videoControls.style.padding = '15px'
      containerState.videoControls.style['z-index'] = '999'
      containerState.videoControls.style['background-color'] = 'rgba(0, 0, 0, 0.9)'

      containerState.timerLi.style.color = 'white'
      
      containerState.fullscreenButton.style['flex-grow'] = '1'
      containerState.fullscreenButton.firstElementChild.style.float = 'right'

      containerState.videoCopy.addEventListener('mousemove', showControls)
      containerState.videoControls.addEventListener('mousemove', clearTimeFunction)
    }
  }

  function updateVideoTime (e) {

    if (containerState.volumeLi.classList.contains('disabled')) return 

    let currentTime = new Date(null)

    currentTime.setSeconds(containerState.videoCopy.currentTime)

    let currentTimeResult = currentTime.toISOString().substr(11, 8)

    containerState.currentTimeDisplay.textContent = currentTimeResult

    if (containerState.editModeStart) {

      let endTime = containerState.currentOriginalVideo.newEndTime || containerState.currentOriginalVideo.endTime

      if (endTime < containerState.videoCopy.currentTime) {

        containerState.invalidPosition = true

        containerState.editingInstructions.innerText = 'Starting position cannot be placed after the ending position'

        containerState.editingInstructions.style.background = 'red'

      } else {

        containerState.invalidPosition = false

        containerState.editingInstructions.innerText = 'Click to save new starting position'

        containerState.editingInstructions.style.background = 'green'
      }
    }

    if (containerState.editModeEnd) {

      let startTime = containerState.currentOriginalVideo.newStartTime || containerState.currentOriginalVideo.startTime

      if (startTime > containerState.videoCopy.currentTime) {

        containerState.invalidPosition = true

        containerState.editingInstructions.innerText = 'Ending position cannot be placed before the starting position'

        containerState.editingInstructions.style.background = 'red'

      } else {

        containerState.invalidPosition = false

        containerState.editingInstructions.innerText = 'Click to save new ending position'

        containerState.editingInstructions.style.background = 'green'
      }
    }

    if (containerState.trimming) {

      if (containerState.startTrimTime > containerState.videoCopy.currentTime) {

        containerState.videoInstructions.innerText = 'Cannot end trim before starting trim'

      } else {

        containerState.videoInstructions.innerText = 'Click again to end trim'
      } 
    }

    if (containerState.preview) {

      if (containerState.videoCopy.paused) {

        containerState.previewOptionsContainer.style.display = 'flex'

      } else {

        containerState.previewOptionsContainer.style.display = 'none'
      }
    }

    if (e.type === 'keydown') {

      if (e.which === 32) {

        e.preventDefault()

        togglePlay()
      }

      if (e.which === 37) {

        e.preventDefault()

        if (containerState.videoCopy.currentTime > 0) containerState.videoCopy.currentTime -= 0.1
      }

      if (e.which === 39) {

        e.preventDefault()

        if (containerState.videoCopy.currentTime < containerState.videoCopy.duration) containerState.videoCopy.currentTime += 0.1
      }
    }

    if (e.type === 'input') {

      e.preventDefault()

      containerState.videoCopy.currentTime = parseFloat(this.value)
    }

    if (e.type === 'timeupdate') containerState.sliderInput.value = containerState.videoCopy.currentTime.toString()

    if (containerState.videoCopy.paused) {

      containerState.playButton.lastChild.nodeValue = 'Play'
      containerState.playButton.firstElementChild.className = 'fa fa-play'
    }
  }

  function trim () {

    if (containerState.activeLiItem === this) return

    if (containerState.trimButton.classList.contains('disabled')) return

    let video = containerState.videoCopy
    let mainContainer = containerState.mainContainer
    let centerContainer = containerState.centerContainer

    let headingContainer = document.createElement('div')
    let instructionsContainer = document.createElement('div')
    let heading = document.createElement('h1')
    let instructions = document.createElement('p')
    let videoInstructions = document.createElement('div')

    headingContainer.style['padding-left'] = '20px'
    headingContainer.style['padding-bottom'] = '20px'
    headingContainer.style.display = 'flex'
    headingContainer.style.width = '100%'
    headingContainer.style['justify-content'] = 'space-between'
    headingContainer.style['align-items'] = 'center'

    instructions.style['margin-top'] = '5px'

    videoInstructions.style.position = 'absolute'
    videoInstructions.style.color = 'white'
    videoInstructions.style['font-size'] = '20px'
    videoInstructions.style['font-weight'] = 'bold'
    videoInstructions.style.top = '0px'
    videoInstructions.style.left = '0px'
    videoInstructions.style.width = '100%'
    videoInstructions.style.height = '100%'
    videoInstructions.style.display = 'flex'
    videoInstructions.style['flex-direction'] = 'column'
    videoInstructions.style['background-color'] = 'rgba(0, 0, 0, 0.2)'
    videoInstructions.style.cursor = 'pointer'

    heading.innerText = 'Trim Mode'
    instructions.innerHTML = '1. Click to start trim. 2. Click to end trim. Repeat or Finish!'
    videoInstructions.innerText = 'Click to start trim'

    containerState.videoInstructions = videoInstructions

    headingContainer.appendChild(instructionsContainer)
    instructionsContainer.appendChild(heading)
    instructionsContainer.appendChild(instructions)
    mainContainer.insertBefore(headingContainer, centerContainer)
    video.parentElement.appendChild(videoInstructions)

    videoInstructions.addEventListener('click', startTrimming)

    containerState.videoInstructionsContainer = videoInstructions

    containerState.instructionsContainer = instructionsContainer

    containerState.headingContainer = headingContainer
  }

  function startTrimming () {

    if (containerState.trimming) return

    if (containerState.videoCopy.paused) {
      
      containerState.videoCopy.play()
      containerState.playButton.lastChild.nodeValue = 'Pause'
      containerState.playButton.firstElementChild.className = 'fa fa-pause'
    }

    containerState.trimming = true

    this.innerText = 'Click again to end trim'

    containerState.startTrimTime = containerState.videoCopy.currentTime

    this.addEventListener('click', endTrimming)
  }

  function endTrimming () {

    if (!containerState.trimming) return

    if (containerState.startTrimTime > containerState.videoCopy.currentTime) return 

    containerState.trimming = false

    this.innerText = ''

    containerState.endTrimTime = containerState.videoCopy.currentTime

    containerState.videoCopy.pause()
    containerState.playButton.lastChild.nodeValue = 'Play'
    containerState.playButton.firstElementChild.className = 'fa fa-play'

    let clip = {
      startTime: containerState.startTrimTime,
      endTime: containerState.endTrimTime,
      clipName: containerState.videoCopy.dataset.videoName
    }

    containerState.currentPreview.clipInfo = clip

    this.removeEventListener('click', startTrimming)
    this.removeEventListener('click', endTrimming)

    addLoader(this, 'Sending info to server...', 20, 'ajaxDefault.gif')

    fetch(window.location.origin + '/account/update/trimVideoInfo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clip)
    }).then(response => {

      return response.json()

    }).then(result => {

      removeLoader()

      let trimmedVideosContainer

      if (!containerState.trimmedVideosContainer) {

        trimmedVideosContainer = document.createElement('div')

        trimmedVideosContainer.style.display = 'flex'
        trimmedVideosContainer.style.height = '100px'
        trimmedVideosContainer.style.width = '95%'
        trimmedVideosContainer.style.border = '1px solid #ccc'
        trimmedVideosContainer.style.padding = '5px 0px 5px 5px'
        trimmedVideosContainer.style.margin = '10px 0px 0px 0px'

        containerState.mainContainer.insertBefore(trimmedVideosContainer, containerState.centerContainer.nextElementSibling)

      } else {

        trimmedVideosContainer = containerState.trimmedVideosContainer
      }

      const trimmedVideoStatusBox = document.createElement('div')

      trimmedVideoStatusBox.style.height = '100%'
      trimmedVideoStatusBox.style.display = 'inline-block'
      trimmedVideoStatusBox.style.border = '1px dotted darkgrey'
      trimmedVideoStatusBox.style.padding = '3px'

      const trimmedVideo = document.createElement('video')
      
      trimmedVideo.style.height = '100%'
      trimmedVideo.style.cursor = 'pointer'

      const trimmedVideoSource = document.createElement('source')

      trimmedVideosContainer.appendChild(trimmedVideoStatusBox)
      trimmedVideoStatusBox.appendChild(trimmedVideo)
      trimmedVideo.appendChild(trimmedVideoSource)

      const ulList = document.createElement('ul')
      const liListItems = [
        { message: 'Continue video from here in trim mode', functionName: ContinueInTrimMode },
        { message: 'Start trimming from here', functionName: ContinueTrimmingFromHere },
        { message: 'Finish trimming', functionName: FinishTrimming }
      ]

      ulList.style['list-style-type'] = 'none'
      ulList.style['align-self'] = 'center'

      liListItems.forEach(liItem => {

        const li = document.createElement('li')

        li.innerText = liItem.message

        li.style.padding = '10px'
        li.style.background = 'rgb(91, 136, 232)'
        li.style['border-radius'] = '5px'
        li.style['margin-bottom'] = '5px'
        li.style['text-align'] = 'center'
        li.style.cursor = 'pointer'
        li.style['font-size'] = '16px'

        ulList.appendChild(li)

        li.addEventListener('click', liItem.functionName)
      })

      this.appendChild(ulList)

      trimmedVideo.addEventListener('click', previewTrim)

      let loader = addLoader(trimmedVideoStatusBox, 'Trimming video...', 12, 'ajaxDefault.gif')

      const currentTrimmedVideo = {
        trimmedVideoStatusBox,
        trimmedVideo,
        trimmedVideoSource,
        url: result.trimmedVideoPublic,
        loader: loader,
        originalVideo: containerState.videoSource.src,
        startTime: containerState.startTrimTime,
        endTime: containerState.endTrimTime,
        newStartTime: null,
        newEndTime: null
      }

      containerState.videoInstructionsContainer.style['justify-content'] = 'center'
      containerState.videoInstructionsContainer.style['background-color'] = 'rgba(0, 0, 0, 0.7)'
      containerState.trimmedUlList = ulList
      containerState.trimmedVideosContainer = trimmedVideosContainer
      containerState.trimmedVideo = (containerState.trimmedVideo.length > 0) ? containerState.trimmedVideo.concat(currentTrimmedVideo):initialState.trimmedVideo.concat(currentTrimmedVideo)

      let trimVideoDetails = {
        cmd: result.cmd,
        args: result.args,
        url: result.trimmedVideoPublic
      }

      disbleButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

      return fetch(window.location.origin + '/account/update/trimVideo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trimVideoDetails)
      })

    }).then(response => {

      return response.json()

    }).then(result => {

      let currentTrimmedVideo = containerState.trimmedVideo.filter((x, i) => {

        return x.url == result.url

      }).reduce((acc, cur) => {

        acc = cur

        return acc
      }, {})

      currentTrimmedVideo.trimmedVideoStatusBox.style.border = 'none'
      currentTrimmedVideo.trimmedVideoSource.src = currentTrimmedVideo.url

      currentTrimmedVideo.trimmedVideo.load()

      removeLoader(currentTrimmedVideo.loader)

    }).catch(err => {

      console.log('err', err)
    })
  }

  function disbleButtons (buttonArray) {

    buttonArray.forEach(button => {

      if (button.children.length > 0) {

        if (button === containerState.activeLiItem) {

          button.style.color = '#3366FF'
          button.style['font-size'] = '18px'
          button.style['text-decoration'] = 'none'
          containerState.activeLiItem = null
        }

        Array.from(button.children).forEach(child => {

          if (child.tagName === 'INPUT') child.disabled = true
        }) 
      }

      if (button.tagName === 'INPUT') button.disabled = true

      button.classList.add('disabled')
    })
  }

  function reanableButtons (buttonArray) {

    buttonArray.forEach(button => {

      if (button.children.length > 0) {

        Array.from(button.children).forEach(child => {

          if (child.tagName === 'INPUT') child.disabled = false
        })
      }

      if (button.tagName === 'INPUT') button.disabled = false

      button.classList.remove('disabled')
    })
  }

  function previewTrim () {

    if (containerState.videoCopy.firstElementChild.src === this.firstElementChild.src) return

    if (!!containerState.editing) return

    if (!!containerState.trimmedUlList) {

      containerState.videoInstructions.parentElement.removeChild(containerState.videoInstructions)

      containerState.trimmedUlList = null
    }

    containerState.instructionsContainer.style.display = 'block'
    containerState.instructionsContainer.firstElementChild.innerText = 'Preview Mode'
    containerState.instructionsContainer.lastElementChild.innerText = 'Click on the clips below you would like to preview then pause clip for more options'

    disbleButtons([containerState.trimButton])

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

    containerState.preview = true
    containerState.videoCopy.firstElementChild.src = this.firstElementChild.src
    containerState.videoCopy.load()

    containerState.videoCopy.onloadedmetadata = function () {

      const duration = new Date(null)

      duration.setSeconds(containerState.videoCopy.duration)

      const durationResult = duration.toISOString().substr(11, 8)

      containerState.durationDisplay.textContent = durationResult

      containerState.sliderInput.max = containerState.videoCopy.duration.toString()
    }

    containerState.videoCopy.play()

    containerState.playButton.firstElementChild.className = 'fa fa-pause'

    if (!containerState.previewOptionsContainer) {

      const previewOptionsContainer = document.createElement('div')

      previewOptionsContainer.style.display = 'none'
      previewOptionsContainer.style.position = 'absolute'
      previewOptionsContainer.style.color = 'white'
      previewOptionsContainer.style['font-size'] = '20px'
      previewOptionsContainer.style['font-weight'] = 'bold'
      previewOptionsContainer.style.top = '0px'
      previewOptionsContainer.style.left = '0px'
      previewOptionsContainer.style.width = '100%'
      previewOptionsContainer.style.height = '100%'
      previewOptionsContainer.style['flex-direction'] = 'column'
      previewOptionsContainer.style['justify-content'] = 'center'
      previewOptionsContainer.style['background-color'] = 'rgba(0, 0, 0, 0.2)'

      const ulList = document.createElement('ul')

      const liListItems = [
        { message: 'Edit clip', functionName: editClip },
        { message: 'Delete clip', functionName: deleteClip },
        { message: 'Exit preview', functionName: exitPreview }
      ]

      ulList.style['list-style-type'] = 'none'
      ulList.style['align-self'] = 'center'

      liListItems.forEach(liItem => {

        let li = document.createElement('li')

        li.innerText = liItem.message

        li.style.padding = '10px'
        li.style.background = 'rgb(91, 136, 232)'
        li.style['border-radius'] = '5px'
        li.style['margin-bottom'] = '5px'
        li.style['text-align'] = 'center'
        li.style.cursor = 'pointer'
        li.style['font-size'] = '16px'

        ulList.appendChild(li)

        li.addEventListener('click', liItem.functionName.bind(this))
      })

      containerState.videoSubContainer.appendChild(previewOptionsContainer)
      previewOptionsContainer.appendChild(ulList)

      containerState.editCliptUl = ulList
      containerState.previewOptionsContainer = previewOptionsContainer
    }
  }

  function ContinueInTrimMode (e) {

    e.stopPropagation()

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

    containerState.trimmedUlList.style.display = 'none'

    containerState.videoInstructions.innerText = 'Click to start trim'

    containerState.videoInstructionsContainer.style['justify-content'] = 'flex-start'

    containerState.videoInstructionsContainer.style['background-color'] = 'rgba(0, 0, 0, 0.2)'

    containerState.videoCopy.play()

    containerState.playButton.firstElementChild.className = 'fa fa-pause'

    containerState.videoInstructions.addEventListener('click', startTrimming)
  }

  function ContinueTrimmingFromHere (e) {

    e.stopPropagation()

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

    containerState.trimmedUlList.style.display = 'none'

    containerState.videoInstructionsContainer.style['justify-content'] = 'flex-start'

    containerState.videoInstructionsContainer.style['background-color'] = 'rgba(0, 0, 0, 0.2)'

    startTrimming.bind(containerState.videoInstructions)()
  }

  function FinishTrimming (e) {

    e.stopPropagation()

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

    containerState.videoInstructions.parentElement.removeChild(containerState.videoInstructions)

    containerState.trimmedUlList = null

    containerState.instructionsContainer.style.display = 'none'

    containerState.activeLiItem.style.color = '#3366FF'
    containerState.activeLiItem.style['font-size'] = '18px'
    containerState.activeLiItem.style['text-decoration'] = 'none'
    containerState.activeLiItem = null
  }

  function editClip () {

    let currentOriginalVideo = this.firstElementChild.src.replace(/^(?:\/\/|[^\/]+)*\//, "/")

    let currentTrimmedVideo = containerState.trimmedVideo.filter(x => {

      return x.url == currentOriginalVideo

    }).reduce((acc, cur) => {

      acc = cur

      return acc
    }, {})

    const editingStatusContainer = document.createElement('div')

    editingStatusContainer.style.display = 'flex'
    editingStatusContainer.style['flex-direction'] = 'column'
    editingStatusContainer.style['padding'] = '5px'
    editingStatusContainer.style['margin-right'] = '10px'
    editingStatusContainer.style.border = '1px solid #ccc'
    editingStatusContainer.style['border-radius'] = '5px'

    const currentClipInfo = document.createElement('span')

    currentClipInfo.style.padding = '2px'
    currentClipInfo.style['font-size'] = '15px'

    const newClipInfo = document.createElement('span')

    newClipInfo.style.display = 'inline-block'
    newClipInfo.style.padding = '2px'
    newClipInfo.style['font-size'] = '15px'

    const newClipStart = document.createElement('span')

    newClipStart.innerText = 'Edited clip start time: '

    const newStartTimeValue = document.createElement('span')

    const newstartTimeConverted = new Date(null)

    newstartTimeConverted.setSeconds(currentTrimmedVideo.startTime)

    const newstartTimeResult = newstartTimeConverted.toISOString().substr(11, 8)

    newStartTimeValue.innerText = newstartTimeResult

    newStartTimeValue.style.color = 'blue'

    newClipStart.appendChild(newStartTimeValue)

    const newClipEnd = document.createElement('span')

    newClipEnd.innerText = ' end time: '

    const newEndValue = document.createElement('span')

    const newEndtimeconverted = new Date(null)

    newEndtimeconverted.setSeconds(currentTrimmedVideo.endTime)

    const newEndvalueResult = newEndtimeconverted.toISOString().substr(11, 8)

    newEndValue.innerText = newEndvalueResult

    newEndValue.style.color = 'blue'

    newClipEnd.appendChild(newEndValue)

    const heading = document.createElement('div')

    heading.style.background = 'green'
    heading.style['font-size'] = '16px'
    heading.style.padding = '5px'

    heading.style.display = 'none'

    const liListItems = [
      { message: 'Edit start of clip', functionName: editStart },
      { message: 'Edit end of clip', functionName: editEnd }
    ]

    let list = createListItems(liListItems)

    currentClipInfo.innerHTML = `Original clip start time: <span style="color: blue">${newstartTimeResult} </span> end time: <span style="color: blue">${newEndvalueResult} </span>`

    containerState.editCliptUl.style.display = 'none'

    containerState.preview = false

    containerState.editing = true

    containerState.headingContainer.appendChild(editingStatusContainer)

    editingStatusContainer.appendChild(currentClipInfo)

    editingStatusContainer.appendChild(newClipInfo)

    newClipInfo.appendChild(newClipStart)

    newClipInfo.appendChild(newClipEnd)

    containerState.instructionsContainer.firstElementChild.innerText = 'Edit Mode'

    containerState.instructionsContainer.lastElementChild.innerText = 'Select which part of the clip you would like to edit'

    containerState.previewOptionsContainer.appendChild(heading)

    containerState.previewOptionsContainer.appendChild(list)

    containerState.editingInstructions = heading

    containerState.currentOriginalVideo = currentTrimmedVideo

    containerState.editStartEndUl = list

    containerState.videoSource.src = containerState.currentOriginalVideo.originalVideo.replace(/^(?:\/\/|[^\/]+)*\//, "/")

    containerState.videoCopy.load()

    containerState.videoCopy.currentTime = containerState.currentOriginalVideo.startTime

    containerState.newStartTimeValue = newStartTimeValue

    containerState.newEndValue = newEndValue

    disbleButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])
  }

  function editStart (e) {

    e.stopPropagation()

    if (!!containerState.editEndList) {

      containerState.editEndList.style.display = 'none'
    }

    const startTime = containerState.currentOriginalVideo.newStartTime || containerState.currentOriginalVideo.startTime

    containerState.videoCopy.currentTime = startTime

    containerState.editStartEndUl.style.display = 'none'

    containerState.instructionsContainer.firstElementChild.innerText = 'Edit Start Mode'

    containerState.instructionsContainer.lastElementChild.innerText = 'Select a new starting position and click on the video again to save'

    containerState.editingInstructions.innerText = 'Click to save new starting position'

    containerState.editingInstructions.style.display = 'block'

    containerState.previewOptionsContainer.style['justify-content'] = 'flex-start'

    containerState.previewOptionsContainer.addEventListener('click', setNewStartTime)

    containerState.editModeStart = true

    containerState.editModeEnd = false

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])
  }

  function setNewStartTime () {

    if (!!containerState.invalidPosition) return

    containerState.editingInstructions.style.display = 'none'

    containerState.previewOptionsContainer.style['justify-content'] = 'center'

    containerState.currentOriginalVideo.newStartTime = containerState.videoCopy.currentTime

    const newstartTimeConverted = new Date(null)

    newstartTimeConverted.setSeconds(containerState.videoCopy.currentTime)

    const newstartTimeResult = newstartTimeConverted.toISOString().substr(11, 8)

    containerState.newStartTimeValue.innerText = newstartTimeResult

    if (!containerState.editStartList) {

      let liListItems = [
        { message: 'Edit end of clip', functionName: editEnd },
        { message: 'Finish and Save', functionName: finishSaveEdit },
        { message: 'Exit without saving', functionName: undoEdit }
      ]

      let list = createListItems(liListItems)

      containerState.editStartList = list

      containerState.previewOptionsContainer.appendChild(list)

    } else {

      containerState.editStartList.style.display = 'block'
    }

    containerState.previewOptionsContainer.removeEventListener('click', setNewStartTime)

    disbleButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

    containerState.videoCopy.pause()

    containerState.playButton.firstElementChild.className = 'fa fa-play'
  }

  function editEnd (e) {

    e.stopPropagation()

    if (!!containerState.editStartList) {

      containerState.editStartList.style.display = 'none'
    }

    let endTime = containerState.currentOriginalVideo.newEndTime || containerState.currentOriginalVideo.endTime

    containerState.videoCopy.currentTime = endTime

    containerState.editStartEndUl.style.display = 'none'

    containerState.instructionsContainer.firstElementChild.innerText = 'Edit End of clip'

    containerState.instructionsContainer.lastElementChild.innerText = 'Select a new ending position and click on the video again to save'

    containerState.editingInstructions.innerText = 'Click to save new ending position'

    containerState.editingInstructions.style.display = 'block'

    containerState.previewOptionsContainer.style['justify-content'] = 'flex-start'

    containerState.previewOptionsContainer.addEventListener('click', setNewEndTime)

    containerState.editModeStart = false

    containerState.editModeEnd = true

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])
  }

  function setNewEndTime () {

    if (!!containerState.invalidPosition) return

    containerState.editingInstructions.style.display = 'none'

    containerState.previewOptionsContainer.style['justify-content'] = 'center'

    containerState.currentOriginalVideo.newEndTime = containerState.videoCopy.currentTime

    const newEndtimeconverted = new Date(null)

    newEndtimeconverted.setSeconds(containerState.videoCopy.currentTime)

    const newEndvalueResult = newEndtimeconverted.toISOString().substr(11, 8)

    containerState.newEndValue.innerText = newEndvalueResult

    if (!containerState.editEndList) {

      let liListItems = [
        { message: 'Edit start of clip', functionName: editStart },
        { message: 'Finish and Save', functionName: finishSaveEdit },
        { message: 'Exit without saving', functionName: undoEdit }
      ]

      let list = createListItems(liListItems)

      containerState.editEndList = list

      containerState.previewOptionsContainer.appendChild(list)

    } else {

      containerState.editEndList.style.display = 'block'
    }

    containerState.previewOptionsContainer.removeEventListener('click', setNewEndTime)

    disbleButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput])

    containerState.videoCopy.pause()

    containerState.playButton.firstElementChild.className = 'fa fa-play'
  }

  function finishSaveEdit () {

    containerState.currentOriginalVideo.trimmedVideoSource.src = ''

    containerState.currentOriginalVideo.trimmedVideo.load()

    containerState.currentOriginalVideo.trimmedVideo.parentElement.style.border = '1px dotted darkgrey'

    addLoader(containerState.currentOriginalVideo.trimmedVideo.parentElement, 'Trimming video...', 12, 'ajaxDefault.gif')


  }

  function undoEdit () {

    containerState.headingContainer.parentElement.removeChild(containerState.headingContainer)

    containerState.editStartEndUl.parentElement.removeChild(containerState.editStartEndUl)

    reanableButtons([containerState.playButton, containerState.restartButton, containerState.fullscreenButton, containerState.volumeLi, containerState.sliderInput, containerState.trimButton])

    // removeInstructions()
  }

  function deleteClip () {

    let clipGoingToBeDeleted = containerState.trimmedVideo.filter(x => {

      return x.trimmedVideo.firstElementChild.src === this.firstElementChild.src
    })

    console.log(clipGoingToBeDeleted)

    clipGoingToBeDeleted[0].trimmedVideoStatusBox.parentElement.removeChild(clipGoingToBeDeleted[0].trimmedVideoStatusBox)

    let index = containerState.trimmedVideo.indexOf(clipGoingToBeDeleted[0])

    var array = containerState.trimmedVideo

    array.splice(index, 1)

    containerState.preview = false
    containerState.instructionsContainer.style.display = 'none'
    containerState.previewOptionsContainer.parentElement.removeChild(containerState.previewOptionsContainer)
    containerState.previewOptionsContainer = null
    containerState.videoSource.src = containerState.activeVideoSrc
    containerState.videoCopy.load()

    reanableButtons([containerState.trimButton])

    if (array.length === 0) {

      containerState.trimmedVideosContainer.parentElement.removeChild(containerState.trimmedVideosContainer)

      containerState.trimmedVideosContainer = null
    }

    return removeClipFromArray(index)
  }

  function removeClipFromArray (index) {

    return containerState.trimmedVideo.splice(index, 1)
  }

  function exitPreview () {

    containerState.preview = false
    containerState.instructionsContainer.style.display = 'none'
    containerState.previewOptionsContainer.parentElement.removeChild(containerState.previewOptionsContainer)
    containerState.previewOptionsContainer = null
    containerState.videoSource.src = containerState.activeVideoSrc
    containerState.videoCopy.load()

    reanableButtons([containerState.trimButton])
  }

  function removeInstructions (obj) {


  }

  function createListItems (array) {

    const ulList = document.createElement('ul')

    ulList.style['list-style-type'] = 'none'
    ulList.style['align-self'] = 'center'

    array.forEach(liItem => {

      let li = document.createElement('li')

      li.innerText = liItem.message

      li.style.padding = '10px'
      li.style.background = 'rgb(91, 136, 232)'
      li.style['border-radius'] = '5px'
      li.style['margin-bottom'] = '5px'
      li.style['text-align'] = 'center'
      li.style.cursor = 'pointer'
      li.style['font-size'] = '16px'

      ulList.appendChild(li)

      li.addEventListener('click', liItem.functionName.bind(this))
    })

    return ulList
  }

  function fullscreenHandler () {

    let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) {

      clearTimeout(containerState.timeoutFunction)

      containerState.timeoutFunction = null
      containerState.videoCopy.removeEventListener('mousemove', showControls)
      containerState.videoControls.removeEventListener('mousemove', clearTimeFunction)
      containerState.videoControls.style.display = 'block'

      removeFullscreen()
    }
  }

  function removeFullscreen () {

    if(document.exitFullscreen) {

      document.exitFullscreen()

    } else if(document.mozCancelFullScreen) {

      document.mozCancelFullScreen()

    } else if(document.webkitExitFullscreen) {

      document.webkitExitFullscreen()
    }

    containerState.videoCopy.style.width = 'initial'
    containerState.videoCopy.style.height = '100%'
    containerState.videoCopy.style.position = 'initial'
    containerState.videoCopy.style.top = 'initial'
    containerState.videoCopy.style.left = 'initial'
    containerState.videoCopy.style['z-index'] = 'initial'
    containerState.videoCopy.style['background-color'] = 'initial'

    containerState.videoControls.style.position = 'initial'
    containerState.videoControls.style.width = 'initial'
    containerState.videoControls.style.bottom = 'initial'
    containerState.videoControls.style.left = 'initial'
    containerState.videoControls.style.margin = 'initial'
    containerState.videoControls.style.padding = 'initial'
    containerState.videoControls.style.margin = '0px 20px 0px 20px'
    containerState.videoControls.style['z-index'] = 'initial'
    containerState.videoControls.style['background-color'] = 'initial'

    containerState.timerLi.style.color = 'initial'
    
    containerState.fullscreenButton.style['flex-grow'] = 'initial'
    containerState.fullscreenButton.firstElementChild.style.float = 'initial'
  }

  document.addEventListener("fullscreenchange", fullscreenHandler)
  document.addEventListener("webkitfullscreenchange", fullscreenHandler)
  document.addEventListener("mozfullscreenchange", fullscreenHandler)
  document.addEventListener("MSFullscreenChange", fullscreenHandler)

  return {
    trimVideo
  }

})()
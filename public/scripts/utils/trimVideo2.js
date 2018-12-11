
const trimVideoModule = (function() {

  const immutableState = {
    mainContainer: null,
    centerContainer: null,
    video: null,
    videoSrc: null,
    videoHeight: null,
    sliderInput: null,
    playButton: null,
    restartButton: null,
    volume: null,
    volumeIcon: null,
    volumeLi: null,
    timer: null,
    currentVideoTime: null,
    videoDuration: null,
    fullscreenButton: null,
    videoInstructions: null,
    trimmedVideo: [],
    preview: false,
    previewOptionsContainer: null,
    videoControls: null,
    buttonLiIcons: [],
    endTrimOptions: null,
    trimmedUlList: null,
    activeLiItem: [],
    activeEditButton: null,
    currentVideoPath: null,
    editStartEndUl: null,
    currentOriginalVideo: null,
    editModeStart: null,
    editModeEnd: null,
    editStartList: null,
    editEndList: null,
    parentContainer: null,
    trimming: null,
    startTrimTime: null,
    endTrimTime: null,
    startTrimText: null,
    endTrimText: null,
    currentTrimmedClip: null,
    currentlyActiveModule: {
      active: null,
      reset: null,
      button: null,
      headingContainer: null,
      videoContainerController: {
        container: null,
        instructions: null
       },
      seperateController: null,
      extraContainer: null
    }
  }

  let state

  let trimVideo = function () {

    state = Object.assign({}, immutableState)
    state.currentlyActiveModule = Object.assign({}, immutableState.currentlyActiveModule)

    if (this.offsetWidth > this.offsetHeight) {
      //Landscape
      state.videoHeight = 300

    } else {
      //Portrait
      state.videoHeight = 400
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
      { message: 'Trim', functionName: prepareTrimMethod, icon: 'fa fa-compress'}
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
        'width': '900px',
        'min-height': '600px',
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
        height: state.videoHeight + 'px',
        'flex-grow': '1',
        'display': 'flex',
        'justify-content': 'center'
      },
      videoSubContainer: {
        height: state.videoHeight + 'px',
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

        li.addEventListener('click', listItem.functionName)

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

        state.currentVideoTime = currentTimeText
        state.videoDuration = durationText
        state.timer = li

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

          state.volumeIcon = icon
          state.volume = sliderInput
          state.volumeLi = li
        }

        icon.addEventListener('click', liItem.functionName)

        if (liItem.type === 'playButton') state.playButton = li
        if (liItem.type === 'restartButton') state.restartButton = li
        if (liItem.type === 'fullscreen') state.fullscreenButton = li

        state.buttonLiIcons =  immutableState.buttonLiIcons.concat(icon)

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

    state.video = video
    state.videoSrc = source.src
    state.parentContainer = darkBackground
    state.videoSubContainer = videoSubContainer
    state.mainContainer = mainContainer
    state.centerContainer = centerContainer
    state.sliderInput = sliderInput
    state.videoControls = sliderContainer
    state.buttonsControlsUl = sliderButtonsUl
  }

  function prepareTrimMethod () {

    if (state.currentlyActiveModule.active !== null) {

      state.currentlyActiveModule.reset()

    }  else {

      let methodProperties = {
        heading: 'Trim Mode',
        closeButton: 'Exit trim mode',
        text: '1. Click to start trim. 2. Click to end trim. Repeat or Finish!',
        button: this,
        reset: function () {
          resetMethod({
            heading: true,
            button: this,
            videoContainer: true,
            seperateController: false
          })
        }.bind(this)
      }

      setUpMethod(methodProperties)
      createVideoContainerTrim()
      createExtraHeadingTrim()
    }
  }

  function createVideoContainerTrim () {

    let videoContainer = document.createElement('div')
    let instructions = document.createElement('span')

    videoContainer.style.position = 'absolute'
    videoContainer.style.top = '0px'
    videoContainer.style.left = '0px'
    videoContainer.style.width = '100%'
    videoContainer.style.height = '100%'
    videoContainer.style.display = 'flex'
    videoContainer.style['flex-direction'] = 'column'
    videoContainer.style['background-color'] = 'rgba(0, 0, 0, 0.4)'
    videoContainer.style.cursor = 'pointer'

    instructions.style.color = 'white'
    instructions.style['font-size'] = '20px'
    instructions.style['padding-top'] = '2px'
    instructions.style['padding-left'] = '2px'

    instructions.innerText = 'Click to start trimming'

    state.video.parentElement.appendChild(videoContainer)
    videoContainer.appendChild(instructions)

    videoContainer.addEventListener('click', trim)

    state.currentlyActiveModule.videoContainerOptions = {
      container: videoContainer,
      instructions: instructions
    }
  }

  function createExtraHeadingTrim () {

    let container = document.createElement('div')
    let startTrimContainer = document.createElement('div')
    let startTrimText = document.createElement('span')
    let startTrimTime = document.createElement('span')
    let endTrimContainer = document.createElement('div')
    let endTrimText = document.createElement('span')
    let endTrimTime = document.createElement('span')

    container.style.height = '100%'
    container.style.border = '1px solid #ccc'
    container.style.padding = '20px'
    container.style.margin = '0px 0px 0px 10px'
    container.style['border-radius'] = '5px'
    container.style.display = 'flex'
    container.style['flex-direction'] = 'column'
    container.style['justify-content'] = 'center'

    startTrimTime.style.color = 'blue'
    endTrimTime.style.color = 'blue'

    endTrimContainer.style['margin-top'] = '5px'

    startTrimText.innerText = 'Set trim start time: '
    startTrimTime.innerText = 'pending'
    endTrimText.innerText = 'Set trim end time: '
    endTrimTime.innerText = 'pending'

    state.currentlyActiveModule.rightSidecontainer.appendChild(container)
    container.appendChild(startTrimContainer)
    startTrimContainer.appendChild(startTrimText)
    startTrimContainer.appendChild(startTrimTime)
    container.appendChild(endTrimContainer)
    endTrimContainer.appendChild(endTrimText)
    endTrimContainer.appendChild(endTrimTime)

    state.startTrimText = startTrimTime
    state.endTrimText = endTrimTime
  }

  function resetMethod (obj) {

    if (obj.heading === true) {

      state.currentlyActiveModule.headingContainer.parentElement.removeChild(state.currentlyActiveModule.headingContainer)
    }

    if (obj.videoContainer === true) {

      state.currentlyActiveModule.videoContainerOptions.container.parentElement.removeChild(state.currentlyActiveModule.videoContainerOptions.container)
    }

    if (obj.button) {

      obj.button.classList.remove('activeButton')
    }

    state.currentlyActiveModule = Object.assign({}, immutableState.currentlyActiveModule)
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

  function setUpMethod (methodProperties) {

    if (state.currentlyActiveModule.active !== null) {

      state.currentlyActiveModule.reset()
    }

    let headingContainer = document.createElement('div')
    let instructionsContainer = document.createElement('div')
    let rightSidecontainer = document.createElement('div')
    let subContainer = document.createElement('div')
    let heading = document.createElement('h1')
    let closeButton = document.createElement('div')
    let instructions = document.createElement('p')
    let videoEventContainer = document.createElement('div')

    let mainContainer = state.mainContainer

    headingContainer.style['padding-left'] = '20px'
    headingContainer.style['padding-bottom'] = '20px'
    headingContainer.style['padding-right'] = '20px'
    headingContainer.style.display = 'flex'
    headingContainer.style.width = '100%'
    headingContainer.style['justify-content'] = 'space-around'

    instructionsContainer.style.padding = '15px'
    instructionsContainer.style['flex-grow'] = '1'
    instructionsContainer.style.border = '1px solid #ccc'
    instructionsContainer.style['border-radius'] = '5px'

    subContainer.style.display = 'flex'
    subContainer.style['justify-content'] = 'space-between'

    closeButton.style.color = 'white'
    closeButton.style.cursor = 'pointer'
    closeButton.style.alignSelf = 'flex-start'
    closeButton.style['text-align'] = 'center'
    closeButton.style.padding = '5px'
    closeButton.style['border-radius'] = '5px'
    closeButton.style['background-color'] = 'purple'
    closeButton.style['font-weight'] = 'bold'

    heading.innerText = methodProperties.heading
    closeButton.innerText = methodProperties.closeButton
    instructions.innerHTML = methodProperties.text

    headingContainer.appendChild(instructionsContainer)
    headingContainer.appendChild(rightSidecontainer)
    instructionsContainer.appendChild(subContainer)
    subContainer.appendChild(heading)
    subContainer.appendChild(closeButton)
    instructionsContainer.appendChild(instructions)
    state.mainContainer.insertBefore(headingContainer, state.centerContainer)
    state.video.parentElement.appendChild(videoEventContainer)

    methodProperties.button.classList.add('activeButton')

    closeButton.addEventListener('click', methodProperties.reset)

    state.currentlyActiveModule.active = true
    state.currentlyActiveModule.headingContainer = headingContainer
    state.currentlyActiveModule.rightSidecontainer = rightSidecontainer
    state.currentlyActiveModule.reset = methodProperties.reset
    state.currentlyActiveModule.button = methodProperties.button
  }

  function trim () {

    if (state.trimming !== true) {

      state.trimming = true

      state.startTrimTime = state.video.currentTime
      state.startTrimText.innerText = state.video.currentTime

      if (state.video.paused) {

        togglePlay()
      }

    } else if (state.startTrimTime < state.video.currentTime) {

      if (!state.video.paused) {

        togglePlay()
      }

      state.trimming = false

      state.endTrimTime = state.video.currentTime
      state.endTrimText.innerText = state.video.currentTime
    }
  }

  function updateVideoTime (e) {

    if (state.volumeLi.classList.contains('disabled')) return 

    let currentTime = new Date(null)

    currentTime.setSeconds(state.video.currentTime)

    let currentTimeResult = currentTime.toISOString().substr(11, 8)

    state.currentVideoTime.textContent = currentTimeResult

    if (state.editModeStart) {

      let endTime = state.currentOriginalVideo.newEndTime || state.currentOriginalVideo.endTime

      if (endTime < state.video.currentTime) {

        state.invalidPosition = true

        state.editingInstructions.innerText = 'Starting position cannot be placed after the ending position'

        state.editingInstructions.style.background = 'red'

      } else {

        state.invalidPosition = false

        state.editingInstructions.innerText = 'Click to save new starting position'

        state.editingInstructions.style.background = 'green'
      }
    }

    if (state.editModeEnd) {

      let startTime = state.currentOriginalVideo.newStartTime || state.currentOriginalVideo.startTime

      if (startTime > state.video.currentTime) {

        state.invalidPosition = true

        state.editingInstructions.innerText = 'Ending position cannot be placed before the starting position'

        state.editingInstructions.style.background = 'red'

      } else {

        state.invalidPosition = false

        state.editingInstructions.innerText = 'Click to save new ending position'

        state.editingInstructions.style.background = 'green'
      }
    }

    if (state.trimming === true) {

      if (state.startTrimTime > state.video.currentTime) {

        state.currentlyActiveModule.videoContainerOptions.instructions.innerText = 'Cannot set trim end time before trim start time'
        state.currentlyActiveModule.videoContainerOptions.instructions.style['background-color'] = 'red'

      } else {

        state.currentlyActiveModule.videoContainerOptions.instructions.innerText = 'Click again to end trim'
        state.currentlyActiveModule.videoContainerOptions.instructions.style['background-color'] = 'initial'
      } 
    }

    if (state.preview) {

      if (state.video.paused) {

        state.previewOptionsContainer.style.display = 'flex'

      } else {

        state.previewOptionsContainer.style.display = 'none'
      }
    }

    if (e.type === 'keydown') {

      if (e.which === 32) {

        e.preventDefault()

        togglePlay()
      }

      if (e.which === 37) {

        e.preventDefault()

        if (state.video.currentTime > 0) state.video.currentTime -= 0.1
      }

      if (e.which === 39) {

        e.preventDefault()

        if (state.video.currentTime < state.video.duration) state.video.currentTime += 0.1
      }
    }

    if (e.type === 'input') {

      e.preventDefault()

      state.video.currentTime = parseFloat(this.value)
    }

    if (e.type === 'timeupdate') state.sliderInput.value = state.video.currentTime.toString()

    if (state.video.paused) {

      state.playButton.lastChild.nodeValue = 'Play'
      state.playButton.firstElementChild.className = 'fa fa-play'
    }
  }

  function showControls () {

    clearTimeout(state.timeoutFunction)

    state.timeoutFunction = null

    state.videoControls.style.display = 'block'
    state.video.style.cursor = 'default'

    if (!state.timeoutFunction) {

      let test = setTimeout(function () {

        state.videoControls.style.display = 'none'
        state.video.style.cursor = 'none'

      }, 2000)

      state.timeoutFunction = test
    }
  }

  function togglePlay () {

    if (state.video.paused) {

      state.video.play()

      state.playButton.lastChild.nodeValue = 'Pause'
      state.playButton.firstElementChild.className = 'fa fa-pause'

    } else {

      state.video.pause()

      state.playButton.lastChild.nodeValue = 'Play'
      state.playButton.firstElementChild.className = 'fa fa-play'
    }
  }

  function restart () {

    if (state.restartButton.classList.contains('disabled')) return

    if (state.preview) {
     
      state.video.load()
      state.video.play()

      if (state.playButton.classList.contains('disabled')) disbleButtons([state.playButton])

    } else {

      state.video.currentTime = 0
    }

    if (state.video.paused) {

      state.video.play()

      state.playButton.lastChild.nodeValue = 'Pause'
      state.playButton.firstElementChild.className = 'fa fa-pause'
    }
  }

  function changeVolume (e) {

    if (state.volumeLi.classList.contains('disabled')) return

    state.video.volume = this.value

    let volume = parseFloat(state.video.volume)

    if (volume === 0) state.volumeIcon.className = 'fa fa-volume-off'
    if (volume > 0)  state.volumeIcon.className = 'fa fa-volume-down'
    if (volume > 0.5)  state.volumeIcon.className = 'fa fa-volume-up'
  }

  function mute (e) {

    if (state.volumeLi.classList.contains('disabled')) return

    state.video.volume = '0'
    state.volume.value = '0'
    state.volumeIcon.className = 'fa fa-volume-off'
  }

  function fullscreen () {

    if (state.fullscreenButton.classList.contains('disabled')) return

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

      state.video.style.width = '100%'
      state.video.style.height = '100%'
      state.video.style.position = 'fixed'
      state.video.style.top = '0'
      state.video.style.left = '0'
      state.video.style['z-index'] = '999'
      state.video.style['background-color'] = 'black'

      state.videoControls.style.position = 'fixed'
      state.videoControls.style.width = '100%'
      state.videoControls.style.bottom = '0'
      state.videoControls.style.left = '0'
      state.videoControls.style.margin = '0'
      state.videoControls.style.padding = '15px'
      state.videoControls.style['z-index'] = '999'
      state.videoControls.style['background-color'] = 'rgba(0, 0, 0, 0.9)'

      state.timer.style.color = 'white'
      
      state.fullscreenButton.style['flex-grow'] = '1'
      state.fullscreenButton.firstElementChild.style.float = 'right'

      state.video.addEventListener('mousemove', showControls)
      state.videoControls.addEventListener('mousemove', clearTimeFunction)
    }
  }

  function fullscreenHandler () {

    let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) {

      clearTimeout(state.timeoutFunction)

      state.timeoutFunction = null
      state.video.removeEventListener('mousemove', showControls)
      state.videoControls.removeEventListener('mousemove', clearTimeFunction)
      state.videoControls.style.display = 'block'

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

    state.video.style.width = 'initial'
    state.video.style.height = '100%'
    state.video.style.position = 'initial'
    state.video.style.top = 'initial'
    state.video.style.left = 'initial'
    state.video.style['z-index'] = 'initial'
    state.video.style['background-color'] = 'initial'

    state.videoControls.style.position = 'initial'
    state.videoControls.style.width = 'initial'
    state.videoControls.style.bottom = 'initial'
    state.videoControls.style.left = 'initial'
    state.videoControls.style.margin = 'initial'
    state.videoControls.style.padding = 'initial'
    state.videoControls.style.margin = '0px 20px 0px 20px'
    state.videoControls.style['z-index'] = 'initial'
    state.videoControls.style['background-color'] = 'initial'

    state.timer.style.color = 'initial'
    
    state.fullscreenButton.style['flex-grow'] = 'initial'
    state.fullscreenButton.firstElementChild.style.float = 'initial'
  }

  function clearTimeFunction () {

    if (state.timeoutFunction) {

      clearTimeout(state.timeoutFunction)

      state.timeoutFunction = null
    }
  }

  function closeVideoModule () {

    state.parentContainer.parentNode.removeChild(state.parentContainer)
  }

  return {
    trimVideo
  }

})()
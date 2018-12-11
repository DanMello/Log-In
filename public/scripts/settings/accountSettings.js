//views/pages/settings/index.ejs  <-- Where this is being used
let settingsModule = (function () {

  window.onload = function () {

    let url = new URL(window.location.href)
    let focus = url.searchParams.get('focus')
    let input = url.searchParams.get('input')

    if (!!focus) {

      let focusButton = document.querySelector('#' + focus)
      let menuFunction = showMenu.bind(focusButton)

      menuFunction()

      let parentForm = focusButton.parentElement

      while (parentForm.tagName !== 'FORM') {

        parentForm = parentForm.parentElement
      }

      parentForm.querySelector(`input[name=${input}]`).focus()
      
    }

  }

  //DOM reference to be reused for all query selections
  let subContainer = document.querySelector('#subContainer')
  
  //Edit and cancel buttons events
  let buttons = subContainer.querySelectorAll('.editbutton').forEach(button => button.addEventListener('click', showMenu))
  let cancelButton = subContainer.querySelectorAll('.hideMenu').forEach(button => button.addEventListener('click', hideMenu))

  //Submit buttons for each form 
  let submitButtons = subContainer.querySelectorAll('.newButton').forEach(button => button.addEventListener('click', editProfile))

  //Arrays to track progress
  let activeContainer = []
  let existingElements = []

  //Functions
  function showMenu () {

    if (this.classList.contains('disabled')) return false
    if (existingElements.length > 0) {

      existingElements.forEach(element => {

        element.parentElement.removeChild(element)
        existingElements.pop()

      })

    }
    if (activeContainer.length > 0) {

      activeContainer.forEach(container => {

        container.classList.add('hidden')
        container.classList.remove('showing')

        container
          .parentElement
          .querySelector('.disabled')
          .classList
          .remove('disabled')
      })

      activeContainer.pop()
    }

    this.classList.add('disabled')

    let parentForm = this.parentElement

    while (parentForm.tagName !== 'FORM') {

      parentForm = parentForm.parentElement
    }

    Array.from(parentForm.children).forEach(children => {

      if (children.classList.contains('hidden')) {

        children.classList.remove('hidden')
        children.classList.add('showing')
        activeContainer.push(children)
      }

    })

  }

  function hideMenu () {

    let hideThisContainer = this.parentElement

    while (!hideThisContainer.classList.contains('showing')) {

      hideThisContainer = hideThisContainer.parentElement
    }

    hideThisContainer.classList.remove('showing')
    hideThisContainer.classList.add('hidden')

    hideThisContainer
      .parentElement
      .querySelector('.disabled')
      .classList
      .remove('disabled')

    activeContainer.pop()
  }

  function editProfile (e) {

    e.preventDefault()

    this.disabled = true
    this.style.opacity = '.3'

    let parentForm = this.parentElement

    while (parentForm.tagName !== 'FORM') {

      parentForm = parentForm.parentElement
    }

    let inputList = parentForm.querySelectorAll('input[type="text"], input[type="password"')

    let inputArrayFromList = Array.from(inputList).reduce((inputObj, input) => {

      inputObj[input.name] = input.value

      return inputObj

    }, {})

    fetch(window.location.origin + '/account/settings/' + parentForm.id, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(inputArrayFromList)
    }).then(res => {

      return res.json()

    }).then(resJson => {

      if (resJson.error) throw new Error(resJson.message)
      if (resJson.success) {

        let responseHanlderFunction = responseHanlder.bind(this)

        responseHanlderFunction(resJson.message, 'success')

        if (parentForm.id !== 'changeEmail') {

          setTimeout(function () {

            let urlwithoutParams =  location.origin + location.pathname
            
            location.replace(urlwithoutParams)

          }, 5000)
        }

      }

    }).catch(err => {

      let responseHanlderFunction = responseHanlder.bind(this)

      responseHanlderFunction(err.message, 'error')

      this.disabled = false
      this.style.opacity = '1'
    })

  }

  function responseHanlder (message, id) {

    let parentForm = this.parentElement

    while (parentForm.tagName !== 'FORM') {

      parentForm = parentForm.parentElement
    }

    this.parentForm = parentForm

    let currentElement = parentForm.querySelector('#' + id)
    let createElementFunction = createElement.bind(this)

    if (existingElements.length > 0) {

      existingElements.forEach(element => {

        if (element.innerHTML !== message) {

          parentForm.removeChild(element)

          createElementFunction(message, id)
        }
        
      })

    } else {

      createElementFunction(message, id)
    }

    return false
  }

  function createElement (message, id) {

    existingElements.pop()

    let element = document.createElement('div')
    let referenceNode = this.parentForm.lastElementChild

    element.innerHTML = message
    element.id = id

    this.parentForm.insertBefore(element, referenceNode)
      
    this.element = element
    this.event = removeElement.bind(this)

    this.parentForm.addEventListener('click', this.event)

    existingElements.push(element)
  }

  function removeElement(e) {

    if (e.target.className === 'hideMenu') {

      this.parentForm.removeChild(this.element)
      this.parentForm.removeEventListener('click', this.event)

      existingElements.pop()
    }

  }

})()
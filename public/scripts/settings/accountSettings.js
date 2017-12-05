//views/pages/settings/index.ejs  <-- Where this is being used
let settingsModule = (function () {

  //DOM reference to be reused for all query selections
  let subContainer = document.querySelector('#subContainer')
  
  //Edit and cancel buttons events
  let buttons = subContainer.querySelectorAll('.editbutton').forEach(button => button.addEventListener('click', showMenu))
  let cancelButton = subContainer.querySelectorAll('.hideMenu').forEach(button => button.addEventListener('click', hideMenu))
  
  //Submit buttons for each form 
  let changeEmailButton = subContainer.querySelector('#changeEmail')
  let changeUsernameButton = subContainer.querySelector('#changeUsername')
  let changePasswordButton = subContainer.querySelector('#passwordButton')

  //Events
  changePasswordButton.addEventListener('click', changePassword)
  changeUsernameButton.addEventListener('click', changeUserName)
  changeEmailButton.addEventListener('click', changeEmail)

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

    console.log(existingElements)

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

  function changeEmail (e) {

    e.preventDefault()

    changeEmailButton.disabled = true
    changeEmailButton.style.opacity = '.3'

    let emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    let email = subContainer
      .querySelector('input[name="email"]')
      .value

    let password = subContainer
      .querySelector('input[name="emailPassword"')
      .value

    if (!emailTest.test(email)) {

      let responseHanlderFunction = responseHanlder.bind(this)

      responseHanlderFunction('Please enter a valid email*', 'error')

      changeEmailButton.disabled = false
      changeEmailButton.style.opacity = '1'

    } else {

      fetch('http://localhost/account/settings/changeEmail', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      }).then(res => {

        return res.json()

      }).then(resJson => {

        if (resJson.error) throw new Error(resJson.message)
        if (resJson.success) {

          let responseHanlderFunction = responseHanlder.bind(this)

          responseHanlderFunction(resJson.message, 'success')
        }

      }).catch(err => {

        let responseHanlderFunction = responseHanlder.bind(this)

        responseHanlderFunction(err.message, 'error')

        changeEmailButton.disabled = false
        changeEmailButton.style.opacity = '1'
      })

    } 

  }

  function changeUserName (e) {

    e.preventDefault()

    changeUsernameButton.disabled = true
    changeUsernameButton.style.opacity = '.3'

    let username = subContainer
      .querySelector('input[name="username"]')
      .value

    let password = subContainer
      .querySelector('input[name="usernamePassword"')
      .value

    fetch('http://localhost/account/settings/changeUserName', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }, 
      credentials: 'include',
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => {

      return res.json()

    }).then(resJson => {

      if (resJson.error) throw new Error(resJson.message)
      if (resJson.success) {

        let responseHanlderFunction = responseHanlder.bind(this)

        responseHanlderFunction(resJson.message, 'success')

        setTimeout(function(){ location.reload() }, 5000)
      }

    }).catch(err => {

      let responseHanlderFunction = responseHanlder.bind(this)

      responseHanlderFunction(err.message, 'error')

      changeUsernameButton.disabled = false
      changeUsernameButton.style.opacity = '1'
    })

  }

  function changePassword (e) {

    e.preventDefault()

    changePasswordButton.disabled = true
    changePasswordButton.style.opacity = '.3'

    let currentPassword = subContainer
      .querySelector('input[name="currentpassword"]')
      .value

    let passwordOne = subContainer
      .querySelector('input[name="passwordValueOne"')
      .value

    let passwordTwo = subContainer
      .querySelector('input[name="passwordValueTwo"')
      .value

    fetch('http://localhost/account/settings/changePassword', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }, 
      credentials: 'include',
      body: JSON.stringify({
        currentPassword,
        passwordOne,
        passwordTwo
      })
    }).then(res => {

      return res.json()

    }).then(resJson => {

      if (resJson.error) throw new Error(resJson.message)
      if (resJson.success) {

        let responseHanlderFunction = responseHanlder.bind(this)

        responseHanlderFunction(resJson.message, 'success')

        setTimeout(function(){ location.reload() }, 5000)
      }

    }).catch(err => {

      let responseHanlderFunction = responseHanlder.bind(this)

      responseHanlderFunction(err.message, 'error')

      changePasswordButton.disabled = false
      changePasswordButton.style.opacity = '1'
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
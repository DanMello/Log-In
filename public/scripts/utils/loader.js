function addLoader (parentElement, loadingMessage, fontsize, ajaxLoader) {

  let loadingContainer = document.createElement('div')
  let loader = document.createElement('img')
  let message = document.createElement('span')

  loadingContainer.id = 'loaderContainer'
  loadingContainer.style.display = 'flex'
  loadingContainer.style.width = '100%'
  loadingContainer.style.height = '100%'
  loadingContainer.style['justify-content'] = 'center'
  loadingContainer.style['align-items'] = 'center'
  loadingContainer.style['margin-right'] = '10px'

  loader.src = '/images/loaders/' + ajaxLoader
  loader.style.width = fontsize + 5 + 'px'
  loader.style.height = fontsize + 5 + 'px'
  loader.style['margin-right'] = "5px"
  loader.style['margin-top'] = '5px'

  message.style['font-size'] = fontsize + 'px'
  message.innerText = loadingMessage

  let childRefernce = parentElement.firstElementChild || null

  parentElement.insertBefore(loadingContainer, childRefernce)
  loadingContainer.appendChild(loader)
  loadingContainer.appendChild(message)

  return loadingContainer
}

function removeLoader (loader) {

  if (!!loader) {

    loader.parentElement.removeChild(loader)

  } else {

    let loaderContainer = document.getElementById('loaderContainer')

    if (loaderContainer !== null) {

      loaderContainer.parentElement.removeChild(loaderContainer)
    }
  }
}



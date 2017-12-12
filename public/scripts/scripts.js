function addLoader () {

  let loaderContainer = document.createElement('div')
  let loader = document.createElement('img')

  let loaderContainerStyles = {
    'width':'100%',
    'height':'100%',
    'position':'absolute',
    'top':'0',
    'display':'flex',
    'justify-content':'center',
    'align-items':'center',
    'background-color': 'rgba(255, 255, 255, 1)',
    'z-index':'999'
  }

  let loaderContainerStyle = loaderContainer.style

  for (const prop in loaderContainerStyles) {

    loaderContainerStyle[prop] = loaderContainerStyles[prop]
  }

  loaderContainer.id = 'loaderContainer'
  loader.src = '/images/ajax-loader.gif'

  document.body.appendChild(loaderContainer)
  loaderContainer.appendChild(loader)
}

function removeLoader () {

  let loaderContainer = document.getElementById('loaderContainer')

  if (loaderContainer !== null) {

    loaderContainer.parentElement.removeChild(loaderContainer)
  }

}



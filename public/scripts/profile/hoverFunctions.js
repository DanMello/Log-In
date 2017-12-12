
let coverphotoCotainer = document.querySelectorAll('#coverphotoCotainer, #profilephotoCotainer').forEach(container => {

  container.addEventListener('mouseover', function () {
    
    this.lastElementChild.style.display = 'block'
  })

  container.addEventListener('mouseout', function () {

    this.lastElementChild.style.display = 'none'
  })

})

let navButtons = document.querySelectorAll('.navLinks').forEach(link => {

  link.addEventListener('mouseover', function () {
    
    link.style.opacity = '.5'
  })

  link.addEventListener('mouseout', function () {

    link.style.opacity = '1'
  })

})

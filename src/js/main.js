const accordionBtns = document.querySelectorAll('.menu__item--expandable')

function openAccordionItems() {
	this.nextElementSibling.classList.toggle('active')
	this.querySelector('.fa-chevron-down').classList.toggle('rotate')
}

const URL = 'https://klajek-10-api.herokuapp.com/clips'

axios.get(URL).then(res=> {
	console.log(res.data.video)
})

accordionBtns.forEach(btn => btn.addEventListener('click', openAccordionItems))

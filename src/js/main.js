const accordionBtns = document.querySelectorAll('.menu__item--expandable')

function openAccordionItems() {
	this.nextElementSibling.classList.toggle('active')
	this.querySelector('svg').classList.toggle('rotate')
}

accordionBtns.forEach(btn => btn.addEventListener('click', openAccordionItems))

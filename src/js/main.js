const accordionBtns = document.querySelectorAll('.menu__item--expandable')

function openAccordionItems() {
	this.nextElementSibling.classList.toggle('active')
	this.querySelector('.fa-chevron-down').classList.toggle('rotate')
}

accordionBtns.forEach(btn => btn.addEventListener('click', openAccordionItems))

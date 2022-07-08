const clipTemplateTag = document.querySelector('.clip-template')
const galleryContainer = document.querySelector('.gallery__container')
const modalTemplateTag = document.querySelector('.modal-template')
const modalContainer = document.querySelector('.modal-container')

const accordionBtns = document.querySelectorAll('.menu__item--expandable')
const accordionInfos = document.querySelectorAll('.accordion__info')
const burgerNav = document.querySelector('.nav__burger-nav')
const burgerBtn = document.querySelector('.burger-btn')
const firstBar = document.querySelector('.burger-btn__bar--one')
const secondBar = document.querySelector('.burger-btn__bar--two')
const thirdBar = document.querySelector('.burger-btn__bar--three')

const loaderBox = document.querySelector('.loader-box')
const pageTitle = document.querySelector('.page-title')
const body = document.body

const URL = `https://klajek-10-api.herokuapp.com/clips`

const handleNav = () => {
	accordionInfos.forEach(el => {
		el.classList.remove('active')
		el.previousElementSibling.querySelector('svg').classList.remove('rotate')
	})
	burgerNav.classList.toggle('active-menu')
	document.body.classList.toggle('body-lock')
	firstBar.classList.toggle('first-cross')
	thirdBar.classList.toggle('third-cross')
	secondBar.classList.toggle('second-cross')
}

function openAccordionItems() {
	this.nextElementSibling.classList.toggle('active')
	this.querySelector('svg').classList.toggle('rotate')
}

axios
	.get(URL)
	.then(res => {
		const bodySymbol = body.dataset.symbol

		const data = res.data[bodySymbol].content
		const arrLength = data.length

		pageTitle.textContent = res.data[bodySymbol].category
		document.title = 'UEFA RAP - ' + res.data[bodySymbol].category

		const createThumbnail = () => {
			data.forEach(el => {
				const clipTemplate = clipTemplateTag.content.cloneNode(true)
				const clipItem = clipTemplate.querySelector('.clip-item')
				const clipNumberSpan = clipTemplate.querySelector('.clip-number-span')
				const clipThumbnail = clipTemplate.querySelector('.thumbnail')

				const id = el.id
				const thumbnail = el.thumbnail
				const clipName = `${bodySymbol}${id + 1}`

				clipItem.dataset.index = id
				clipNumberSpan.textContent = clipName
				clipThumbnail.setAttribute('src', thumbnail)
				clipThumbnail.setAttribute('alt', `Klip nr ${clipName}`)

				galleryContainer.appendChild(clipTemplate)
			})
		}

		createThumbnail()
		if (galleryContainer.innerHTML != '') {
			loaderBox.style.display = 'none'
		}

		const clips = document.querySelectorAll('.clip-item')
		const showModal = e => {
			modalContainer.classList.remove('hidden')
			body.classList.add('body-lock')
			const modalTemplate = modalTemplateTag.content.cloneNode(true)
			const closeBtn = modalTemplate.querySelector('.close')
			const decisionBtn = modalTemplate.querySelector('.decision')
			const modalTitle = modalTemplate.querySelector('.clip-title')
			const iframeBox = modalTemplate.querySelector('.iframe')
			const decisionBox = modalTemplate.querySelector('.decision-box')
			const decisionImgBox = modalTemplate.querySelector('.decision-img')
			const nextBtn = modalTemplate.querySelector('.next-btn')
			const previousBtn = modalTemplate.querySelector('.previous-btn')
			const modalBox = modalTemplate.querySelector('.modal__box')

			const putData = () => {
				const clipId = parseInt(e.target.dataset.index)
				const video = data[clipId].video
				const decisionImg = data[clipId].decision
				const clipName = `${bodySymbol}${clipId + 1}`

				modalBox.dataset.index = clipId
				iframeBox.setAttribute('src', video)
				decisionImgBox.setAttribute('src', decisionImg)
				decisionImgBox.setAttribute('alt', `Decyzja klipu ${clipName}`)
				modalTitle.textContent = clipName
				modalContainer.appendChild(modalTemplate)
			}

			putData()

			const closeModal = parent => {
				modalContainer.classList.add('hidden')
				body.classList.remove('body-lock')
				while (parent.firstChild) {
					parent.removeChild(parent.firstChild)
				}
			}

			const toggleVisibility = item => {
				item.classList.toggle('hidden')
			}

			decisionBtn.addEventListener('click', () => {
				toggleVisibility(decisionBox)
			})
			closeBtn.addEventListener('click', () => {
				closeModal(modalContainer)
			})
			modalContainer.addEventListener('click', e => {
				if (e.target.classList.value == 'modal__container modal-container' || e.target.classList.value == 'modal') {
					closeModal(modalContainer)
				}
			})

			const nextClip = e => {
				const modalBox = e.target.closest('.modal__box')
				const iframe = modalBox.querySelector('.iframe')
				const decisionImg = modalBox.querySelector('.decision-img')
				const title = modalBox.querySelector('.clip-title')

				let clipIndex = parseInt(modalBox.dataset.index)

				const nextData = data[clipIndex + 1]
				if (clipIndex === arrLength - 1) {
					modalBox.dataset.index = clipIndex
					const nextBtn = e.target.closest('.modal__box').querySelector('.next-btn')
					nextBtn.classList.add('hidden')
				} else {
					iframe.setAttribute('src', nextData.video)
					decisionImg.setAttribute('src', nextData.decision)
					let newIndex = clipIndex + 1
					title.textContent = `${bodySymbol}${newIndex + 1}`
					modalBox.dataset.index = newIndex
				}
			}

			const previousClip = e => {
				const modalBox = e.target.closest('.modal__box')
				const iframe = modalBox.querySelector('.iframe')
				const decisionImg = modalBox.querySelector('.decision-img')
				const title = modalBox.querySelector('.clip-title')

				let clipIndex = parseInt(modalBox.dataset.index)

				const nextData = data[clipIndex - 1]

				if (clipIndex === 0) {
					const previousBtn = e.target.closest('.modal__box').querySelector('.previous-btn')
					previousBtn.classList.add('hidden')
				} else {
					iframe.setAttribute('src', nextData.video)
					decisionImg.setAttribute('src', nextData.decision)
					let newIndex = clipIndex - 1
					title.textContent = `${bodySymbol}${clipIndex}`
					modalBox.dataset.index = newIndex
				}
			}
			nextBtn.addEventListener('click', e => {
				const modalIndex = parseInt(e.target.closest('.modal__box').dataset.index)
				if (modalIndex !== -1) {
					const previousBtn = e.target.closest('.modal__box').querySelector('.previous-btn')
					previousBtn.classList.remove('hidden')
				}
				if (modalIndex < arrLength - 1) {
					nextClip(e)
				} else {
					nextBtn.classList.add('hidden')
				}
			})

			previousBtn.addEventListener('click', e => {
				const modalIndex = parseInt(e.target.closest('.modal__box').dataset.index)
				if (modalIndex === arrLength - 1) {
					const nextBtn = e.target.closest('.modal__box').querySelector('.next-btn')
					nextBtn.classList.remove('hidden')
				}

				if (modalIndex === 0) {
					previousBtn.classList.add('hidden')
				} else {
					previousClip(e)
				}
			})
		}

		clips.forEach(clip => clip.addEventListener('click', showModal))
	})
	.catch(err => console.error(err))
accordionBtns.forEach(btn => btn.addEventListener('click', openAccordionItems))
burgerBtn.addEventListener('click', handleNav)

const clipTemplateTag = document.querySelector('.clip-template'),
	galleryContainer = document.querySelector('.gallery__container'),
	modalTemplateTag = document.querySelector('.modal-template'),
	modalContainer = document.querySelector('.modal-container'),
	accordionBtns = document.querySelectorAll('.menu__item--expandable'),
	accordionInfos = document.querySelectorAll('.accordion__info'),
	burgerNav = document.querySelector('.nav__burger-nav'),
	burgerBtn = document.querySelector('.burger-btn'),
	firstBar = document.querySelector('.burger-btn__bar--one'),
	secondBar = document.querySelector('.burger-btn__bar--two'),
	thirdBar = document.querySelector('.burger-btn__bar--three'),
	loaderBox = document.querySelector('.loader-box'),
	pageTitle = document.querySelector('.page-title'),
	body = document.body

const URL = `https://klajek-10-api.herokuapp.com/clips`

const handleNav = () => {
	const burgerNav = document.querySelector('.nav__burger-nav')
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

const closeNavOutsideBox = e => {
	e.stopPropagation()
	if (e.target.classList.contains('active-menu')) {
		burgerNav.classList.remove('active-menu')
		document.body.classList.remove('body-lock')
		firstBar.classList.remove('first-cross')
		thirdBar.classList.remove('third-cross')
		secondBar.classList.remove('second-cross')
	}
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
		const dataSymbol = res.data[bodySymbol]
		const arrLength = data.length

		const dictionaryTranslations = res.data.dictionary[bodySymbol]

		

		pageTitle.textContent = res.data[bodySymbol].category
		document.title = 'UEFA RAP - ' + res.data[bodySymbol].category

		const createThumbnail = () => {
			data.forEach(el => {
				const clipTemplate = clipTemplateTag.content.cloneNode(true),
					clipItem = clipTemplate.querySelector('.clip-item'),
					clipNumberSpan = clipTemplate.querySelector('.clip-number-span'),
					clipThumbnail = clipTemplate.querySelector('.thumbnail')

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

			const modalTemplate = modalTemplateTag.content.cloneNode(true),
				closeBtn = modalTemplate.querySelector('.close'),
				decisionBtn = modalTemplate.querySelector('.decision'),
				helpBtn = modalTemplate.querySelector('.help-svg'),
				dictionary = modalTemplate.querySelector('.dictionary'),
				modalTitle = modalTemplate.querySelector('.clip-title'),
				iframeBox = modalTemplate.querySelector('.iframe'),
				decisionBox = modalTemplate.querySelector('.decision-box'),
				decisionImgBox = modalTemplate.querySelector('.decision-img'),
				nextBtn = modalTemplate.querySelector('.next-btn'),
				previousBtn = modalTemplate.querySelector('.previous-btn'),
				modalBox = modalTemplate.querySelector('.modal__box'),
				decisionTranslation = modalTemplate.querySelector('.decision-translation'),
				additionalExplanationImg = modalTemplate.querySelector('.additional-img')

				if(!dictionaryTranslations){
					helpBtn.style.display = "none"
				}

			const addTranslation = () => {
				for (const item in dictionaryTranslations) {
					const p = document.createElement('p')
					p.innerHTML = `<span>${item}</span> - ${dictionaryTranslations[item]}`
					dictionary.append(p)
				}
			}

			addTranslation()

			const toggleDictionary = () => {
				dictionary.classList.toggle('none')
			}

			helpBtn.addEventListener('click', toggleDictionary)

			const putData = () => {
				const clipId = parseInt(e.target.dataset.index)
				const video = data[clipId].video
				const decisionImg = data[clipId].decision
				const clipName = `${bodySymbol}${clipId + 1}`

				modalBox.dataset.index = clipId
				modalTitle.textContent = clipName
				iframeBox.setAttribute('src', video)
				decisionImgBox.setAttribute('src', decisionImg)
				decisionImgBox.setAttribute('alt', `Decyzja klipu ${clipName}`)
				if (dataSymbol.hasOwnProperty('translation')) {
					const translation = data[clipId].translation
					decisionTranslation.style.display = 'block'
					decisionTranslation.textContent = translation
				} else {
					decisionTranslation.style.display = 'none'
				}
				if (data[clipId].hasOwnProperty('additional-explanation')) {
					const additionalImg = data[clipId].explanation
					const additionalTranslate = data[clipId].translation
					decisionTranslation.style.display = 'block'
					additionalExplanationImg.setAttribute('src', additionalImg)
					additionalExplanationImg.setAttribute('alt', `Wyjaśnienie klipu ${clipName}`)
					decisionTranslation.textContent = additionalTranslate
				}

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

			const nextClip = e => {
				const modalBox = e.target.closest('.modal__box'),
					title = modalBox.querySelector('.clip-title'),
					iframe = modalBox.querySelector('.iframe'),
					decisionImg = modalBox.querySelector('.decision-img'),
					decisionTranslation = modalBox.querySelector('.decision-translation'),
					additionalExplanationImg = modalBox.querySelector('.additional-img')

				let clipIndex = parseInt(modalBox.dataset.index)

				const nextData = data[clipIndex + 1]

				let newIndex = clipIndex + 1
				const clipTitle = `${bodySymbol}${newIndex + 1}`
				title.textContent = clipTitle
				modalBox.dataset.index = newIndex

				if (clipIndex === arrLength - 1) {
					modalBox.dataset.index = clipIndex
					const nextBtn = e.target.closest('.modal__box').querySelector('.next-btn')
					nextBtn.classList.add('hidden')
				} else {
					iframe.setAttribute('src', nextData.video)
					decisionImg.setAttribute('src', nextData.decision)
					decisionImg.setAttribute('alt', `Decyzja klipu ${clipTitle}`)

					if (dataSymbol.hasOwnProperty('translation')) {
						const translation = nextData.translation
						decisionTranslation.textContent = translation
					}

					if (nextData.hasOwnProperty('additional-explanation') && !dataSymbol.hasOwnProperty('translation')) {
						if (nextData.hasOwnProperty('additional-explanation')) {
							const additionalImg = nextData.explanation
							const additionalTranslate = nextData.translation
							additionalExplanationImg.setAttribute('src', additionalImg)
							additionalExplanationImg.setAttribute('alt', `Wyjaśnienie klipu ${clipTitle}`)
							decisionTranslation.style.display = 'block'
							decisionTranslation.textContent = additionalTranslate
						}
					} else if (!nextData.hasOwnProperty('additional-explanation') && !dataSymbol.hasOwnProperty('translation')) {
						additionalExplanationImg.setAttribute('src', '')
						additionalExplanationImg.setAttribute('alt', '')
						decisionTranslation.textContent = ''
						decisionTranslation.style.display = 'none'
					}
				}
			}

			const previousClip = e => {
				const modalBox = e.target.closest('.modal__box'),
					iframe = modalBox.querySelector('.iframe'),
					decisionImg = modalBox.querySelector('.decision-img'),
					decisionTranslation = modalBox.querySelector('.decision-translation'),
					additionalExplanationImg = modalBox.querySelector('.additional-img'),
					title = modalBox.querySelector('.clip-title')

				let clipIndex = parseInt(modalBox.dataset.index)

				let newIndex = clipIndex - 1
				const clipTitle = `${bodySymbol}${clipIndex}`
				title.textContent = clipTitle
				modalBox.dataset.index = newIndex

				const prevData = data[clipIndex - 1]

				if (clipIndex === 0) {
					const previousBtn = e.target.closest('.modal__box').querySelector('.previous-btn')
					previousBtn.classList.add('hidden')
				} else {
					iframe.setAttribute('src', prevData.video)
					decisionImg.setAttribute('src', prevData.decision)
					decisionImg.setAttribute('alt', `Decyzja klipu ${clipTitle}`)
					if (dataSymbol.hasOwnProperty('translation')) {
						decisionTranslation.style.display = 'block'
						const translation = prevData.translation
						decisionTranslation.textContent = translation
					}

					if (prevData.hasOwnProperty('additional-explanation') && !dataSymbol.hasOwnProperty('translation')) {
						if (prevData.hasOwnProperty('additional-explanation')) {
							const additionalImg = prevData.explanation
							const additionalTranslate = prevData.translation
							additionalExplanationImg.setAttribute('src', additionalImg)
							additionalExplanationImg.setAttribute('alt', `Wyjaśnienie klipu ${clipTitle}`)
							decisionTranslation.style.display = 'block'
							decisionTranslation.textContent = additionalTranslate
						}
					} else if (!prevData.hasOwnProperty('additional-explanation') && !dataSymbol.hasOwnProperty('translation')) {
						additionalExplanationImg.setAttribute('src', '')
						additionalExplanationImg.setAttribute('alt', '')
						decisionTranslation.textContent = ''
						decisionTranslation.style.display = 'none'
					}
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
burgerNav.addEventListener('click', closeNavOutsideBox)

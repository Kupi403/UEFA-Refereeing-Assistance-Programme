const clipTemplateTag = document.querySelector('.clip-template')
const galleryContainer = document.querySelector('.gallery__container')
const modalTemplateTag = document.querySelector('.modal-template')
const modalContainer = document.querySelector('.modal-container')

const URL = `https://klajek-10-api.herokuapp.com/clips`

axios
	.get(URL)
	.then(res => {
		const bodySymbol = document.body.dataset.symbol

		const data = res.data[bodySymbol].content

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

		const clips = document.querySelectorAll('.clip-item')
		const showModal = e => {
			const modalTemplate = modalTemplateTag.content.cloneNode(true)
			const closeBtn = modalTemplate.querySelector('.close')
			const decisionBtn = modalTemplate.querySelector('.decision')
			const modalTitle = modalTemplate.querySelector('.clip-title')
			const iframeBox = modalTemplate.querySelector('.iframe')
			const decisionBox = modalTemplate.querySelector('.decision-box')
			const decisionImgBox = modalTemplate.querySelector('.decision-img')

			const clipId = parseInt(e.target.dataset.index)
			const video = data[clipId].video
			const decisionImg = data[clipId].decision
			const clipName = `${bodySymbol}${clipId + 1}`

			iframeBox.setAttribute('src', video)
			decisionImgBox.setAttribute('src', decisionImg)
			decisionImgBox.setAttribute('alt', `Decyzja klipu ${clipName}`)
			modalTitle.textContent = clipName
			modalContainer.appendChild(modalTemplate)

			const toggleDecisionVisibility = () => {
				decisionBox.classList.toggle('hidden')
			}

			const closeModal = parent => {
				while (parent.firstChild) {
					parent.removeChild(parent.firstChild)
				}
			}

			decisionBtn.addEventListener('click', toggleDecisionVisibility)
			closeBtn.addEventListener('click', () => {
				closeModal(modalContainer)
			})
			modalContainer.addEventListener('click', e => {
				if (e.target.classList.value == 'modal') {
					closeModal(modalContainer)
				}
			})
		}

		clips.forEach(clip => clip.addEventListener('click', showModal))
	})
	.catch(err => console.error(err))

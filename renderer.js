window.addEventListener('DOMContentLoaded', function() {
	const hashStatus = {
		filename: null,
		hmac: null,
		md5: false,
		md4: false,
		md2: false,
		sha1: false,
		sha256: false,
		sha384: false,
		sha512: false,
		ripemd160: false,
		adler32: false,
		ed2: false,
		crc32: false,
		tiger: false,
		panama: false
	}

	const selectElement = document.querySelector('#app #header .item .type-container')
	const titleSelected = document.querySelector('#app #header .item .type-container #datatype-title')
	const selectOptionElement = document.getElementById('datatype')
	const popupDialog = document.querySelector('#app #header .item .input-container .styling')
	const optionElements = [...selectOptionElement.children]
	const filenameElement = document.querySelector('#app #header .item .input-container #data-input')


	const keyWrapperElemenet = document.querySelector('#app #header .item .item-4 .key-wrapper')
	const keyInputElement = document.querySelector('#app #header .item .item-4-2 #key-input')
	const keyOptionElements = document.querySelector('.key-datatype')
	const keyTitleElement = document.querySelector('.key-title')


	const checkboxInputElements = [...document.querySelectorAll('.checkbox-input')]
	const hashOptionsInputs = document.querySelectorAll('.disabled')


	const calculateButton = document.getElementById('calculate')
	const closeButton = document.getElementById('close')
	const helpButton = document.getElementById('help')

	const hmacCheckbox = document.querySelector('#app #header .item #hmac')
	const fileRegex = /^([A-Z]{1}\:)(\\{2}\w+)*(\\{2}\w+\.\bjpg\b)$/gm
	const hexRegex = /[0-9A-F]+/gm
	const textRegex = /\w+/gm

	titleSelected.innerHTML = "File"
	keyTitleElement.innerHTML = "Text string"
	hmacCheckbox.checked = true

	if(!hmacCheckbox.checked) {
		keyInputElement.disabled = true
		checkboxInputElements.slice(9,13).forEach((checkbox) => {
			checkbox.parentNode.parentNode.classList.toggle('disappear')
		})
	}

	if(titleSelected.innerHTML == "File") {
		filenameElement.disabled = true
	}
	
	selectElement.onclick = function(e) {
		e.preventDefault()
		selectOptionElement.classList.toggle('disappear')
		return false
	}

	keyWrapperElemenet.onclick = function(e) {
		e.preventDefault()
		if(hmacCheckbox.checked) {
			keyOptionElements.classList.toggle('disappear')
		}
		return false
	}

	for(let child of optionElements) {
		child.onclick = function(e) {
			e.preventDefault()
			titleSelected.innerHTML = child.innerHTML
			selectOptionElement.classList.toggle('disappear')

			if(!/(File|Text string|Hex string)/gm.test(titleSelected.innerHTML)) {
				throw new Error("You change that value!!")
			} else {
				if(titleSelected.innerHTML === "File") {
					popupDialog.style.display = 'block'
					filenameElement.disabled = true
				} else {
					if(popupDialog.style.display = 'block') {
						popupDialog.style.display = 'none'
						filenameElement.disabled = false
					}
				}
			}

			return false
		}
	}

	/* clear all value if key input changed */
	keyInputElement.oninput = function(e) {
		if(localStorage.getItem("key") && localStorage.getItem("key") != e.target.value) {
			checkboxInputElements.forEach((checkbox) => {
				checkbox.checked = false
				checkbox.parentNode.nextElementSibling.value = ''
			})

			localStorage.removeItem("key")
		}
		return false
	}
 
	/* check hmac is enabled or disabled? */
	hmacCheckbox.onclick = function() {
		if(!hmacCheckbox.checked) {
			keyInputElement.disabled = true
			checkboxInputElements.slice(9,13).forEach((checkbox) => {
				checkbox.parentNode.parentNode.classList.add('disappear')
			})
		} else {
			keyInputElement.disabled = false
			checkboxInputElements.slice(9,13).forEach((checkbox) => {
				checkbox.parentNode.parentNode.classList.remove('disappear')
			})
		}
	}

	/* open dialog */
	popupDialog.onclick = function(e) {
		e.preventDefault()
		/* open file */
		var filename = window.context.filename()
		filenameElement.value = filename
		hashStatus['filename'] = filename
		return false
	}

	/* change hash status options */
	for(let checkboxInput of checkboxInputElements) {
		checkboxInput.onclick = function(e) {
			hashStatus[e.target.value] = e.target.checked
		}
	}

	for(let hashInput of hashOptionsInputs) {
		hashInput.oninput = function(e) {
			e.preventDefault()
			e.target.value = ''
			return false
		}
	}

	calculateButton.onclick = function(e) {
		e.preventDefault()
		var newStatus = window.context.sendInfo(hashStatus)
		if(hmacCheckbox.checked) {
			if(keyTitleElement.innerHTML === 'Text string' && textRegex.test(keyInputElement.value)) {
				hashStatus['hmac'] = keyInputElement.value
			} else if(keyTitleElement.innerHTML === 'Hex string' && hexRegex.test(keyInputElement.value)) {
				hashStatus['hmac'] = keyInputElement.value
			}
		}
		for(let checkboxInput of checkboxInputElements) {
			if(checkboxInput.checked) {
				checkboxInput.parentNode.nextElementSibling.value = newStatus[checkboxInput.value]
				checkboxInput.parentNode.nextElementSibling.disabled = true
			}
		}

		if(!localStorage.getItem('key')) {
			localStorage.setItem('key', keyInputElement.value)
		}
		return false
	}

	closeButton.onclick = function(e) {
		e.preventDefault()
		window.context.closeWin()
		return false
	}

	helpButton.onclick = function(e) {
		e.preventDefault()
		window.context.openHelpWin()
		return false
	}
})
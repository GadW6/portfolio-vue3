const exportTagArray = []
const exportSliderImagesArray = []
const tagSelector = document.querySelector('input[name="tags"]')
const sliderImagesSelector = document.querySelector('input[name="sliderImagesToFlatten"]')

const tagChecking = (tag) => {   
  if(tag.checked) {
    exportTagArray.push({ name: tag.value, image: tag.dataset.path, id: tag.dataset.id })
  } else {
    const tagIndex = exportTagArray.findIndex(el => el.name === tag.value)
    exportTagArray.splice(tagIndex, 1)
  }
  tagSelector.value = JSON.stringify(exportTagArray)
}

const imgChecking = (img) => {   
  if(img.checked) {
    exportSliderImagesArray.push(img.value)
  } else {
    const imgIndex = exportSliderImagesArray.findIndex(slider => slider === img.value)
    exportSliderImagesArray.splice(imgIndex, 1)
  }
  sliderImagesSelector.value = JSON.stringify(exportSliderImagesArray)
}

document.querySelectorAll('#technologies input[type="checkbox"]').forEach(tag => {
  if (tag.checked) {
    exportTagArray.push({ name: tag.value, image: tag.dataset.path, id: tag.dataset.id })
    tagSelector.value = JSON.stringify(exportTagArray)
  }
})

document.querySelectorAll('#sliderImagesToFlatten input[type="checkbox"]').forEach(sliderImg => {
  if (sliderImg.checked) {
    exportSliderImagesArray.push(sliderImg.value)
    sliderImagesSelector.value = JSON.stringify(exportSliderImagesArray)
  }
})

const datePicker = document.querySelector('#datePicker')
flatpickr(datePicker, {
  maxDate: new Date(),
  dateFormat: "Y-m-d",
  defaultDate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
})
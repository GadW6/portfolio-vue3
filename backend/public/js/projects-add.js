const exportTagArray = []
const tagChecking = (tag) => {    
  const tagSelector = document.querySelector('input[name="tags"]')
  if(tag.checked) {
    exportTagArray.push({ name: tag.value, image: tag.dataset.path })
  } else {
    const tagIndex = exportTagArray.findIndex(el => el.name === tag.value)
    exportTagArray.splice(tagIndex, 1)
  }
  tagSelector.value = JSON.stringify(exportTagArray)
}

const datePicker = document.querySelector('#datePicker')
flatpickr(datePicker, {
  maxDate: new Date(),
  dateFormat: "Y-m-d"
})
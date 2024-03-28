import './style.css'
import assets from './assets.js'

document.querySelector('#app').innerHTML = `
  <main>
  <section class="select-room">
    <h2>Select Room</h2>
    <button>Select nearby room</button>
    <button>Scan room QR-code</button>
  </section>
  <section class="add-asset">
    <h2>Add Asset</h2>
    <input type="text" placeholder="Search Asset...">
    <input type="text" placeholder="Asset ID">
    <textarea placeholder="Description..." rows=3></textarea
    <div class="add-asset-actions">
      <button class="take-photo">Take photo of asset</button>
      <button>Scan EAN</button>
    </div>
    <button class="confirm-button">CONFIRM ASSET</button>
  </section>
  <section>
  <img src="./qr.png" width="200px" />
  </section>
</main>
`

const searchInput = document.querySelector('.add-asset input')
searchInput.addEventListener('input', autocomplete)

function handleSuggestionClick(event) {
  if (event.target.tagName === 'LI') {
    console.log(event.target)
    searchInput.value = event.target.textContent
    // Optionally, clear the suggestion list after selection
    // suggestionList.remove()
  }
}

document.addEventListener('click', handleClickOutside)

function handleClickOutside(event) {
  if (
    !searchInput.contains(event.target) &&
    !event.target.classList.contains('suggestion-list')
  ) {
    const existingList = searchInput.parentNode.querySelector('ul')
    if (existingList) {
      existingList.remove()
    }
  }
}

function autocomplete() {
  const inputText = searchInput.value.toLowerCase()
  const suggestions = assets.filter((asset) =>
    asset.toLowerCase().includes(inputText)
  )

  const existingList = searchInput.parentNode.querySelector('ul')
  if (existingList) {
    existingList.remove()
  }

  if (suggestions.length > 0) {
    const suggestionList = createSuggestionList(suggestions)
    searchInput.parentNode.appendChild(suggestionList)
    suggestionList.addEventListener('click', handleSuggestionClick) // Add event listener here
  }
}

function createSuggestionList(suggestions) {
  const suggestionList = document.createElement('ul')
  suggestionList.classList.add('suggestion-list') // Add a class for styling

  suggestions.forEach((asset) => {
    const suggestionItem = document.createElement('li')
    suggestionItem.textContent = asset
    suggestionList.appendChild(suggestionItem)
  })

  positionSuggestionList(suggestionList)

  return suggestionList
}

function positionSuggestionList(list) {
  const inputRect = searchInput.getBoundingClientRect()
  list.style.position = 'absolute'
  list.style.left = inputRect.left + 'px'
  list.style.top = inputRect.bottom + 'px'
  list.style.width = inputRect.width + 'px' // Match the width of the input field
}

//=========================

const confirmButton = document.querySelector('.confirm-button')
confirmButton.addEventListener('click', handleConfirm)

function handleConfirm() {
  const confirmButton = document.querySelector('.confirm-button')
  const guidLabel = document.createElement('p') // Create a paragraph element for the label

  // Generate a GUID
  const guid = generateGUID()
  guidLabel.textContent = `Generated Asset ID: ${guid}` // Set label text with GUID

  // Insert the label element before the CONFIRM button
  confirmButton.parentNode.insertBefore(guidLabel, confirmButton)

  // Optional actions after confirmation (can be removed if not needed)
  // ...
}

function generateGUID() {
  // Use a library or a reliable method to generate a GUID
  // Here's a simplified example for demonstration (not cryptographically secure)
  const randomValues = Array(16)
    .fill(null)
    .map(() => Math.floor(Math.random() * 256))
  return randomValues
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('-')
}

//=========================

// ... (Rest of your code)

// Add a label for GPS coordinates above the "Select nearby room" button
const selectRoomSection = document.querySelector('.select-room')
const coordinatesLabel = document.createElement('p')
coordinatesLabel.id = 'coordinates-label' // Add an ID for styling or reference
coordinatesLabel.textContent = 'Fetching GPS coordinates...' // Initial text
selectRoomSection.insertBefore(
  coordinatesLabel,
  selectRoomSection.querySelector('button')
)

// Function to get GPS coordinates (if available)
function getCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        coordinatesLabel.textContent = `Coordinates: ${latitude}, ${longitude}`
      },
      (error) => {
        console.error('Error getting GPS coordinates:', error)
        coordinatesLabel.textContent = 'Unable to retrieve GPS coordinates.'
      }
    )
  } else {
    coordinatesLabel.textContent =
      'Geolocation is not supported by this browser.'
  }
}

// Retrieve GPS coordinates initially
getCoordinates()

//=========================

const takePhotoButton = document.querySelector('button.take-photo')
takePhotoButton.addEventListener('click', takePhoto)

function takePhoto() {
  navigator.mediaDevices
    .getUserMedia({ video: { maxWidth: 640, maxHeight: 480 } }) // Set video constraints
    .then(function (stream) {
      const video = document.createElement('video')
      video.srcObject = stream
      document.body.appendChild(video)
      video.play()

      const captureButton = document.createElement('button')
      captureButton.textContent = 'Capture'
      captureButton.addEventListener('click', function () {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        video.srcObject.getVideoTracks().forEach((track) => track.stop())

        const capturedImage = new Image()
        capturedImage.src = canvas.toDataURL('image/png')

        // Optimize image display (set width/height or use CSS)
        capturedImage.style.width = '300px' // Example width for display
        document.body.appendChild(capturedImage)

        video.remove()
        captureButton.remove()
      })
      document.body.appendChild(captureButton)
    })
    .catch(function (error) {
      console.error('Error accessing camera:', error)
    })
}

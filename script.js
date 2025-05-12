// Get references to HTML elements
const districtNameInput = document.getElementById('districtName');
const previewDistrictName = document.getElementById('previewDistrictName');
const districtFontSizeInput = document.getElementById('districtFontSize');
const photoUploadInput = document.getElementById('photoUpload');
const previewPhoto = document.getElementById('previewPhoto');
const photoPositionXInput = document.getElementById('photoPositionX');
const photoPositionYInput = document.getElementById('photoPositionY');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const patronymicInput = document.getElementById('patronymic');
const previewFullName = document.getElementById('previewFullName');
const dobInput = document.getElementById('dob');
const previewDob = document.getElementById('previewDob');
const logoUploadInput = document.getElementById('logoUpload');
const previewLogo = document.getElementById('previewLogo');
const barcodeElement = document.getElementById('barcode');
const downloadBtn = document.getElementById('downloadBtn');
const idCardPreview = document.getElementById('id-card-preview');
const documentNumberElement = document.getElementById('documentNumber');
const cardPaddingInput = document.getElementById('cardPadding');
const infoSpacingInput = document.getElementById('infoSpacing');
const backgroundUploadInput = document.getElementById('backgroundUpload');

// Color inputs
const cardBgColorInput = document.getElementById('cardBgColor');
const cardTextColorInput = document.getElementById('cardTextColor');
const districtTextColorInput = document.getElementById('districtTextColor');
const cardBorderColorInput = document.getElementById('cardBorderColor');

// Function to generate document number
function generateDocumentNumber(firstName, lastName, dob) {
	// Basic generation: First initial + Last initial + DOB (YYYYMMDD)
	const firstInitial = firstName.charAt(0).toUpperCase();
	const lastInitial = lastName.charAt(0).toUpperCase();
	const dobFormatted = dob.replace(/-/g, ''); // Remove hyphens from date
	if (firstInitial && lastInitial && dobFormatted) {
		return `${firstInitial}${lastInitial}${dobFormatted}`;
	}
	return '1234567890'; // Default number if info is missing
}

// Function to update barcode
function updateBarcode() {
	const fullName =
		`${firstNameInput.value} ${lastNameInput.value} ${patronymicInput.value}`.trim();
	if (fullName) {
		// Encode the full name in CODE128 format
		JsBarcode('#barcode', fullName, {
			format: 'CODE128',
			displayValue: false, // Don't display the text below the barcode
			height: 30, // Adjust height
			width: 1, // Adjust bar width
			margin: 0,
			flat: true, // Use flat design
			// Barcode background is transparent by default with SVG
		});
	} else {
		// Clear barcode if name is empty
		barcodeElement.innerHTML = '';
	}
}

// Function to update the preview and document number
function updatePreview() {
	const firstName = firstNameInput.value;
	const lastName = lastNameInput.value;
	const patronymic = patronymicInput.value;
	const dob = dobInput.value;

	const fullName = `${firstName} ${lastName} ${patronymic}`.trim();
	previewFullName.textContent = fullName || 'First Last Patronymic';
	previewDob.textContent = dob || 'YYYY-MM-DD';

	// Update document number
	documentNumberElement.textContent = `Document No: ${generateDocumentNumber(
		firstName,
		lastName,
		dob
	)}`;

	// Update barcode
	updateBarcode();
}

// Event Listeners for text inputs
districtNameInput.addEventListener('input', (e) => {
	previewDistrictName.textContent = e.target.value || 'District Name';
});

districtFontSizeInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty(
		'--district-font-size',
		`${e.target.value}px`
	);
});

firstNameInput.addEventListener('input', updatePreview);
lastNameInput.addEventListener('input', updatePreview);
patronymicInput.addEventListener('input', updatePreview);
dobInput.addEventListener('input', updatePreview); // Update on DOB change as well

// Event Listener for photo upload
photoUploadInput.addEventListener('change', (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			previewPhoto.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
});

// Event Listeners for photo position sliders
photoPositionXInput.addEventListener('input', (e) => {
	previewPhoto.style.objectPosition = `${e.target.value}% ${photoPositionYInput.value}%`;
});

photoPositionYInput.addEventListener('input', (e) => {
	previewPhoto.style.objectPosition = `${photoPositionXInput.value}% ${e.target.value}%`;
});

// Event Listener for logo upload
logoUploadInput.addEventListener('change', (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			previewLogo.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
});

// Event Listener for background image upload
backgroundUploadInput.addEventListener('change', (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			idCardPreview.style.backgroundImage = `url('${e.target.result}')`;
		};
		reader.readAsDataURL(file);
	}
});

// Event Listeners for spacing controls
cardPaddingInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty('--card-padding', `${e.target.value}px`);
});

infoSpacingInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty(
		'--info-line-spacing',
		`${e.target.value}px`
	);
});

// Event Listeners for color pickers
cardBgColorInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty('--card-bg', e.target.value);
});

cardTextColorInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty('--card-text', e.target.value);
});

districtTextColorInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty('--district-text', e.target.value);
});

cardBorderColorInput.addEventListener('input', (e) => {
	idCardPreview.style.setProperty('--card-border', e.target.value);
});

// Event Listener for download button
downloadBtn.addEventListener('click', () => {
	// Use html2canvas to capture the ID card preview div
	html2canvas(idCardPreview, {
		scale: 2, // Increase scale for better resolution
		logging: false, // Disable logging
	})
		.then((canvas) => {
			// Create an image URL from the canvas
			const imgData = canvas.toDataURL('image/png');

			// Create a temporary link element
			const link = document.createElement('a');
			link.href = imgData;
			link.download = 'dnd_id_card.png'; // Set download filename

			// Append link to body and click it to trigger download
			document.body.appendChild(link);
			link.click();

			// Clean up by removing the link
			document.body.removeChild(link);
		})
		.catch((err) => {
			console.error('Error generating image:', err);
			// Using a simple alert for error notification
			alert('Could not generate image. Please try again.');
		});
});

// Initial update on load
updatePreview();

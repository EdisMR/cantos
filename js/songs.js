const originalText = document.getElementById('songText-original').innerHTML;
const processedText = document.getElementById('songText-processed');
const songMaximizationArea = document.getElementById('songMaximizationArea');

let formattedText = '';
function formatText() {
	formattedText = originalText.replace(/\[([^\]]+)\]/g, '<span class="chord">[$1]</span>');
}
formatText();
processedText.innerHTML = formattedText;




/**********************************
 * Transposición de acordes
 * ********************************
*/

// Lista circular de notas en sostenidos
const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Equivalencias bemoles
const FLAT_EQUIV = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };

// Transpone un acorde individual (ej: "F#m", "Bb7")
function transposeChord(chord, steps, useFlats = false) {
	const match = chord.match(/^([A-G]{1}[#b]?)(.*)$/);
	if (!match) return chord;

	const [_, root, suffix] = match;

	const normalizedRoot = root.replace('Db', 'C#')
		.replace('Eb', 'D#')
		.replace('Gb', 'F#')
		.replace('Ab', 'G#')
		.replace('Bb', 'A#');

	const index = NOTES_SHARP.indexOf(normalizedRoot);
	if (index === -1) return chord;

	const newIndex = (index + steps + 12) % 12;
	let newRoot = NOTES_SHARP[newIndex];

	if (useFlats && FLAT_EQUIV[newRoot]) {
		newRoot = FLAT_EQUIV[newRoot];
	}

	return newRoot + suffix;
}


// Transpone todo el texto (todos los acordes dentro de [ ])
function transposeSongText(text, steps, useFlats = false) {
	return text.replace(/\[([^\]]+)\]/g, (_, chord) => {
		const transposed = transposeChord(chord, steps, useFlats);
		return `<span class="chord">[${transposed}]</span>`;
	});
}


function transposedSong(steps) {
	let result = transposeSongText(formattedText, steps, false);
	formattedText = result;
	processedText.innerHTML = result;
}


function resetSong(){
	formatText();
	processedText.innerHTML = formattedText;
}



function maximizeSongText(){
	songMaximizationArea.requestFullscreen();
}



function removeEmptySpace() {
	// Get the available width of the window screen
	let windowAvailW = document.body.getBoundingClientRect().width;
	let bodyinformation=document.getElementById('songText-processed');

	bodyinformation.scrollIntoView({ behavior: 'smooth' });

	if(windowAvailW > 1000) return

	// Get the width of the body information section and convert it to a floating point number
	let bodyScrollW = parseFloat(bodyinformation.getBoundingClientRect().width);

	// Calculate the value to apply for zoom adjustment based on the window and body widths
	let valueToApply = ((windowAvailW * 100) / bodyScrollW);

	// Set the zoom level of the body information section to the calculated value
	bodyinformation.style.zoom = `${valueToApply}%`;
}
removeEmptySpace();
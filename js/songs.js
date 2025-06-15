class HeaderComponent extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<div class="flex space-between wrap" id="songControlButtons">
		<div>
			<button><a href="../index.html">&#127968; Inicio</a></button>
		</div>
		<div>
			<button onclick="maximizeSongText()">&#x2927; Maximizar</button>
		</div>
		<div class="flex nowrap" id="transpositionButtons">
			<button onclick="transposedSong(10)">-1</button>
			<button onclick="transposedSong(11)">-&#189;</button>
			<button onclick="resetSong()">0</button>
			<button onclick="transposedSong(1)">+&#189;</button>
			<button onclick="transposedSong(2)">+1</button>
		</div>
	</div>
		`;

		this.appendChild(template.content.cloneNode(true));
	}
}
customElements.define('header-component', HeaderComponent);









class BodyContentComponent extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<section>
		<h1>${songTitle}</h1>

		<pre id="songText-original" class="hidden">
		${songOriginalText}
		</pre>
	</section>
	<section id="songMaximizationArea">
		<button type="button" id="closeFullscreen" class="fg-accent">×</button>
		<pre id="songText-processed"></pre>
	</section>

	<section class="categories">
		<p>categorias: ${categoriesTXT}</p>
	</section>
		`;

		this.appendChild(template.content.cloneNode(true));
	}
}
customElements.define('body-component', BodyContentComponent)







class FooterComponent extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		

	<section id="otherSongsLinks"></section>

	<footer class="flex space-between">
		<span>&copy;<span id="currentYear"></span></span>
		<span>@EdisMR</span>
	</footer>
		`;

		this.appendChild(template.content.cloneNode(true));
	}
}
customElements.define('footer-component', FooterComponent);



document.title = songTitle







const originalText = document.getElementById('songText-original').innerHTML;
const processedText = document.getElementById('songText-processed');
const songMaximizationArea = document.getElementById('songMaximizationArea');
const closeFullscreenBtn = document.getElementById('closeFullscreen');
const currentYear = document.getElementById('currentYear')

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
		return `[${transposed}]`;
	});
}

let workingPromise = false
async function transposedSong(steps) {
	let result = transposeSongText(formattedText, steps, false);
	formattedText = result;
	processedText.innerHTML = result;
	if (!workingPromise) {
		workingPromise = true;
		processedText.style.zoom = "100%";
		new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 1000);
		}).then(() => {
			/* removeEmptySpace(); */
			workingPromise = false;
		});
	}
}


async function resetSong() {
	formatText();
	processedText.innerHTML = formattedText;
	await transposedSong(0).then(() => { });
}



function maximizeSongText() {
	songMaximizationArea.requestFullscreen();
}



function removeEmptySpace() {
	// Get the available width of the window screen
	let bodyWidth = document.body.getBoundingClientRect().width;
	if (bodyWidth > 1500) return

	// Get the width of the body information section and convert it to a floating point number
	let songWidth = Number.parseFloat(processedText.getBoundingClientRect().width) +
		Number.parseFloat(getComputedStyle(processedText).marginLeft.replace('px', '')) +
		Number.parseFloat(getComputedStyle(processedText).marginRight.replace('px', '')) +
		Number.parseFloat(getComputedStyle(processedText).paddingLeft.replace('px', '')) +
		Number.parseFloat(getComputedStyle(processedText).paddingRight.replace('px', ''));

	let precentRelative = (songWidth * 100) / bodyWidth;
	let addOrRemoveInPercent = (100 - precentRelative);
	let addOrRemoveInPercentIsPositive = addOrRemoveInPercent > 0;
	if (!addOrRemoveInPercentIsPositive) { addOrRemoveInPercent = addOrRemoveInPercent * -1; }

	addOrRemoveInPercent = Number.parseFloat(addOrRemoveInPercent.toFixed(2));
	let valueToApply = "0";
	if (addOrRemoveInPercentIsPositive) {
		valueToApply = (100 + addOrRemoveInPercent).toString() + "%";
	} else {
		valueToApply = (100 - addOrRemoveInPercent).toString() + "%";
	}
	processedText.style.zoom = valueToApply;
}
/* removeEmptySpace(); */




closeFullscreenBtn.addEventListener('click', () => { closeFullscreen(); });
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) { /* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE11 */
		document.msExitFullscreen();
	}
}



function addOtherSongsLinks() {
	const otherSongsLinks = document.getElementById('otherSongsLinks');
	const files = ['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010',
		'0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019', '0020','0021',];
	files.forEach(file => {
		const link = document.createElement('a');
		link.href = `./${file}.html`;
		link.textContent = `${file}`;
		link.className = 'other-song-link';
		otherSongsLinks.appendChild(link);
	})
}
addOtherSongsLinks();

currentYear.innerHTML = new Date().getFullYear()
document.title = songTitle
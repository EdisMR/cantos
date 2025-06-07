const categoriesListContainer = document.getElementById('categories-list-container');
const songSearchInput = document.getElementById('songSearchInput');
const filteredSongsListContainer = document.getElementById('filteredSongsListContainer');
const currentYear = document.getElementById('currentYear')

const categoriesIndex = [
	{ id: '0', name: 'Todo' },
	{ id: '1', name: 'Misa-Entrada' },
	{ id: '2', name: 'Misa-Ten Piedad' },
	{ id: '3', name: 'Misa-Gloria' },
	{ id: '4', name: 'Misa-Aleluya' },
	{ id: '5', name: 'Misa-Honor y Gloria' },
	{ id: '6', name: 'Misa-Ofertorio' },
	{ id: '7', name: 'Misa-Santo' },
	{ id: '8', name: 'Misa-Padre Nuestro' },
	{ id: '9', name: 'Misa-Cordero de Dios' },
	{ id: '1A', name: 'Misa-Comunión' },
	{ id: '1B', name: 'Misa-Despedida' },
	{ id: '1C', name: 'Santos' },
	{ id: '1D', name: 'Espiritu Santo' },
	{ id: '1E', name: 'Adoración' },
	{ id: '1F', name: 'Vigilia Pascual' },
	{ id: '1G', name: 'Navidad' },
	{ id: '1H', name: 'Cuaresma' },
	{ id: '1I', name: 'Pascua' },
	{ id: '1J', name: 'Tiempo Ordinario' },
	{ id: '1K', name: 'Adviento' },
	{ id: '1L', name: 'Pentecostés' },
	{ id: '1M', name: 'Epifanía del Señor' },
	{ id: '1N', name: 'Luz' },
	{ id: '1O', name: 'Confirmación' },
	{ id: '1P', name: 'Bautismo' },
	{ id: '1Q', name: 'Matrimonio' },
	{ id: '1R', name: 'Funeral' },
	{ id: '1S', name: 'Marianos' }
]

const cantos = [
	{ id: '1', name: 'Marco Navarro - Quiero ver', categories: ['1D'], fileUrl: 'c/0001.html' },
	{ id: '2', name: 'Hemos entregado', categories: ['6'], fileUrl: 'c/0002.html' },
	{ id: '3', name: 'Los Padrecitos - Ella Sabía', categories: ['1S'], fileUrl: 'c/0003.html' },
	{ id: "4", name: "Porque tú eres bueno", categories: ["6", "1E"], fileUrl: 'c/0004.html' },
	{ id: "5", name: "Jesed - Sed de Dios", categories: ["1D", "1E"], fileUrl: 'c/0005.html' },
	{ id: "6", name: "Jesed - En Silencio", categories: ["1E"], fileUrl: 'c/0006.html' },
	{ id: "7", name: "Martin Valverde - Gloria", categories: ["1E"], fileUrl: 'c/0007.html' },
	{ id: "8", name: "Vali Olguín - Es Verdad", categories: ["1E"], fileUrl: 'c/0008.html' },
	{ id: "9", name: "Maestro Bueno", categories: ["6"], fileUrl: 'c/0009.html' },
	{ id: "10", name: "Gloria Catecúmeno", categories: ["3"], fileUrl: 'c/0010.html' },
	{ id: "11", name: "Petra - Llévame a tus atrios", categories: ["1E"], fileUrl: 'c/0011.html' },
	{ id: "12", name: "MNM RCCES Mex 2018 - Hay poder", categories: ["1E"], fileUrl: 'c/0012.html' },
	{ id: "13", name: "Marcos Witt - Quiero levantar mis manos", categories: ["1E"], fileUrl: 'c/0013.html' },
	{ id: "14", name: "Jesed - Que hermoso es", categories: ["6"], fileUrl: 'c/0014.html' },
]
/* { id: "", name: "", categories: [""], fileUrl: 'c/00.html' }, */

let displayedSongs = []

function listCategories() {
	categoriesIndex.forEach(category => {
		const categoryElement = document.createElement('span');
		categoryElement.classList.add('category-chip');
		categoryElement.classList.add('fg-accent');
		categoryElement.classList.add('p-.25');
		categoryElement.classList.add('m-.5');
		categoryElement.dataset.categoryid = category.id;
		categoryElement.onclick = function (event) {
			const allCategoryChips = document.querySelectorAll('.category-chip');
			allCategoryChips.forEach(chip => {
				chip.classList.remove('fg-success');
			});
			event.target.classList.add('fg-success')
			filterSongs(category.id)
		};
		categoryElement.innerHTML = `${category.name}`;
		categoriesListContainer.appendChild(categoryElement);
	});
}
listCategories();



songSearchInput.addEventListener('input', (e) => {
	searchSongName(e.target.value);
}, false)
function searchSongName(text) {
	const allCategoryChips = document.querySelectorAll('.category-chip');
	allCategoryChips.forEach(chip => {
		chip.classList.remove('fg-success');
	});
	if (text.length > 0) {
		const filteredSongs = cantos.filter(canto => canto.name.toLowerCase().includes(text.toLowerCase()));
		displayedSongs = filteredSongs;
	} else {
		displayedSongs = [];
	}
	renderSongsList();
}




function filterSongs(id) {
	if (id === '0') { listCompleteSongsList(); return; }
	displayedSongs = [];
	const filteredSongs = cantos.filter(canto => canto.categories.includes(id));
	displayedSongs = filteredSongs;
	renderSongsList();
}




function renderSongsList() {
	if (displayedSongs.length > 0) {
		filteredSongsListContainer.innerHTML = '';
		displayedSongs.forEach(canto => {
			//*<li><a href="c/1.html">enlace 1</a></li>
			const songElement = document.createElement('li');
			const songLink = document.createElement('a');
			songLink.href = canto.fileUrl;
			songLink.innerHTML = `${canto.id} - ${canto.name}`;
			songElement.appendChild(songLink);
			filteredSongsListContainer.appendChild(songElement);
		});
	} else {
		filteredSongsListContainer.innerHTML = '<li>No hay resultados</li>';
	}
}


function listCompleteSongsList() {
	//Display complete songs list
	filteredSongsListContainer.innerHTML = '';
	cantos.forEach(canto => {
		//*<li><a href="c/1.html">enlace 1</a></li>
		const songElement = document.createElement('li');
		const songLink = document.createElement('a');
		songLink.href = canto.fileUrl;
		songLink.innerHTML = `${canto.id} - ${canto.name}`;
		songElement.appendChild(songLink);
		filteredSongsListContainer.appendChild(songElement);
	});
}


currentYear.innerHTML = new Date().getFullYear()



listCompleteSongsList();
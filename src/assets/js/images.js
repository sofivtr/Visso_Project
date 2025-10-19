// Igual que tu versión, pero ahora incluye subcarpetas y más formatos
// Además, usa import.meta.glob con { eager: true } (reemplaza globEager)
const modules = import.meta.glob([
	'../images/*.{png,jpg,jpeg,svg,webp,avif}',
	'../images/**/*.{png,jpg,jpeg,svg,webp,avif}'
], { eager: true, import: 'default' });

const formattedImages = {};

for (const path in modules) {
	// Obtén solo el nombre de archivo y úsalo como key (sin extensión)
	const fileName = path.split('/').pop() || path;
	const key = fileName.replace(/\.[^/.]+$/, '');
	formattedImages[key] = modules[path];
}

export default formattedImages;
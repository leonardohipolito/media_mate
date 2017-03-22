/* eslint-disable no-unused-vars */
const WebTorrent = require('webtorrent');
require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 1000;

const client = new WebTorrent();
let filesAll = '';
/**
 * On keypress on the <input>
 * @param e - the event
 * @returns {boolean} - whether enter was pressed or not.
 */
function runScript(e) {
	if (e.keyCode === 13) {
		const tb = document.getElementById('magnet');
		submitmagnet(tb.value);
		return false;
	}
}
/**
 * Allow the user to choose what file to stream.
 * @param files - files in the torrent
 */
function chooseFile(files) {
	const select = document.getElementById('selectNumber');
	console.log(files);
	filesAll = files;
	for (let i = 0; i < files.length; i++) {
		const opt = files[i];
		const el = document.createElement('option');
		el.textContent = opt.name;
		el.value = i;
		select.appendChild(el);
	}
}
/**
 * Start playing the file
 * @param file - the file
 */
function startPlaying(file) {
	file.renderTo('#playerm8', (err, elem) => {
		if (err) {
			throw err;
		} // File failed to download or display in the DOM
		console.log('New DOM node with the content', elem);
		elem.style.display = 'block';
		elem.style.width = '100%';
		document.getElementById('destroy').style.display = 'block';
		file.getBlobURL((err, url) => {
			if (err) {
				throw err;
			}
			const a = document.createElement('a');
			a.download = file.name;
			a.href = url;
			a.textContent = 'Download ' + file.name;
			console.log(a);
			document.getElementById('dl').appendChild(a);
		});
	}); // Append the file to the DOM
}
/**
 * Get file when selected
 */
function getFile() {
	const e = document.getElementById('selectNumber');
	const text = e.options[e.selectedIndex].value;
	startPlaying(filesAll[text]);
}
/**
 * Add magnet to WebTorrent
 * @param magnet - the magnet URI
 */
function submitmagnet(magnet) {
	client.add(magnet, torrent => {
		chooseFile(torrent.files);
		process.torrent = torrent;
		document.getElementById('myForm').style.display = 'inline';
	});
}
/**
 * Stop downloading the torrent.
 */
function stop() {
	process.torrent.destroy(tor => {
		document.getElementById('playerm8').style.display = 'none';
		document.getElementById('destroy').style.display = 'none';
		document.getElementById('selectNumber').style.display = 'none';
	});
}

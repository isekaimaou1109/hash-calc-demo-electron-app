// const md2 = require('js-md2');
// const md4 = require('js-md4');
// const md5 = require('md5-nodejs');
// const sha1 = require('js-sha1');
// const sha256 = require('js-sha256').sha256;
// const sha384 = require('js-sha512').sha384;
// const sha512 = require('js-sha512').sha512;
// const { ripemd160 } = require('noble-hashes/lib/ripemd160');
// const crc32 = require('js-crc').crc32;
// const adler32 = require('adler32');
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  	'context', {
		filename: () => ipcRenderer.sendSync('dialog'),
		sendInfo: (infoStatus) => ipcRenderer.sendSync('info', infoStatus),
		closeWin: () => ipcRenderer.sendSync('close'),
		openHelpWin: () => ipcRenderer.sendSync('child')
  	}
)
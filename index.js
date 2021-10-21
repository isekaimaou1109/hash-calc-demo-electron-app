const { app, BrowserWindow, dialog, ipcMain, nativeImage } = require('electron')
const { readFileSync } = require('fs')
const crypto = require('crypto');
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const md2 = require('js-md2');
const md4 = require('js-md4');
const md5 = require('md5-nodejs');
const sha1 = require('js-sha1');
const sha256 = require('js-sha256');
const sha384 = require('js-sha512').sha384;
const sha512 = require('js-sha512').sha512;
const crc32 = require('js-crc').crc32;
const adler32 = require('adler32')
const { ripemd160 } = require('noble-hashes/lib/ripemd160');
const ed2k = require('node-ed2k');

function createWindow () {
  	const win = new BrowserWindow({
	    width: 800,
	    height: 500,
	    minWidth: 800,
	    minHeight: 500,
	    icon: path.join(__dirname, 'assets', 'favicon.ico'),
	    webPreferences: {
	    	contextIsolation: true,
		    nodeIntegration: true,	      	
		    preload: path.join(__dirname, 'preload.js')
	    }
  	})

  	ipcMain.on('close', (event) => {
		win.destroy()
	})

	ipcMain.on('child', (event) => {
		const child = new BrowserWindow({ 
			parent: win,
			width: 300,
			height: 300,
			maxWidth: 300,
			maxHeight: 300,
			title: 'Help?',
			x: 0,
			y: 0,
			icon: path.join(__dirname, 'assets', 'favicon.ico')
	 	})

		child.show()
	})

  	win.webContents.on('ipc-message-sync', function(event, channel, ...args) {
		if(channel === 'dialog') {
			dialog.showOpenDialog(win, {
				title: "Open a dialog",
				properties: ['showHiddenFiles']
			}).then(result => {
				if(!result.canceled) {
					event.returnValue = result.filePaths[0]
				}
			}).catch(e => console.error("Error"))
		}

		if(channel === 'info') {
			var status = args[0]

			if(status.filename !== null) {
				const newStatus = {
					filename: status.filename,
					md5: null,
					md4: null,
					md2: null,
					sha1: null,
					sha256: null,
					sha384: null,
					sha512: null,
					ripemd160: null,
					adler32: null,
					ed2: null,
					crc32: null,
					tiger: null,
					panama: null
				}
				var data

				try {
					data = readFileSync(newStatus['filename'])
				} catch(e) {
					throw new Error("Cannot read this file")
				}

				if(status['md2']) {
					newStatus['md2'] = md2(data)
				}

				if(status['md4']) {
					newStatus['md4'] = md4(data)
				}

				if(status['md5']) {
					newStatus['md5'] = md5(data)
				}

				if(status['sha1']) {
					newStatus['sha1'] = sha1(data)
				}

				if(status['sha256']) {
					if(status['hmac']) {
						newStatus['sha256'] = sha256.hmac(status['hmac'], data);
					} else {
						newStatus['sha256'] = sha256(data);
					}
				}

				if(status['sha384']) {
					if(status['hmac']) {
						newStatus['sha384'] = sha384.hmac(status['hmac'], data);
					} else {
						newStatus['sha384'] = sha384(data)
					}
				}

				if(status['sha512']) {
					if(status['hmac']) {
						newStatus['sha512'] = sha512.hmac(status['hmac'], data);
					} else {
						newStatus['sha512'] = sha512(data)
					}
				}

				if(status['crc32']) {
					newStatus['crc32'] = crc32(data)
				}

				if(status['ripemd160']) {
					newStatus['ripemd160'] = ripemd160(data)
				}

				event.returnValue = newStatus
			}
		}
	})

 	win.loadFile('views/index.html')
}

app.whenReady().then(() => {
  	createWindow()

  	app.on('activate', () => {
	    if (BrowserWindow.getAllWindows().length === 0) {
      		createWindow()
	    }
  	})
})

app.on('window-all-closed', () => {
  	if (process.platform !== 'darwin') {
    	app.quit()
  	}
})


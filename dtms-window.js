const {BrowserWindow, app} = require('electron');
const path = require('path');

let mainWindow, url;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        fullscreen      : true,
        useContentSize  : true,
        resizable       : false,
        backgroundColor : "#19273c"
    });

    url = require('url').format({
        protocol    : 'file',
        slashes     : true,
        pathname    : path.join(__dirname + "/index.html")
    });

    mainWindow.loadURL(url);
    //mainWindow.setMenu(null);

    mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => mainWindow = null);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});

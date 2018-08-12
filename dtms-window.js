// electron
const {BrowserWindow, app} = require('electron');

let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        fullscreen : true,
        useContentSize : true,
        resizable : false,
        minWidth: 968,
        backgroundColor : "#19273c"
    });

    //mainWindow.setMenu(null);

    mainWindow.loadURL('file:///' + __dirname + "/index.html");

    mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => mainWindow = null);
});

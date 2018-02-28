// electron
const {BrowserWindow} = require('electron');
const {app} = require('electron');

let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({fullscreen : true, resizable : false, minWidth: 968, backgroundColor : "#19273c"});

    mainWindow.setMenu(null);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.loadURL('file:///' + __dirname + "/index.html");
});

const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const css = fs.readFileSync(path.join(__dirname, 'hack.css'), { encoding: 'utf-8' })

let isVisible = false;

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    frame: false,
    width: 400,
    autoHideMenuBar: true,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL('https://static.app.yinxiang.com/light-note/')


  win.on('focus', () => {
    win.webContents.send('window-focus');
  })

  // 打开console控制台
  // win.webContents.openDevTools();

  return win;
}

app.dock.hide();

app.whenReady().then(() => {
  const win = createWindow();

  const tray = new Tray(path.join(__dirname, 'images/trayTemplate.png'));

  const toggleWindow = () => {
    if (isVisible && win.isFocused()) {
      isVisible = false;
      win.hide();
      win.webContents.removeInsertedCSS(css);
    } else {
      const trayPosition = tray.getBounds()
      win.setPosition(trayPosition.x, trayPosition.y)
      win.webContents.insertCSS(css);
      win.show();
      isVisible = true;
    }
  }

  tray.addListener('click', toggleWindow)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'sticky',
      click: () => {
        win.setAlwaysOnTop(true);
      }
    },
    {
      label: 'unsticky',
      click: () => {
        win.setAlwaysOnTop(false);
      }
    },
    { type: 'separator' }, 
    { label: 'quit', role: 'quit' }
  ])

  // tray.setContextMenu(contextMenu)
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  })

  globalShortcut.register('Command+Option+N', () => {
    toggleWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
})
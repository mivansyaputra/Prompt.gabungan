const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// GPU aktif secara normal (lebih ringan). Hanya jika GPU crash, otomatis pindah ke mode software.
const gpuFlag = path.join(app.getPath('userData'), 'no-gpu.flag');
if (fs.existsSync(gpuFlag)) app.disableHardwareAcceleration();
app.on('child-process-gone', (_e, d) => {
  if (d.type === 'GPU' && !fs.existsSync(gpuFlag)) {
    try { fs.mkdirSync(path.dirname(gpuFlag), { recursive: true }); fs.writeFileSync(gpuFlag, '1'); } catch (_) {}
    app.relaunch(); app.exit(0);
  }
});

let win;
const logFile = () => path.join(app.getPath('userData'), 'fenace-log.txt');
function log(m) {
  try { fs.appendFileSync(logFile(), new Date().toISOString() + '  ' + m + '\n'); } catch (_) {}
}
function errorPage(title, detail) {
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const html = '<body style="background:#03120d;color:#f8f3df;font:15px system-ui;padding:40px">' +
    '<h2 style="color:#e6c364">' + esc(title) + '</h2><pre style="white-space:pre-wrap;color:#ff8a8a">' + esc(detail) + '</pre>' +
    '<p>Log: ' + esc(logFile()) + '</p><p>Tekan F12 untuk melihat konsol.</p></body>';
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 800, show: false, backgroundColor: '#03120d', title: 'Fenace Madrasah', icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: false
    }
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => win.show());
  setTimeout(() => { if (win && !win.isVisible()) win.show(); }, 3000);

  const wc = win.webContents;
  wc.on('before-input-event', (e, i) => {
    if (i.type === 'keyDown' && (i.key === 'F12' || (i.control && i.shift && i.key.toLowerCase() === 'i'))) wc.toggleDevTools();
  });
  wc.on('console-message', (_e, level, msg, line, src) => { if (level >= 2) log('CONSOLE[' + level + '] ' + msg + ' (' + src + ':' + line + ')'); });
  wc.on('did-fail-load', (_e, code, desc, url) => {
    log('did-fail-load ' + code + ' ' + desc + ' ' + url);
    win.loadURL(errorPage('Halaman gagal dimuat', code + ' ' + desc + '\n' + url));
  });
  wc.on('render-process-gone', (_e, d) => log('render-process-gone ' + JSON.stringify(d)));
  wc.on('preload-error', (_e, p, err) => log('preload-error ' + p + ' ' + err));

  const file = path.join(__dirname, 'index.html');
  log('memuat ' + file + ' ada=' + fs.existsSync(file));
  if (!fs.existsSync(file)) { win.loadURL(errorPage('index.html tidak ditemukan', file)); return; }
  win.loadFile(file);

  // Jika 8 detik kemudian isi halaman masih kosong, catat dan buka konsol otomatis
  setTimeout(() => {
    if (!win || win.isDestroyed()) return;
    wc.executeJavaScript("({m:(document.querySelector('#m')||{innerHTML:''}).innerHTML.length,intro:!!document.querySelector('#intro')})")
      .then(r => { log('cek tampilan ' + JSON.stringify(r)); if (!r.m) wc.openDevTools({ mode: 'detach' }); })
      .catch(e => log('cek tampilan gagal ' + e));
  }, 8000);
}

ipcMain.on('refocus', () => { if (!win) return; win.blur(); win.focus(); win.webContents.focus(); });

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(createWindow);
  app.on('window-all-closed', () => app.quit());
}

const { ipcRenderer } = require('electron');

// 填写 account 和 password， 会根据这个自动注入信息
const ACCOUNT = ''
const PASSWORD = '';

function dispatchChangeEvent($dom, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  nativeInputValueSetter.call($dom, value);
  $dom.dispatchEvent(new Event('input', { bubbles: true }));
}

async function autoLogin() {
  // 自动填充账号密码
  dispatchChangeEvent(document.querySelector('input[type="text"]'), ACCOUNT)
  dispatchChangeEvent(document.querySelector('input[type="password"]'), PASSWORD)


  const $root = document.querySelector('#root');
  try {
    // 协议按钮点击
    $root.lastChild.firstChild.click();

    // 模拟sleep
    await new Promise(resolve => setTimeout(resolve, 500));

    // 登录按钮点击
    $root.firstChild.lastChild.previousSibling.firstChild.click();
  } catch(e) {
    console.error(e);
  }
}

ipcRenderer.on('window-focus', () => {
  // 触发列表属性
  try {
    const $root = document.querySelector('#root');
    const $editor = $root.firstChild.firstChild;
    for (let [index, img] of $editor.querySelectorAll('img').entries()) {
      if (img.classList.value.includes('Refresh_refresh')) {
        img.parentElement.click()
        break;
      }
    }
  } catch(e) {

  }
})

window.addEventListener('load', () => {
  // 页面加载成功后，判断是否需要登录，如果需要则切换密码等
  console.log('page onload');
  if (location.href.includes('common-registration')) {
    console.log('切换为密码账号登录');
    location.hash = "/sign-account";
    setTimeout(autoLogin, 100);
  }
})
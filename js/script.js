function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {

    var copyTrkBtn, copyTrkText,copyCourseIdText, copyCourseIdBtn, newLink, tab, url;

    tab = tabs[0];
    url = tab.url;
            
    copyTrkText = document.querySelector('#trkTxt');
    copyTrkBtn = document.querySelector('#trkBtn');

    copyCourseIdText = document.querySelector('#courseIdTxt');
    copyCourseIdBtn = document.querySelector('#courseIdBtn');

    copyTrkBtn.addEventListener('click', event => {
      var oldValue = copyTrkText.value;
      if (oldValue === '') {
        newLink = url.split("?")[0] + '?trk=insiders_pilot_learning';
      } else {
        newLink = url.split("?")[0] + oldValue;
      }

      copyTrkText.value = newLink;
      copyTrkText.select();
      document.execCommand('copy');
      copyTrkText.value = oldValue;
    });

    copyCourseIdBtn.addEventListener('click', event => {
      courseIdText.select();
      document.execCommand('copy');
    });
    
    callback(newLink);
  });
}

function getCurrTRKCode(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveCurrTRKCode(url, trkCode) {
  var items = {};
  items[url] = trkCode;
  chrome.storage.sync.set(items);
}

document.addEventListener('DOMContentLoaded', () => {

  chrome.tabs.executeScript(null, {
    "code": "document.body.innerHTML.match(/lyndaCourse:([0-9]*)/i)[1]"
  }, result => document.querySelector('#courseIdText').value = result);

  getCurrentTabUrl((url) => {
    var copyTrkText = document.querySelector('#trkTxt');
    
    getCurrTRKCode(url, currTRK => {
      if (currTRK) {
        copyTrkText.value = currTRK;
      }
    });

    copyTrkText.addEventListener('change', () => saveCurrTRKCode(url, copyTrkText.value));
  });
});

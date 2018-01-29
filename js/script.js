function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    
    var copyBtn, copyText, newLink;
    copyText = document.querySelector('#copyTxt');

    copyBtn = document.querySelector('#copybtn');

    copyBtn.addEventListener('click', function(event) {
      var oldValue = copyText.value;
      if (oldValue === '') {
        newLink = url.split("?")[0] + '?trk=insiders_pilot_learning';
      } else {
        newLink = url.split("?")[0] + oldValue;
      }

      copyText.value = newLink;
      copyText.select();
      document.execCommand('copy');
      copyText.value = oldValue;
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
  getCurrentTabUrl((url) => {
    var copyText = document.querySelector('#copyTxt');

    getCurrTRKCode(url, (currTRK) => {
      if (currTRK) {
        copyText.value = currTRK;
      }
    });

    copyText.addEventListener('change', () => {
      console.log(copyText.value);
      saveCurrTRKCode(url, copyText.value);
    });
  });
});

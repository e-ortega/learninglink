function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    
    var copyBtn, copyText, newLink;
    console.log(newLink);

    newLink = url.split("?")[0] + '?trk=insiders_pilot_learning';

    copyBtn = document.querySelector('#copybtn');
    copyBtn.addEventListener('click', function(event) {
      copyText = document.querySelector('#copyTxt');
      var oldValue = copyText.value; 
      copyText.value = newLink;
      copyText.select();
      document.execCommand('copy');
      copyText.value = oldValue;
    });
    callback(newLink);
  });
}

function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  chrome.tabs.executeScript({
    code: script
  });
}

function getSavedBackgroundColor(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  chrome.storage.sync.set(items);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('dropdown');

    getSavedBackgroundColor(url, (savedColor) => {
      if (savedColor) {
        changeBackgroundColor(savedColor);
        dropdown.value = savedColor;
      }
    });

    dropdown.addEventListener('change', () => {
      changeBackgroundColor(dropdown.value);
      saveBackgroundColor(url, dropdown.value);
    });
  });
});

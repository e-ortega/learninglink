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
    
    chrome.tabs.executeScript(null, {
        "code": "'Ember: ' + document.body.innerHTML.match(/lyndaCourse:([0-9]*)/i)[1] + '<br>Canonical: ' + document.querySelector('link[rel=\"canonical\"]').href.match(/([0-9]+)/i)[1] + '<br>Player: ' + (document.getElementsByTagName('video').length>0 ? document.querySelector('video[class=\"player\"]').src.match(/courses\\/([0-9]*)/i)[1] : \"none\");"
    }, function (result) {
        document.getElementById('info').innerHTML = result;
    });

    //chrome.tabs.executeScript(null, {file: "js/scott.js"});
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

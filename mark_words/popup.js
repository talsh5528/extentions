document.getElementById('addWordBtn').addEventListener('click', () => {
  const wordsContainer = document.getElementById('wordsContainer');
  const wordEntry = document.createElement('div');
  wordEntry.className = 'wordEntry';
  wordEntry.innerHTML = `
    <input type="text" class="word" placeholder="Enter word" />
    <input type="color" class="color-input" />
    <label>
      <input type="checkbox" class="regex-checkbox"> Regex
    </label>
  `;
  wordsContainer.appendChild(wordEntry);
});

document.getElementById('markBtn').addEventListener('click', () => {
  const wordEntries = document.querySelectorAll('.wordEntry');
  const words = [];
  wordEntries.forEach(entry => {
    const word = entry.querySelector('.word').value.trim();
    const color = entry.querySelector('.color-input').value;
    const regex = entry.querySelector('.regex-checkbox').checked;
    if (word) {
      words.push({ word, color, regex });
    }
  });
  if (words.length > 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js']
        },
        () => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'markWords', words: words });
        }
      );
    });
  }
});

document.getElementById('clearBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ['content.js']
      },
      () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'clearMarks' });
      }
    );
  });
});


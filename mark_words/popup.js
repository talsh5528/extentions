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
        <button class="deleteWordBtn"><i class="fas fa-times"></i></button>
    `;
    wordsContainer.appendChild(wordEntry);

    // Add event listener for the delete button
    wordEntry.querySelector('.deleteWordBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                },
                () => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'clearMarks' }, () => {
                        wordEntry.remove();
                        updateDeleteButtons();
                    });
                }
            );
        });
    });

    updateDeleteButtons();
});

document.getElementById('markBtn').addEventListener('click', () => {
    const wordEntries = document.querySelectorAll('.wordEntry');
    const words = [];
    wordEntries.forEach(entry => {
        const word = entry.querySelector('.word').value.trim();
        const color = entry.querySelector('.color-input').value;
        const regexCheckbox = entry.querySelector('.regex-checkbox');
        const regex = regexCheckbox ? regexCheckbox.checked : false;
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

function updateDeleteButtons() {
    const wordEntries = document.querySelectorAll('.wordEntry');
    wordEntries.forEach((entry, index) => {
        const deleteBtn = entry.querySelector('.deleteWordBtn');
        if (wordEntries.length === 1) {
            deleteBtn.style.display = 'none';
        } else {
            deleteBtn.style.display = 'inline-block';
        }
    });
}

// Initial call to ensure the delete button is hidden if there's only one word entry
updateDeleteButtons();

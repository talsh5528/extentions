chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'markWords') {
    const words = request.words;
    if (words.length > 0) {
      markWords(words);
    }
  } else if (request.action === 'clearMarks') {
    clearMarks();
  }
});

function markWords(words) {
  let bodyText = document.body.innerHTML;
  words.forEach(({ word, color }) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    bodyText = bodyText.replace(regex, (match) => `<span class="highlight" style="background-color: ${color};">${match}</span>`);
  });
  document.body.innerHTML = bodyText;
}

function clearMarks() {
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(span => {
    const textNode = document.createTextNode(span.textContent);
    span.parentNode.replaceChild(textNode, span);
  });
}

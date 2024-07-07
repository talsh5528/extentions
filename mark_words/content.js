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
  const bodyTextNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (walker.nextNode()) {
    bodyTextNodes.push(walker.currentNode);
  }

  bodyTextNodes.forEach(textNode => {
    let text = textNode.nodeValue;
    words.forEach(({ word, color, regex }) => {
      let pattern;
      try {
        pattern = regex ? new RegExp(word, 'gi') : new RegExp(`\\b${word}\\b`, 'gi');
      } catch (e) {
        console.error(`Invalid regex pattern: ${word}`);
        return;
      }
      text = text.replace(pattern, (match) => `<span class="highlight" style="background-color: ${color};">${match}</span>`);
    });

    if (textNode.nodeValue !== text) {
      const fragment = document.createRange().createContextualFragment(text);
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });
}


function clearMarks() {
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(span => {
    const textNode = document.createTextNode(span.textContent);
    span.parentNode.replaceChild(textNode, span);
  });
}


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "highlightPage",
    title: "Highlight selected text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "highlightPage") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: highlightSelection
    });
  }
});

function highlightSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.backgroundColor = '#FFFF8F';
  range.surroundContents(span);

  // Optionally, save the highlighted text and page URL for future use
  const highlightedText = selection.toString();
  const pageUrl = window.location.href;
  chrome.storage.local.set({ [pageUrl]: highlightedText });
}

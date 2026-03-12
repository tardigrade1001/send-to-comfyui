document.addEventListener('DOMContentLoaded', () => {
  const runBtn = document.getElementById('runBtn');
  const statusMsg = document.getElementById('statusMsg');
  const autoRunToggle = document.getElementById('autoRunToggle');

  // Load the saved toggle state when the popup opens
  chrome.storage.local.get(['autoRun'], (result) => {
    autoRunToggle.checked = !!result.autoRun;
  });

  // Save the state immediately whenever the user clicks the checkbox
  autoRunToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ autoRun: e.target.checked });
  });

  // Manual Run Button Logic (Unchanged)
  runBtn.addEventListener('click', async () => {
    statusMsg.textContent = "Searching for ComfyUI tab...";
    statusMsg.style.color = "#555";

    try {
      const tabs = await chrome.tabs.query({});
      const comfyTab = tabs.find(t => t.url && (t.url.includes('127.0.0.1:8188') || t.url.includes('localhost:8188')));

      if (!comfyTab) {
        statusMsg.textContent = "Error: No ComfyUI tab open!";
        statusMsg.style.color = "#f44336";
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: comfyTab.id },
        func: () => {
          const allButtons = Array.from(document.querySelectorAll('button'));
          let targetBtn = allButtons.find(btn => btn.textContent && (btn.textContent.includes('Run') || btn.textContent.includes('Queue')));
          if (!targetBtn) targetBtn = document.getElementById('queue-button');
          if (targetBtn) {
            targetBtn.click();
            return true;
          }
          return false;
        }
      });

      if (results && results[0] && results[0].result) {
        runBtn.innerHTML = "Queued! &#10003;";
        runBtn.style.backgroundColor = "#2e7d32";
        statusMsg.textContent = "Success! Watch your nodes.";
        statusMsg.style.color = "#4CAF50";
        setTimeout(() => {
          runBtn.innerHTML = "&#9654; Run Open Tab";
          runBtn.style.backgroundColor = "#4CAF50";
          statusMsg.textContent = "Ready.";
          statusMsg.style.color = "#555";
        }, 2500);
      } else {
        statusMsg.textContent = "Error: Run button not found on page.";
        statusMsg.style.color = "#f44336";
      }
    } catch (error) {
      statusMsg.textContent = "System Error: " + error.message;
      statusMsg.style.color = "#f44336";
    }
  });
});
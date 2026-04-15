document.addEventListener('DOMContentLoaded', () => {
  const runBtn        = document.getElementById('runBtn');
  const statusMsg     = document.getElementById('statusMsg');
  const autoRunToggle = document.getElementById('autoRunToggle');

  // ── Load saved toggle state ──────────────────────────────────────────────
  chrome.storage.local.get(['autoRun'], (result) => {
    autoRunToggle.checked = !!result.autoRun;
  });

  autoRunToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ autoRun: e.target.checked });
  });

  // ── Manual Run Button ────────────────────────────────────────────────────
  runBtn.addEventListener('click', async () => {
    statusMsg.textContent = "Searching for ComfyUI tab...";
    statusMsg.style.color = "#555";

    try {
      const comfyTab = await getComfyTab();
      if (!comfyTab) {
        statusMsg.textContent = "ComfyUI tab not found — is it open?";
        statusMsg.style.color = "#f44336";
        return;
      }

      await fireRun(comfyTab.id);

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

    } catch (error) {
      statusMsg.textContent = "Error: " + error.message;
      statusMsg.style.color = "#f44336";
    }
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  async function getComfyTab() {
    const tabs = await chrome.tabs.query({});
    return tabs.find(t => t.url && (
      t.url.includes('127.0.0.1:8188') || t.url.includes('localhost:8188')
    ));
  }

  // Tries Ctrl+Enter first. If queue doesn't increase within 400ms,
  // falls back to clicking the Run/Queue button. Never fires twice.
  async function fireRun(tabId) {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter', code: 'Enter', ctrlKey: true,
          bubbles: true, cancelable: true
        }));
      }
    });

    await new Promise(r => setTimeout(r, 400));
    try {
      const resp = await fetch('http://127.0.0.1:8188/queue');
      if (resp.ok) {
        const data = await resp.json();
        const queued = (data.queue_running ?? []).length + (data.queue_pending ?? []).length;
        if (queued > 0) return;
      }
    } catch (_) { /* fall through */ }

    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const btn = Array.from(document.querySelectorAll('button'))
          .find(b => b.textContent.trim() === 'Run' || b.textContent.trim() === 'Queue');
        if (btn) btn.click();
      }
    });
  }

});

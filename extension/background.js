chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToComfy",
    title: "Send to ComfyUI",
    contexts: ["image"]
  });
});

// ── Fire a run in the ComfyUI tab ────────────────────────────────────────────
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "sendToComfy") {
    const imageUrl = info.srcUrl;

    const showToast = (message, isError) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (msg, err) => {
          const toast = document.createElement('div');
          toast.textContent = msg;
          toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; background: ${err ? '#f44336' : '#4CAF50'}; color: white; border-radius: 8px; z-index: 2147483647; font-family: sans-serif; font-size: 14px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: opacity 0.3s; pointer-events: none;`;
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
          }, 3000);
        },
        args: [message, isError]
      }).catch(err => console.error("Could not inject toast:", err));
    };

    try {
      // 1. Fetch and upload the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) throw new Error(`Could not read image. (Error ${imageResponse.status})`);

      const imageBlob = await imageResponse.blob();
      const formData = new FormData();
      const filename = `web_image_${Date.now()}.png`;
      formData.append("image", imageBlob, filename);
      formData.append("type", "input");
      formData.append("overwrite", "true");

      const comfyResponse = await fetch("http://127.0.0.1:8188/upload/image", {
        method: "POST",
        body: formData
      });
      if (!comfyResponse.ok) throw new Error(`Server rejected upload.`);

      // 2. Auto-run if enabled
      const { autoRun } = await chrome.storage.local.get(['autoRun']);
      if (autoRun) {
        const tabs = await chrome.tabs.query({});
        const comfyTab = tabs.find(t => t.url && (
          t.url.includes('127.0.0.1:8188') || t.url.includes('localhost:8188')
        ));
        if (comfyTab) {
          await fireRun(comfyTab.id);
          showToast("Sent & Auto-Queued! 🚀", false);
        } else {
          showToast("Sent — ComfyUI tab not found to Auto-Run.", true);
        }
      } else {
        showToast("Sent to ComfyUI! ✓", false);
      }

    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showToast("Error: Could not connect. Is ComfyUI running?", true);
      } else {
        showToast(`Error: ${error.message}`, true);
      }
    }
  }
});

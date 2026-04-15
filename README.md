# 🚀 Send to ComfyUI

![GitHub stars](https://img.shields.io/github/stars/tardigrade1001/send-to-comfyui?style=social)
![GitHub license](https://img.shields.io/github/license/tardigrade1001/send-to-comfyui)
![ComfyUI](https://img.shields.io/badge/ComfyUI-Tested%20on%200.16.3-blue)

**Send images from the web directly into a ComfyUI workflow with a single right-click.**

**Send to ComfyUI** is a lightweight **browser extension + custom ComfyUI node** that creates a seamless **Web → ComfyUI pipeline**.

Instead of manually downloading images and loading them into ComfyUI, you can send them directly from your browser.

No more:

**Image → Download → Drag into Load Image → Click Run**

Now it's simply:

**Right-Click → Send to ComfyUI ✨**

And with **Auto-Run enabled**:

**Right-Click → Send → Workflow runs automatically 🚀**

---

## 🎬 Demo

<p align="center">
  <img src="assets/demo.gif" width="800">
</p>

Example: Right-click an image on the web and instantly send it into a running ComfyUI workflow.

---

# 🌐 What This Tool Does

When browsing the web, you often encounter images you want to experiment with inside ComfyUI.

Normally the process looks like this:

1. Download the image
2. Open your downloads folder
3. Drag or upload the image into a **Load Image** node
4. Click **Queue Prompt**

This extension removes that entire cycle.

With **Send to ComfyUI**, images move directly from the browser into your workflow.

### New Workflow

Web Image
→ **Send to ComfyUI**
→ Image appears in `ComfyUI/input`
→ Workflow loads the image via a Smart Queue

Or with **Auto-Run enabled**:

Web Image
→ **Send to ComfyUI**
→ Image uploaded
→ **Workflow starts automatically**

Fast. Clean. Zero friction.

---

# 🧠 How It Works

This project consists of two components:

• A **browser extension**
• A **custom ComfyUI node**

Together they create a seamless bridge between the internet and your AI workflows.

---

# 🖱️ Browser Extension

The extension adds a new option to the browser's right-click menu:

**Send to ComfyUI**

When selected, the extension:

1️⃣ Detects the image URL
2️⃣ Downloads the image data from the webpage
3️⃣ Converts it into binary format
4️⃣ Uploads it directly to your running ComfyUI server

The image is automatically saved inside:

```text
ComfyUI/input/
```

Each image receives a unique timestamp filename such as:

```text
web_image_1710243800.png
```

This guarantees the newest file can always be detected by the workflow.

---

# 🖱️ Popup Controls

Clicking the extension icon opens a small popup with two controls:

**▶ Run Open Tab** — manually fires a run in the active ComfyUI tab. Useful when Auto-Run is off or when you want to trigger a run without sending a new image.

**Auto-Run on Send** — when checked, the workflow starts automatically every time you right-click and send an image. No need to open ComfyUI or click anything.

### How Auto-Run fires

Auto-Run uses a two-step approach to trigger the workflow reliably across ComfyUI frontend versions:

1. Sends a `Ctrl+Enter` keyboard event to the ComfyUI tab
2. If the queue hasn't increased within 400ms, falls back to clicking the Run button directly

This means it works correctly regardless of which ComfyUI frontend version you are running.

---

# 🤖 Custom ComfyUI Node (Smart FIFO Queue)

The included **Load Image Queue (FIFO)** node is designed specifically for automated pipelines. Instead of blindly grabbing the newest file in your folder, it acts as a smart queue.

The node:

• **Tracks Sessions:** Records exactly when ComfyUI starts, ignoring all images from previous sessions.
• **Processes in Order (FIFO):** If you rapidly send 3 images from your browser, it lines them up and processes them in the exact order they arrived (Image 1 → Image 2 → Image 3) without skipping any.
• **Graceful Fallback:** If the queue is empty, it acts like a normal node and loads the newest image in your input folder so manual workflows never break.
• **Safe IS_CHANGED:** Returns a stable string instead of `NaN` when the input folder is empty, preventing ComfyUI from looping unnecessarily.
• **FileNotFoundError handling:** If an image is deleted between IS_CHANGED and execution, the node raises a clean error instead of crashing silently.

---

# 🔄 Reset Queue Toggle

The node includes a **Reset Queue** toggle widget directly on the node:

| State | Behaviour |
|---|---|
| **Normal FIFO queue** (default) | Processes images in the order they were sent |
| **Reset: grab latest** | On the next Run, clears the queue state and loads the absolute latest file in the input folder |

This is useful when an offset has developed — for example if you sent images while ComfyUI was not running. Simply toggle it on, hit Run once to resync, then toggle it back off to resume normal FIFO order.

---

# ⚡ Auto-Run Mode (Zero-Click Pipeline)

The extension includes an optional **Auto-Run mode** toggled from the popup.

When enabled, the workflow starts immediately after the image is uploaded.

### Manual Mode

Right-Click Image
→ Send to ComfyUI
→ Open ComfyUI
→ Click **Run**

### Auto-Run Mode

Right-Click Image
→ Send to ComfyUI
→ **Workflow runs automatically 🚀**

This keeps execution fully visible inside the ComfyUI interface:

• nodes lighting up
• progress bars
• workflow execution

---

# 🔔 Visual Notifications

The extension provides feedback directly on the webpage using toast notifications.

Examples:

✅ **Sent to ComfyUI!**
🚀 **Sent & Auto-Queued!**
❌ **Error: Could not connect to ComfyUI**
⚠️ **Sent — ComfyUI tab not found to Auto-Run**

These notifications confirm whether the transfer succeeded.

---

# 🖼️ Image Handling

Images downloaded from the web often contain orientation metadata.

The custom node automatically:

• corrects EXIF rotation
• converts images to RGB
• normalizes pixel values
• converts images into Torch tensors

This ensures compatibility with ComfyUI's internal image format.

---

# 📦 Installation

## 1️⃣ Install the Extension

Open your browser and navigate to:

```text
chrome://extensions
```

Enable **Developer Mode**.

Click **Load Unpacked** and select the **extension** folder.

### Extension Permissions

The extension uses the following Chrome APIs:

• `contextMenus` — adds the **Send to ComfyUI** right-click option
• `tabs` — locates the active ComfyUI tab for Auto-Run
• `scripting` — fires the run trigger in the ComfyUI tab
• `storage` — saves the Auto-Run preference
• `declarativeNetRequest` — allows requests to the local ComfyUI server

---

## 2️⃣ Install the Custom Node

Clone or copy this repository into:

```text
ComfyUI/custom_nodes/send-to-comfyui/
```

Restart ComfyUI.

You should now see a node called:

**Load Image Queue (FIFO)**

---

# ⚙️ Configuration

The extension assumes your ComfyUI server is running at the default address:

```text
http://127.0.0.1:8188
```

If your ComfyUI instance uses a different port or address, update the endpoint inside:

```text
background.js
popup.js
```

---

# 🧪 Example Workflow

A minimal pipeline might look like:

```text
Load Image Queue (FIFO)
        ↓
Preview Image
        ↓
Caption / Generation Node
```

Any image sent from your browser will immediately queue up and appear in the workflow.

---

# ⚠️ Known Limitations

**Queue offset when Auto-Run fires with the popup closed** — the extension fires a run immediately on send, but if ComfyUI's input folder already contains unprocessed images from a previous session, the node will process those first. The visual strip (if enabled) may not reflect the actual processing order in this case. Use the **Reset Queue** toggle on the node to resync.

**No guaranteed sync across sessions** — the node's queue state is in-memory and resets on ComfyUI restart. Images sent before a restart will be treated as new files in the next session.

---

# 🛠 Requirements

• Chrome or Edge browser
• ComfyUI running locally
• Default port `8188`

**Tested with:**

• ComfyUI **0.16.3**
• ComfyUI Frontend **1.39.19**

---

# 💡 Example Use Cases

This tool can support many workflows:

🧠 Caption generation
🎨 Image-to-image experimentation
📚 Dataset creation
🔍 Reference image collection
⚙️ Rapid AI workflow prototyping

---

# 🔮 Possible Future Improvements

Potential ideas for extending this tool:

• automatic workflow selection
• batch image sending
• storing original image URLs as metadata
• drag-and-drop browser integration
• multi-workflow routing

---

# ❤️ Why This Exists

Working with reference images should feel effortless.

Instead of constantly downloading files and manually loading them into nodes, this project turns the internet into a **live input source for ComfyUI**.

Right-Click → Send → Create.

---

# 🙏 Acknowledgements

Parts of this project were developed with the assistance of AI tools, including **Anthropic Claude**, **OpenAI ChatGPT** and **Google Gemini**, which were used for brainstorming, debugging, and refining parts of the implementation.

The overall design, implementation, and integration of the extension and ComfyUI node were carried out by the repository author.

---

# 📜 License

MIT License

---

# ⭐ Enjoy!

If you build interesting workflows using this tool, feel free to extend it further.

The bridge between the web and ComfyUI opens up many creative possibilities.

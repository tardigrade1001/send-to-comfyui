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

The extension adds a new option to the browser’s right-click menu:

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

# 🤖 Custom ComfyUI Node (Smart FIFO Queue)

The included **Load Image Queue (FIFO)** node is designed specifically for automated pipelines. Instead of just blindly grabbing the newest file in your folder, it acts as a smart queue.

The node:

• **Tracks Sessions:** It records exactly when ComfyUI starts, ignoring all your old images from previous sessions.
• **Processes in Order (FIFO):** If you rapidly send 3 images from your browser, it lines them up and processes them in the exact order they arrived (Image 1 → Image 2 → Image 3) without skipping any.
• **Graceful Fallback:** If the queue is empty, it acts like a normal node and simply loads the newest image in your input folder so manual workflows never break.

It uses ComfyUI’s **IS_CHANGED mechanism** to pass the exact queued file to the engine, ensuring the workflow refreshes perfectly whenever a new image arrives.

---

# ⚡ Auto-Run Mode (Zero-Click Pipeline)

The extension includes an optional **Auto-Run mode**.

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

This works through a small script injected into the active ComfyUI tab that simulates clicking the **Run / Queue Prompt** button.

This keeps execution visible inside the ComfyUI interface so you can still see:

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

These notifications confirm whether the transfer succeeded.

---

# 🖼️ Image Handling

Images downloaded from the web often contain orientation metadata.

The custom node automatically:

• corrects EXIF rotation
• converts images to RGB
• normalizes pixel values
• converts images into Torch tensors

This ensures compatibility with ComfyUI’s internal image format.

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
• `scripting` — simulates clicking the Run button
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
[http://127.0.0.1:8188](http://127.0.0.1:8188)

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

Parts of this project were developed with the assistance of AI tools, including **OpenAI ChatGPT** and **Google Gemini**, which were used for brainstorming, debugging, and refining parts of the implementation.

The overall design, implementation, and integration of the extension and ComfyUI node were carried out by the repository author.

---

# 📜 License

MIT License

---

# ⭐ Enjoy!

If you build interesting workflows using this tool, feel free to extend it further.

The bridge between the web and ComfyUI opens up many creative possibilities.
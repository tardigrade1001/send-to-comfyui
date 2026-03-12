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
→ Workflow loads the newest image

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

```
ComfyUI/input/
```

Each image receives a unique timestamp filename such as:

```
web_image_1710243800.png
```

This guarantees the newest file can always be detected by the workflow.

---

# 🤖 Custom ComfyUI Node

The included **Load Latest Image** node automatically loads the newest image from the `input` folder.

Instead of manually selecting files, the node scans the directory and loads the most recent image.

The node:

• detects the newest file in the input folder
• converts the image into a ComfyUI-compatible tensor
• triggers workflow updates automatically

It uses ComfyUI’s **IS_CHANGED mechanism**, ensuring the workflow refreshes whenever a new image appears.

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

```
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

```
ComfyUI/custom_nodes/send-to-comfyui/
```

Restart ComfyUI.

You should now see a node called:

**Load Latest Image**

---

# ⚙️ Configuration

The extension assumes your ComfyUI server is running at the default address:

```
http://127.0.0.1:8188
```

If your ComfyUI instance uses a different port or address, update the endpoint inside:

```
background.js
popup.js
```

---

# 🧪 Example Workflow

A minimal pipeline might look like:

```
Load Latest Image
        ↓
Preview Image
        ↓
Caption / Generation Node
```

Any image sent from your browser will immediately appear in the workflow.

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
# 🚀 Send to ComfyUI

A simple but powerful **browser extension + custom ComfyUI node** that creates a direct **Web → ComfyUI pipeline**.

Instead of manually downloading images and loading them into ComfyUI, you can send them directly from your browser with a single right-click.

No more:

**Image → Drag and drop into a Load Image node → Click Run**

Now it's simply:

**Right-Click → Send to ComfyUI ✨**

And if **Auto-Run** is enabled:

**Right-Click → Send → Workflow runs automatically 🚀**

---

## 🎬 Demo

<p align="center">
  <img src="assets/demo.gif" width="800">
</p>

---

## 🌐 What This Tool Does

When browsing the web, you often encounter images you want to experiment with inside ComfyUI.

Normally the process looks like this:

1. Download the image
2. Open your downloads folder
3. Drag or upload the image into a **Load Image** node
4. Click **Queue Prompt**

This extension removes that entire cycle.

With **Send to ComfyUI**, images move directly from the browser into your ComfyUI workflow.

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

Together they create a seamless bridge between the web and your ComfyUI workflows.

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

This guarantees that the newest image can always be detected.

---

# 🤖 Custom ComfyUI Node

The included **Load Latest Image** node automatically loads the newest image from the `input` folder.

Instead of manually selecting files, the node scans the folder and loads the most recent image.

It works by:

• detecting the newest file in the input directory
• converting it to a ComfyUI image tensor
• automatically triggering workflow updates

The node uses ComfyUI’s **IS_CHANGED mechanism**, ensuring the workflow refreshes whenever a new image appears.

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

This approach keeps the execution visible inside the ComfyUI interface, allowing you to see:

• nodes lighting up
• progress bars
• workflow execution

---

# 🔔 Visual Notifications

The extension provides feedback directly on the webpage using toast notifications.

Examples include:

✅ **Sent to ComfyUI!**
🚀 **Sent & Auto-Queued!**
❌ **Error: Could not connect to ComfyUI**

These notifications confirm whether the transfer succeeded.

---

# 🖼️ Image Handling

Images downloaded from the web often include orientation metadata.

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
• `storage` — stores the Auto-Run preference
• `declarativeNetRequest` — allows requests to the local ComfyUI server

---

## 2️⃣ Install the Custom Node

Copy the node files into:

```
ComfyUI/custom_nodes/
```

Restart ComfyUI.

You should now see a node called:

**Load Latest Image**

---

## ⚙️ Configuration

**Note:** The extension assumes your ComfyUI server is running at the default address:

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

A minimal workflow might look like:

```
Load Latest Image
        ↓
Preview Image
        ↓
Caption / Generation Node
```

Any image sent from the browser will immediately appear in the workflow.

---

# 🛠 Requirements

• Chrome or Edge browser
• ComfyUI running locally
• Default port `8188`

---

# 💡 Example Use Cases

This tool is useful for many workflows:

🧠 Caption generation
🎨 Image-to-image experimentation
📚 Dataset collection
🔍 Reference image gathering
⚙️ Rapid pipeline testing

---

# 🔮 Possible Future Improvements

Potential future ideas include:

• automatic workflow selection
• batch image sending
• storing original image URLs as metadata
• drag-and-drop browser integration
• multi-workflow routing

---

# ❤️ Why This Exists

Working with reference images should be effortless.

Instead of constantly downloading files and manually loading them into nodes, this tool turns the internet into a **live image source for ComfyUI**.

Right-Click → Send → Experiment.

---

# 🙏 Acknowledgements

Parts of this project were developed with the assistance of AI tools, including **OpenAI ChatGPT** and **Google Gemini**, which were used for brainstorming, debugging, and refining parts of the implementation.

The overall design, implementation, and integration of the extension and ComfyUI node were carried out by the repository author.

---

# 📜 License

MIT License

---

# 🚀 Enjoy!

If you build interesting workflows with this tool, feel free to extend it further.

The bridge between the web and ComfyUI opens up many creative possibilities.

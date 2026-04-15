import os
import time
import numpy as np
import torch
from PIL import Image, ImageOps
import folder_paths
from server import PromptServer
from aiohttp import web

# 1. Record exactly when ComfyUI booted up
_SESSION_START = time.time()
# 2. Keep track of new files we've already processed this session
_PROCESSED_FILES = set()


# ── Delete endpoint ───────────────────────────────────────────────────────────
@PromptServer.instance.routes.delete('/send-to-comfyui/input/{filename}')
async def delete_input_image(request):
    global _PROCESSED_FILES

    filename = request.match_info['filename']
    input_dir = os.path.realpath(folder_paths.get_input_directory())

    filepath = os.path.realpath(os.path.join(input_dir, filename))
    if not filepath.startswith(input_dir + os.sep):
        return web.json_response({'error': 'Invalid filename'}, status=400)

    if not os.path.exists(filepath):
        return web.json_response({'error': 'File not found'}, status=404)

    os.remove(filepath)
    _PROCESSED_FILES.discard(filepath)
    return web.json_response({'deleted': filename})


class LoadQueuedImage:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "reset_queue": ("BOOLEAN", {
                    "default": False,
                    "label_on": "Reset: grab latest",
                    "label_off": "Normal FIFO queue",
                }),
            }
        }

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "load_image"
    CATEGORY = "Send to ComfyUI"

    @classmethod
    def get_target_file(cls, reset_queue=False):
        global _SESSION_START, _PROCESSED_FILES

        input_dir = folder_paths.get_input_directory()
        valid_ext = (".png", ".jpg", ".jpeg", ".webp", ".bmp")

        all_files = [
            os.path.join(input_dir, f)
            for f in os.listdir(input_dir)
            if f.lower().endswith(valid_ext)
        ]

        if not all_files:
            return None, False

        # If reset is toggled: clear state and grab latest immediately
        if reset_queue:
            _PROCESSED_FILES.clear()
            _SESSION_START = time.time()
            absolute_latest = max(all_files, key=lambda f: os.path.getmtime(f))
            print(f"[SendToComfyUI] Queue reset — loading latest: {absolute_latest}")
            return absolute_latest, False

        # Normal FIFO
        new_unprocessed = [
            f for f in all_files
            if os.path.getmtime(f) >= _SESSION_START and f not in _PROCESSED_FILES
        ]

        if new_unprocessed:
            new_unprocessed.sort(key=lambda f: (os.path.getmtime(f), os.path.basename(f)))
            return new_unprocessed[0], True

        # Fallback: absolute newest file
        absolute_latest = max(all_files, key=lambda f: os.path.getmtime(f))
        return absolute_latest, False

    def load_image(self, reset_queue=False):
        global _PROCESSED_FILES

        target_file, is_queued = self.get_target_file(reset_queue)

        if not target_file:
            raise Exception("No images found in input folder")

        if is_queued:
            print(f"[SendToComfyUI] Queue processing: {target_file}")
            _PROCESSED_FILES.add(target_file)
        else:
            print(f"[SendToComfyUI] Queue empty. Fallback to latest: {target_file}")

        try:
            with Image.open(target_file) as img:
                img = ImageOps.exif_transpose(img)
                image = img.convert("RGB")
        except FileNotFoundError:
            raise Exception(f"Image file not found (was it deleted?): {target_file}")

        image_np = np.array(image).astype(np.float32) / 255.0
        image_tensor = torch.from_numpy(image_np)[None,]
        return (image_tensor,)

    @classmethod
    def IS_CHANGED(cls, reset_queue=False):
        target_file, is_queued = cls.get_target_file(reset_queue)
        if not target_file:
            return "no_files"

        mtime = os.path.getmtime(target_file)
        return f"{target_file}_{mtime}_{is_queued}_{reset_queue}"


NODE_CLASS_MAPPINGS = {
    "LoadLatestImage": LoadQueuedImage
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "LoadLatestImage": "Load Image Queue (FIFO)"
}

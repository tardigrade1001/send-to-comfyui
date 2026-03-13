import os
import time
import numpy as np
import torch
from PIL import Image, ImageOps
import folder_paths

# 1. Record exactly when ComfyUI booted up
_SESSION_START = time.time()
# 2. Keep track of new files we've already processed this session
_PROCESSED_FILES = set()

class LoadQueuedImage:

    @classmethod
    def INPUT_TYPES(cls):
        return {"required": {}}

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "load_image"
    CATEGORY = "Send to ComfyUI"

    @classmethod
    def get_target_file(cls):
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
            
        # 1. Look ONLY for files that arrived AFTER ComfyUI started, that we haven't processed yet
        new_unprocessed = [
            f for f in all_files 
            if os.path.getmtime(f) >= _SESSION_START and f not in _PROCESSED_FILES
        ]
        
        if new_unprocessed:
            # FIFO: Sort the NEW files by oldest first (Image 1, then Image 2...)
            new_unprocessed.sort(key=lambda f: os.path.getmtime(f))
            return new_unprocessed[0], True # True = It's from the queue
            
        # 2. FALLBACK: If the queue is empty, just grab the absolute newest file in the folder
        absolute_latest = max(all_files, key=lambda f: os.path.getmtime(f))
        return absolute_latest, False # False = It's just the fallback

    def load_image(self):
        global _PROCESSED_FILES
        
        target_file, is_queued = self.get_target_file()
        
        if not target_file:
            raise Exception("No images found in input folder")
            
        if is_queued:
            print(f"[SendToComfyUI] Queue processing: {target_file}")
            _PROCESSED_FILES.add(target_file) # Mark it so we don't process it again
        else:
            print(f"[SendToComfyUI] Queue empty. Fallback to latest: {target_file}")

        with Image.open(target_file) as img:
            img = ImageOps.exif_transpose(img)
            image = img.convert("RGB")

        image_np = np.array(image).astype(np.float32) / 255.0
        image_tensor = torch.from_numpy(image_np)[None,]

        return (image_tensor,)

    @classmethod
    def IS_CHANGED(cls):
        target_file, is_queued = cls.get_target_file()
        if not target_file:
            return float("NaN")
            
        mtime = os.path.getmtime(target_file)
        # Pass the queue status to ComfyUI so it knows exactly when to re-trigger
        return f"{target_file}_{mtime}_{is_queued}"


NODE_CLASS_MAPPINGS = {
    "LoadLatestImage": LoadQueuedImage
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LoadLatestImage": "Load Image Queue (FIFO)"
}
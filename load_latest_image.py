import os
import numpy as np
import torch
from PIL import Image, ImageOps
import folder_paths


class LoadLatestImage:

    @classmethod
    def INPUT_TYPES(cls):
        return {"required": {}}

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "load_image"
    CATEGORY = "Send to ComfyUI"

    def load_image(self):
        input_dir = folder_paths.get_input_directory()
        valid_ext = (".png", ".jpg", ".jpeg", ".webp", ".bmp")

        files = [
            os.path.join(input_dir, f)
            for f in os.listdir(input_dir)
            if f.lower().endswith(valid_ext)
        ]

        if not files:
            raise Exception("No images found in input folder")

        latest_file = max(files, key=lambda f: (os.path.getmtime(f), f))

        print(f"[SendToComfyUI] Loading: {latest_file}")

        with Image.open(latest_file) as img:
            img = ImageOps.exif_transpose(img)
            image = img.convert("RGB")

        image_np = np.array(image).astype(np.float32) / 255.0
        image_tensor = torch.from_numpy(image_np)[None,]

        return (image_tensor,)

    @classmethod
    def IS_CHANGED(cls):
        input_dir = folder_paths.get_input_directory()
        valid_ext = (".png", ".jpg", ".jpeg", ".webp", ".bmp")

        files = [
            os.path.join(input_dir, f)
            for f in os.listdir(input_dir)
            if f.lower().endswith(valid_ext)
        ]

        if not files:
            return float("NaN")

        latest_file = max(files, key=lambda f: (os.path.getmtime(f), f))

        return str(os.path.getmtime(latest_file))


NODE_CLASS_MAPPINGS = {
    "LoadLatestImage": LoadLatestImage
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LoadLatestImage": "Load Latest Image"
}
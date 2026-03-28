#!/usr/bin/env python3
"""
Generate images using Google Gemini API directly via generativelanguage.googleapis.com.
This bypasses proxies that block openrouter.ai by using the Google endpoint directly.
Supports both text-to-image and image-to-image generation.

Required env var: GOOGLE_API_KEY (from https://aistudio.google.com/apikey)
Optional env var: OPENROUTER_API_KEY (legacy, not used)
"""

import argparse
import base64
import os
import sys
import json
from pathlib import Path

try:
    import urllib.request
    import urllib.error
except ImportError:
    print("ERROR: urllib not available (should be in stdlib)")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional


def get_api_key():
    """Get Google AI API key from environment."""
    key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GOOGLE_API_KEY environment variable not set.")
        print("Get a free key at: https://aistudio.google.com/apikey")
        print("Then add it to your .env file: GOOGLE_API_KEY=your-key-here")
        sys.exit(1)
    return key


def encode_image(image_path: str) -> tuple[str, str]:
    """Encode an image file to base64, return (base64_data, mime_type)."""
    ext = Path(image_path).suffix.lower()
    mime_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    mime = mime_types.get(ext, "image/jpeg")
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8"), mime


def call_gemini_api(api_key: str, model: str, parts: list, output_path: str) -> bool:
    """Call Gemini API and save the resulting image."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    payload = json.dumps({
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["image", "text"]}
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            err = json.loads(body)
            print(f"ERROR: {err.get('error', {}).get('message', body)}")
        except Exception:
            print(f"ERROR: HTTP {e.code}: {body[:500]}")
        return False
    except urllib.error.URLError as e:
        print(f"ERROR: Connection failed: {e.reason}")
        print("Is generativelanguage.googleapis.com reachable?")
        return False

    # Extract image from response
    try:
        candidates = data.get("candidates", [])
        for candidate in candidates:
            for part in candidate.get("content", {}).get("parts", []):
                if "inlineData" in part:
                    inline = part["inlineData"]
                    image_bytes = base64.b64decode(inline["data"])

                    output_dir = os.path.dirname(output_path)
                    if output_dir:
                        os.makedirs(output_dir, exist_ok=True)

                    with open(output_path, "wb") as f:
                        f.write(image_bytes)

                    print(f"SUCCESS: Image saved to {output_path}")
                    return True

                if "text" in part and part["text"]:
                    print(f"Model text: {part['text'][:200]}")

    except Exception as e:
        print(f"ERROR parsing response: {e}")
        print(f"Response: {json.dumps(data)[:500]}")
        return False

    print("ERROR: No image found in response. Model may not support image generation.")
    print("Try model: gemini-2.0-flash-preview-image-generation")
    return False


def generate_from_text(prompt: str, output_path: str, model: str) -> bool:
    """Generate an image from a text prompt."""
    api_key = get_api_key()
    print(f"Generating image with model: {model}")
    print(f"Prompt: {prompt[:120]}...")

    parts = [{"text": prompt}]
    return call_gemini_api(api_key, model, parts, output_path)


def generate_from_image(input_image: str, prompt: str, output_path: str, model: str) -> bool:
    """Generate an image based on an input image and prompt."""
    if not os.path.exists(input_image):
        print(f"ERROR: Input image not found: {input_image}")
        return False

    api_key = get_api_key()
    print(f"Generating image from: {input_image}")
    print(f"Prompt: {prompt[:120]}...")

    b64, mime = encode_image(input_image)
    parts = [
        {"text": prompt},
        {"inlineData": {"mimeType": mime, "data": b64}}
    ]
    return call_gemini_api(api_key, model, parts, output_path)


def main():
    parser = argparse.ArgumentParser(
        description="Generate images using Google Gemini API directly (generativelanguage.googleapis.com)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Setup:
  1. Get a free API key at: https://aistudio.google.com/apikey
  2. Add to .env: GOOGLE_API_KEY=your-key-here

Examples:
  # Text-to-image:
  python generate_image.py --prompt "A jungle world for a children's English learning app" --output jungle.png

  # Image-to-image:
  python generate_image.py --input photo.jpg --prompt "Make it look like watercolor" --output watercolor.png

Environment:
  GOOGLE_API_KEY   Your Google AI Studio key (required)
  GEMINI_API_KEY   Alias for GOOGLE_API_KEY
        """
    )

    parser.add_argument("--prompt", "-p", required=True,
                        help="Text prompt describing the image to generate")
    parser.add_argument("--output", "-o", default="generated_image.png",
                        help="Output file path (default: generated_image.png)")
    parser.add_argument("--input", "-i",
                        help="Optional input image for image-to-image generation")
    parser.add_argument("--model", "-m",
                        default="gemini-2.0-flash-preview-image-generation",
                        help="Gemini model (default: gemini-2.0-flash-preview-image-generation)")

    args = parser.parse_args()

    if args.input:
        success = generate_from_image(args.input, args.prompt, args.output, args.model)
    else:
        success = generate_from_text(args.prompt, args.output, args.model)

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

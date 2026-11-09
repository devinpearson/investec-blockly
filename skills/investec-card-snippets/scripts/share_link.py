#!/usr/bin/env python3
"""Make a link that opens an Investec Blockly snippet in the editor.

    python3 share_link.py snippet.json [--name "Fuel only"] [--url https://investec-blockly.vercel.app/]

The workspace JSON is compressed (raw deflate) and base64url-encoded into the
URL fragment, the same as the editor's "Copy link" button. Standard library only.
"""
import argparse
import base64
import json
import sys
import urllib.parse
import zlib

DEFAULT_URL = "https://investec-blockly.vercel.app/"


def share_url(workspace: dict, name: str | None = None, url: str = DEFAULT_URL) -> str:
    if not isinstance(workspace, dict) or not ("blocks" in workspace or "variables" in workspace):
        raise ValueError('Expected a workspace: {"blocks": {"languageVersion": 0, "blocks": [...]}}')
    data = json.dumps(workspace, separators=(",", ":")).encode()
    compressor = zlib.compressobj(9, zlib.DEFLATED, -15)  # raw deflate
    packed = compressor.compress(data) + compressor.flush()
    encoded = base64.urlsafe_b64encode(packed).decode().rstrip("=")
    extra = "&" + urllib.parse.urlencode({"name": name}) if name else ""
    return f"{url.split('#')[0]}#import={encoded}{extra}"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("file", help="workspace JSON file, or - for stdin")
    parser.add_argument("--name", help="name shown when the snippet opens")
    parser.add_argument("--url", default=DEFAULT_URL, help="editor URL")
    args = parser.parse_args()
    text = sys.stdin.read() if args.file == "-" else open(args.file, encoding="utf-8").read()
    print(share_url(json.loads(text), args.name, args.url))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
SPECTRADE Desktop Launcher (Cross-Platform: Windows 11 / Linux / macOS)
Runs a lightweight local server and opens a native standalone app window.
"""
import os
import sys
import time
import socket
import shutil
import logging
import threading
import subprocess
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("SpectradeApp")

BASE_DIR = Path(__file__).resolve().parent
PORT = 8765

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

class LocalHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def log_message(self, format, *args):
        pass

def start_server(port: int):
    server = ThreadingHTTPServer(("127.0.0.1", port), LocalHandler)
    logger.info(f"Local server listening at http://127.0.0.1:{port}")
    server.serve_forever()

def find_browser():
    # Windows & Linux browser executables
    candidates = [
        "msedge", "msedge.exe",
        "chrome", "chrome.exe", "google-chrome", "google-chrome-stable",
        "brave", "brave.exe"
    ]
    for binary in candidates:
        path = shutil.which(binary)
        if path:
            return path

    # Common Windows Program Files paths
    if sys.platform == "win32":
        win_paths = [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
        ]
        for p in win_paths:
            if os.path.exists(p):
                return p
    return None

def main():
    logger.info("Starting SPECTRADE Desktop on PC3 / Local Machine...")
    if not is_port_in_use(PORT):
        t = threading.Thread(target=start_server, args=(PORT,), daemon=True)
        t.start()
        time.sleep(0.3)

    app_url = f"http://127.0.0.1:{PORT}/index.html"
    browser = find_browser()

    if browser:
        logger.info(f"Opening desktop window with {browser}...")
        cmd = [browser, f"--app={app_url}", "--window-size=1440,920"]
        proc = subprocess.Popen(cmd)
        try:
            proc.wait()
            logger.info("Application closed.")
        except KeyboardInterrupt:
            proc.terminate()
    else:
        logger.info("Opening in default browser...")
        import webbrowser
        webbrowser.open(app_url)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    main()

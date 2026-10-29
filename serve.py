"""Local server for the gateway.

Serves the landing page from this folder and the two portfolios,
untouched and read-only, under their own paths:

    /            -> ./                   (the signboard scene)
    /version-a/  -> ./version-a          (Version A, weak prompt)
    /version-b/  -> ./version-b          (Version B, strong prompt)

HTML pages of the mounted portfolios get one extra <script> (js/back-tab.js,
the "back to the yard" tab) added to the response only; their files on disk
are never written.

Usage: python serve.py [port]   (default 5490)
"""
import io
import os
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

HERE = os.path.dirname(os.path.abspath(__file__))
MOUNTS = {
    "/version-a/": os.path.join(HERE, "version-a"),
    "/version-b/": os.path.join(HERE, "version-b"),
}


def inject_back_tab(html, depth):
    """Return html with the back-tab script before the last </body>.

    depth is how many folders the page sits below the gateway root
    (1 for version-a/index.html), so the relative src works on any host or sub-path.
    """
    tag = b'<script src="' + b"../" * depth + b'js/back-tab.js" defer></script>\n'
    if b"js/back-tab.js" in html:
        return html
    ends = [m.start() for m in re.finditer(rb"</body\s*>", html, re.I)]
    return html[:ends[-1]] + tag + html[ends[-1]:] if ends else html + tag


class GatewayHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        url_path = unquote(urlsplit(self.path).path)
        prefix = next((p for p in MOUNTS if url_path.startswith(p)), None)
        if prefix is None:
            return super().send_head()
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        if not (path.lower().endswith((".html", ".htm")) and os.path.isfile(path)):
            return super().send_head()
        with open(path, "rb") as fh:
            depth = url_path.count("/") - 1
            body = inject_back_tab(fh.read(), depth)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        return io.BytesIO(body)

    def translate_path(self, path):
        clean = unquote(urlsplit(path).path)
        for prefix, root in MOUNTS.items():
            if clean == prefix.rstrip("/"):
                # let the directory redirect add the trailing slash
                return root
            if clean.startswith(prefix):
                rel = clean[len(prefix):]
                return self._inside(root, rel)
        return self._inside(HERE, clean.lstrip("/"))

    @staticmethod
    def _inside(root, rel):
        target = os.path.normpath(os.path.join(root, *[p for p in rel.split("/") if p not in ("", ".", "..")]))
        return target if target.startswith(root) else root

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5490
    server = ThreadingHTTPServer(("127.0.0.1", port), partial(GatewayHandler, directory=HERE))
    print(f"Gateway on http://127.0.0.1:{port}/")
    server.serve_forever()

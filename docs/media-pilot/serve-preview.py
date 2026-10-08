"""Serve the private pilot locally, including byte ranges for media playback."""

import argparse
import os
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class MediaHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        origin = self.headers.get("Origin")
        if origin in getattr(self.server, "allowed_origins", ()):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        super().end_headers()

    def send_head(self):
        self.byte_range = None
        path = Path(self.translate_path(self.path)).resolve()
        root = Path(self.directory).resolve()
        if not path.is_relative_to(root):
            self.send_error(404)
            return None
        if path.is_dir():
            path = path / "index.html"
        try:
            source = path.open("rb")
        except OSError:
            self.send_error(404)
            return None
        stat = os.fstat(source.fileno())
        size = stat.st_size
        start, end = 0, size - 1
        requested = self.headers.get("Range")
        if requested:
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", requested.strip())
            valid = match is not None and bool(match[1] or match[2])
            if valid:
                first, last = match.groups()
                if first:
                    start = int(first)
                    end = min(int(last), size - 1) if last else size - 1
                    valid = start < size and start <= end
                else:
                    count = int(last)
                    valid = count > 0 and size > 0
                    start = max(0, size - count)
            if not valid:
                source.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.send_header("Content-Length", "0")
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()
                return None
            self.byte_range = (start, end)
            source.seek(start)
        self.send_response(206 if requested else 200)
        self.send_header("Content-Type", self.guess_type(str(path)))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
        self.send_header("Cache-Control", "no-cache")
        if requested:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        return source

    def copyfile(self, source, destination):
        remaining = self.byte_range[1] - self.byte_range[0] + 1 if self.byte_range else None
        try:
            while remaining is None or remaining > 0:
                block = source.read(min(256 * 1024, remaining) if remaining is not None else 256 * 1024)
                if not block:
                    break
                destination.write(block)
                if remaining is not None:
                    remaining -= len(block)
        except (BrokenPipeError, ConnectionResetError):
            # A player can abandon a preload request when it starts a new seek.
            self.close_connection = True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=3033)
    parser.add_argument("--directory", type=Path)
    parser.add_argument("--allowed-origin", action="append", default=[])
    args = parser.parse_args()
    output = args.directory or Path(__file__).resolve().parents[2] / "output" / "media-pilot"
    server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(MediaHandler, directory=str(output)))
    server.allowed_origins = tuple(args.allowed_origin)
    print(f"Private media review: http://127.0.0.1:{args.port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

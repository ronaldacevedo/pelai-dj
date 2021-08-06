import http.server
import json
import urllib
import os
import subprocess as sp
import logging
import sys

log = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout)
log.setLevel(0)

SELFPATH = os.path.dirname(os.path.realpath(__file__))
VIDEOPATH = os.path.join(SELFPATH, "videos")
AUDIOPATH = os.path.join(SELFPATH, "audios")
IMAGEPATH = os.path.join(SELFPATH, "images")
try:
    os.mkdir(VIDEOPATH)
    os.mkdir(AUDIOPATH)
    os.mkdir(IMAGEPATH)
except OSError:
    pass


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # read query
        urlpath = urllib.parse.urlparse(self.path)
        if urlpath.path == "/load":
            query = urllib.parse.parse_qs(urlpath.query)
            videourl = query["url"][0]
            debug = query.get("debug") == "1"

            # process request
            vid, title = process(videourl)

            # form response
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Type", "application/json")
            self.end_headers()

            response = {
                "title": title,
                "audio": "/audios/{0}.ogg".format(vid),
                "image": "/images/{0}.webp".format(vid),
            }
            if debug:
                response.update(
                    {
                        "videourl": str(query),
                    }
                )

            self.wfile.write(bytes(json.dumps(response), "utf8"))
        else:
            super().do_GET()


def process(videourl):
    """Download and extract audio from video url given"""
    # get video information
    cmd = [
        "youtube-dl",
        "--dump-json",
        videourl,
    ]
    out = sp.check_output(cmd)
    outjson = json.loads(out)
    vid = outjson["id"]
    title = outjson["title"]

    # download video and extract audio
    audiofile = os.path.join(AUDIOPATH, "{0}.ogg".format(vid))
    if not os.path.isfile(audiofile):
        cmd = [
            "youtube-dl",
            "--extract-audio",
            "--audio-format=vorbis",
            "--output={0}".format(audiofile.replace("ogg", "%(ext)s")),
            videourl,
        ]
        log.info("running '{0}'".format(" ".join(cmd)))
        out = sp.check_output(cmd)

    # download thumbnail
    imagefile = os.path.join(IMAGEPATH, "{0}.webp".format(vid))
    if not os.path.isfile(imagefile):
        thumbnail = outjson["thumbnail"].split("?")[0]
        thumbnail_ext = os.path.splitext(thumbnail)[1]
        notwebp = (thumbnail_ext != ".webp")
        if notwebp:
            imagefile = imagefile.replace(".webp", thumbnail_ext)
        cmd = [
            "wget",
            thumbnail,
            "-O",
            imagefile,
        ]
        log.info("running '{0}'".format(" ".join(cmd)))
        out = sp.check_output(cmd)

        if notwebp:
            cmd = [
                "convert",
                imagefile,
                imagefile.replace(thumbnail_ext, ".webp"),
            ]
            log.info("running '{0}'".format(" ".join(cmd)))
            out = sp.check_output(cmd)

    return vid, title


if __name__ == "__main__":
    with http.server.HTTPServer(('', 8000), Handler) as server:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        server.server_close()

#!/usr/bin/env python3
"""Dependency-free client. Password comes from SHARE_PASSWORD or an interactive prompt."""
import argparse
import base64
import getpass
import json
import os
import pathlib
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def main():
    parser = argparse.ArgumentParser(description='harukakaya.dev temporary file sharing')
    parser.add_argument('action', choices=['status', 'upload', 'download', 'delete'])
    parser.add_argument('path', nargs='?')
    parser.add_argument('--yes', action='store_true', help='explicitly confirm deletion')
    parser.add_argument('--base-url', default='https://harukakaya.dev')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    parsed = urllib.parse.urlparse(base)
    if parsed.scheme != 'https' and not (parsed.scheme == 'http' and parsed.hostname in ['localhost', '127.0.0.1']):
        parser.error('HTTPS is required')
    password = os.environ.get('SHARE_PASSWORD')
    if not password:
        if not sys.stdin.isatty(): parser.error('Set SHARE_PASSWORD in the environment')
        password = getpass.getpass('Shared password: ')
    opener = urllib.request.build_opener(NoRedirect)
    def call(path, method='GET', payload=None):
        body = None if payload is None else json.dumps(payload).encode()
        req = urllib.request.Request(base + path, data=body, method=method, headers={'Authorization': 'Bearer ' + password, 'Content-Type': 'application/json'})
        return opener.open(req, timeout=180)
    def status():
        with call('/api/share/file') as r: return json.load(r)
    if args.action == 'status':
        print(json.dumps(status(), ensure_ascii=False)); return
    if args.action == 'delete':
        if not args.yes: parser.error('Deletion needs --yes; never delete an existing shared file implicitly')
        with call('/api/share/file', 'DELETE') as r: print(r.read().decode()); return
    if not args.path: parser.error('Specify a local file path')
    path = pathlib.Path(args.path)
    if args.action == 'upload':
        size = path.stat().st_size
        with call('/api/share/prepare', 'POST', {'name': path.name, 'size': size}) as r: ticket = json.load(r)
        # Never send the shared password to the upload provider. This URL itself is a short-lived credential.
        target = urllib.parse.urlparse(ticket['uploadUrl'])
        if target.scheme != 'https' or not (target.hostname == 'blob.vercel-storage.com' or (target.hostname == 'vercel.com' and target.path.startswith('/api/blob/'))): raise ValueError('Unexpected upload destination')
        with tempfile.TemporaryFile() as body:
            body.write(base64.b64decode(ticket['prefixBase64']))
            with path.open('rb') as source:
                while chunk := source.read(1024*1024): body.write(chunk)
            if body.tell() != ticket['contentLength']: raise ValueError('File changed while preparing upload')
            body.seek(0)
            req = urllib.request.Request(ticket['uploadUrl'], data=body, method='PUT', headers={**ticket['headers'], 'Content-Length': str(ticket['contentLength'])})
            with opener.open(req, timeout=600) as response: response.read()
        print(json.dumps(status(), ensure_ascii=False)); return
    info = status().get('file')
    if not info: raise ValueError('No file is shared')
    if info['expired']: raise ValueError('Download expired')
    # Exclusive creation protects existing local files and ignores remote filenames as paths.
    try:
        with path.open('xb') as output:
            try:
                with call('/api/share/file?download=1') as response:
                    while chunk := response.read(1024*1024): output.write(chunk)
                if output.tell() != info['size']: raise ValueError('Incomplete download')
            except BaseException:
                output.close(); path.unlink(missing_ok=True); raise
    except FileExistsError: raise ValueError('Destination exists; choose a new path')
    print(json.dumps({'saved': str(path), 'size': info['size']}, ensure_ascii=False))

if __name__ == '__main__':
    try: main()
    except urllib.error.HTTPError as error:
        # Do not print a presigned URL or credentials from transport exception messages.
        print(json.dumps({'error': 'HTTP request failed', 'status': error.code}), file=sys.stderr); sys.exit(1)
    except (ValueError, OSError) as error:
        print(json.dumps({'error': str(error)}), file=sys.stderr); sys.exit(1)

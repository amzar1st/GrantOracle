"""Prepare a verified official GenVM runner bundle for both test tools.

GenVM 0.3 renamed genvm-universal.tar.xz to genvm-runners-all.tar.xz.
The pinned direct-test SDK still requests the old name; the official linter's
asset resolver supports both. Share its verified bundle under the legacy cache
filename, without patching SDK behavior or contract code.
"""
from pathlib import Path
import hashlib
import shutil
from genvm_linter.validate.artifacts import download_artifacts

VERSION = 'v0.3.0-rc7'
SHA256 = 'e218a1854214681560351051f76fe2b878545cf3409455ef372d57014a88ca67'
source = download_artifacts(VERSION)
with source.open('rb') as stream:
    actual = hashlib.file_digest(stream, 'sha256').hexdigest()
if actual != SHA256:
    raise RuntimeError('Official GenVM runner bundle SHA-256 mismatch')
target = Path.home() / '.cache' / 'gltest-direct' / f'genvm-universal-{VERSION}.tar.xz'
target.parent.mkdir(parents=True, exist_ok=True)
if not target.exists():
    shutil.copyfile(source, target)
else:
    with target.open('rb') as stream:
        if hashlib.file_digest(stream, 'sha256').hexdigest() != SHA256:
            raise RuntimeError('Direct-mode cached bundle SHA-256 mismatch')
print(f'Verified official GenVM {VERSION} runner bundle for lint and direct tests.')

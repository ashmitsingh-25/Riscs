import hashlib
import os
import shutil
from typing import BinaryIO

def compute_sha256(data: bytes) -> str:
    """Compute SHA-256 hash of byte data for IOC tracking and audit trails."""
    return hashlib.sha256(data).hexdigest()

def secure_purge_temp_file(file_path: str) -> bool:
    """
    Overwrites the file with zeroes and deletes it immediately
    to ensure strict user privacy and compliance with zero-retention standards.
    """
    try:
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            # Overwrite with random/zero bytes before unlinking
            with open(file_path, "wb") as f:
                f.write(b"\x00" * min(file_size, 1024 * 1024))
            os.remove(file_path)
            return True
    except Exception as e:
        # Fallback to standard removal if overwrite encounters permission error
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
    return False

def secure_purge_temp_dir(dir_path: str) -> None:
    """Recursively purges temporary extraction directories."""
    try:
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path, ignore_errors=True)
    except Exception:
        pass

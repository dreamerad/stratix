import hashlib
import hmac
import os


class PasswordHelper:
    def __init__(self) -> None:
        pass

    def hash(self, password: str) -> str:
        salt = os.urandom(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
        return salt.hex() + ":" + password_hash.hex()

    def validate(self, password_hash: str, password_plain: str) -> bool:
        if ":" not in password_hash:
            return False

        salt_hex, hash_hex = password_hash.split(":")
        salt, hash = bytes.fromhex(salt_hex), bytes.fromhex(hash_hex)
        return hmac.compare_digest(hash, hashlib.pbkdf2_hmac("sha256", password_plain.encode(), salt, 100000))

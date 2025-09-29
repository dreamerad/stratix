from enum import Enum

from pydantic import BaseModel


class AccountAttribute(str, Enum):
    admin = "admin"


class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"


class TokenData(BaseModel):
    account_id: int
    is_admin: bool
    name: str
    attributes: list[AccountAttribute]

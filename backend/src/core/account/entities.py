import datetime as dt

from pydantic import BaseModel


class Account(BaseModel):
    id: int
    name: str
    password_hash: str
    is_admin: bool
    created_at: dt.datetime


class AccountCreate(BaseModel):
    name: str
    password_hash: str


class AccountUpdate(BaseModel):
    name: str | None = None
    password_hash: str | None = None

import datetime as dt
from enum import Enum

from pydantic import BaseModel

from src.core.auth.entities import AccountAttribute


class Account(BaseModel):

    id: int
    name: str
    password_hash: str
    attributes: list[AccountAttribute]
    created_at: dt.datetime


class AccountCreate(BaseModel):

    name: str
    password_hash: str
    attributes: list[AccountAttribute]


class AccountUpdate(BaseModel):
    name: str | None = None
    attributes: list[AccountAttribute] | None = None
    password_hash: str | None = None







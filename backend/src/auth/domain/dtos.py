import datetime
from uuid import UUID

from pydantic import BaseModel

from src.core.auth.entities import AccountAttribute


class AccountDTO(BaseModel):
    id: int
    name: str
    attributes: list[AccountAttribute]
    created_at: datetime.datetime


class RegisterDTO(BaseModel):
    name: str
    password: str
    attributes: list[AccountAttribute]


class LoginDTO(BaseModel):
    name: str
    password: str


class RegisterServiceDTO(BaseModel):
    api_id: UUID
    name: str
    password: str
    attributes: list[AccountAttribute]


class AuthTokenDTO(BaseModel):
    access_token: str
    token_type: str


class RegisterResponseDTO(BaseModel):
    user: AccountDTO
    token: AuthTokenDTO
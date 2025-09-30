import datetime
from uuid import UUID

from pydantic import BaseModel



class AccountDTO(BaseModel):
    id: int
    name: str
    created_at: datetime.datetime


class RegisterDTO(BaseModel):
    name: str
    password: str


class LoginDTO(BaseModel):
    name: str
    password: str


class RegisterServiceDTO(BaseModel):
    api_id: UUID
    name: str
    password: str


class AuthTokenDTO(BaseModel):
    access_token: str
    token_type: str


class RegisterResponseDTO(BaseModel):
    user: AccountDTO
    token: AuthTokenDTO
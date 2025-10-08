from pydantic import BaseModel

from src.core.auth.entities import Token, TokenData


class AuthenticationAttribute(BaseModel):
    name: str


class Register(BaseModel):
    name: str
    password_hash: str


class Login(BaseModel):
    name: str
    password: str


class AuthToken(Token):
    pass


class AuthTokenData(TokenData):
    pass

class ChangePasswordDTO(BaseModel):
    current_password: str
    new_password: str

class ChangeUsernameDTO(BaseModel):
    new_name: str
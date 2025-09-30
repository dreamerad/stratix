from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from src.auth.application.interfaces.auth_provider import IAuthProvider
from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.auth.application.use_cases.parse_token import ParseTokenUseCase
from src.auth.domain.entities import AuthTokenData
from src.auth.infrastructure.db.unit_of_work import PGAuthUnitOfWork
from src.auth.infrastructure.jwt_auth_provider import JWTAuthProvider
from src.auth.infrastructure.password_helper import PasswordHelper
from src.core.auth.exceptions import UnauthorizedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_auth_uow() -> IAuthUnitOfWork:
    return PGAuthUnitOfWork()


def get_auth_provider() -> IAuthProvider:
    return JWTAuthProvider()


async def parse_access_token(token: str = Depends(oauth2_scheme),
                             auth_provider: IAuthProvider = Depends(get_auth_provider)) -> AuthTokenData:
    token_data = await ParseTokenUseCase(auth_provider, token).execute()
    return token_data


def validate_page_access(admin_required: bool = False):
    async def _validate(token_data: AuthTokenData = Depends(parse_access_token)):
        if admin_required and not token_data.is_admin:
            raise UnauthorizedException()

    return _validate


PasswordHelperDepend = Annotated[PasswordHelper, Depends(PasswordHelper)]
AuthUoWDepend = Annotated[IAuthUnitOfWork, Depends(get_auth_uow)]
AuthProviderDepend = Annotated[IAuthProvider, Depends(get_auth_provider)]

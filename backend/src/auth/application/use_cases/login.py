from src.auth.application.interfaces.auth_provider import IAuthProvider
from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.auth.domain.dtos import LoginDTO
from src.auth.domain.entities import AuthToken, AuthTokenData
from src.auth.infrastructure.password_helper import PasswordHelper
from src.core.account.entities import Account
from src.core.auth.exceptions import UnauthorizedException
from src.db.exceptions import DBModelNotFoundException


class LoginUseCase:
    def __init__(self, auth_uow: IAuthUnitOfWork, provider: IAuthProvider, password_helper: PasswordHelper) -> None:
        self.auth_uow = auth_uow
        self.provider = provider
        self.password_helper = password_helper

    async def execute(self, dto: LoginDTO) -> AuthToken:
        async with self.auth_uow:
            try:
                account = await self.auth_uow.accounts.get_by_name(dto.name)
            except DBModelNotFoundException:
                raise UnauthorizedException()
            await self.validate(dto, account)

        return self.generate_token(account)

    def generate_token(self, account: Account) -> AuthToken:
        token_data = AuthTokenData(account_id=account.id, attributes=account.attributes)
        return self.provider.generate_token(token_data)

    async def validate(self, dto: LoginDTO, account: Account):
        if not self.password_helper.validate(account.password_hash, dto.password):
            raise UnauthorizedException()

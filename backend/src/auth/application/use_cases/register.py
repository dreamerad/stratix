from fastapi import HTTPException

from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.auth.application.interfaces.auth_provider import IAuthProvider
from src.auth.domain.dtos import RegisterDTO, RegisterResponseDTO, AccountDTO, AuthTokenDTO
from src.auth.domain.entities import AuthTokenData
from src.auth.exceptions import UserAlreadyExistsException
from src.auth.infrastructure.password_helper import PasswordHelper
from src.core.account.entities import Account, AccountCreate
from src.db.exceptions import DBModelNotFoundException


class RegisterUseCase:
    def __init__(self, auth_uow: IAuthUnitOfWork, password_helper: PasswordHelper, auth_provider: IAuthProvider):
        self.auth_uow = auth_uow
        self.password_helper = password_helper
        self.auth_provider = auth_provider

    async def execute(self, dto: RegisterDTO) -> RegisterResponseDTO:
        password_hash = self.password_helper.hash(dto.password)
        data = AccountCreate(**dto.model_dump(exclude={"password"}), password_hash=password_hash)

        async with self.auth_uow:
            try:
                existing_account = await self.auth_uow.accounts.get_by_name(dto.name)
                # Если дошли сюда - пользователь найден
                raise UserAlreadyExistsException(dto.name)
            except DBModelNotFoundException:
                # Пользователь не найден - можем создавать
                pass

            # Создаем нового пользователя
            account = await self.auth_uow.accounts.create(data)
            await self.auth_uow.commit()

        # Генерируем токен
        token_data = AuthTokenData(account_id=account.id, attributes=account.attributes)
        token = self.auth_provider.generate_token(token_data)

        return RegisterResponseDTO(
            user=AccountDTO(
                id=account.id,
                name=account.name,
                attributes=account.attributes,
                created_at=account.created_at
            ),
            token=AuthTokenDTO(
                access_token=token.access_token,
                token_type=token.token_type
            )
        )
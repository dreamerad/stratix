from fastapi import HTTPException

from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.auth.domain.dtos import RegisterDTO
from src.auth.infrastructure.password_helper import PasswordHelper
from src.core.account.entities import Account, AccountCreate
from src.db.exceptions import DBModelConflictException


class RegisterUseCase:
    def __init__(self, auth_uow: IAuthUnitOfWork, password_helper: PasswordHelper):
        self.auth_uow = auth_uow
        self.password_helper = password_helper

    async def execute(self, dto: RegisterDTO) -> Account:
        password_hash = self.password_helper.hash(dto.password)
        data = AccountCreate(**dto.model_dump(exclude={"password"}), password_hash=password_hash)

        async with self.auth_uow:
            try:
                account = await self.auth_uow.accounts.create(data)
            except DBModelConflictException as e:
                if "duplicate key value violates unique constraint" in str(e):
                    raise HTTPException(status_code=409, detail="Conflict")
                raise e
            await self.auth_uow.commit()

        return account

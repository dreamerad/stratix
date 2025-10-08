from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.auth.domain.entities import ChangeUsernameDTO
from src.core.auth.exceptions import UnauthorizedException
from src.db.exceptions import DBModelNotFoundException, DBModelConflictException
from fastapi import HTTPException


class ChangeUsernameUseCase:
    def __init__(self, auth_uow: IAuthUnitOfWork):
        self.auth_uow = auth_uow

    async def execute(self, dto: ChangeUsernameDTO, account_id: int) -> dict:
        async with self.auth_uow:
            try:
                account = await self.auth_uow.accounts.get_by_pk(account_id)
            except DBModelNotFoundException:
                raise UnauthorizedException()

            from src.core.account.entities import AccountUpdate
            update_data = AccountUpdate(name=dto.new_name)

            try:
                await self.auth_uow.accounts.update_by_pk(account_id, update_data)
                await self.auth_uow.commit()
            except DBModelConflictException as e:
                if "duplicate key value violates unique constraint" in str(e):
                    raise HTTPException(status_code=409, detail="Username already exists")
                raise e

        return {"message": "Username changed successfully", "name": dto.new_name}
from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.auth.domain.entities import ChangePasswordDTO
from src.auth.infrastructure.password_helper import PasswordHelper
from src.core.auth.exceptions import UnauthorizedException
from src.db.exceptions import DBModelNotFoundException


class ChangePasswordUseCase:
    def __init__(self, auth_uow: IAuthUnitOfWork, password_helper: PasswordHelper):
        self.auth_uow = auth_uow
        self.password_helper = password_helper

    async def execute(self, dto: ChangePasswordDTO, account_id: int) -> dict:
        async with self.auth_uow:
            try:
                account = await self.auth_uow.accounts.get_by_pk(account_id)
            except DBModelNotFoundException:
                raise UnauthorizedException()

            if not self.password_helper.validate(account.password_hash, dto.current_password):
                raise UnauthorizedException("Current password is incorrect")

            new_password_hash = self.password_helper.hash(dto.new_password)

            from src.core.account.entities import AccountUpdate
            update_data = AccountUpdate(password_hash=new_password_hash)
            await self.auth_uow.accounts.update_by_pk(account_id, update_data)
            await self.auth_uow.commit()

        return {"message": "Password changed successfully"}
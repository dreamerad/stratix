from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.account.entities import AccountUpdate, Account, AccountCreate
from src.core.account.interfaces import IAccountRepository
from src.core.account.orm import AccountDB
from src.db.exceptions import DBModelNotFoundException, DBModelConflictException


class PGAccountRepository(IAccountRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def flush(self):
        try:
            await self.session.flush()
        except IntegrityError as e:
            raise DBModelConflictException("Model can't be created/changed: " + str(e)) from e

    async def get_by_name(self, name: str) -> Account:
        query = select(AccountDB).filter(AccountDB.name == name)
        model = await self.session.scalar(query)

        if model is None:
            raise DBModelNotFoundException()

        return self._to_domain(model)

    async def create(self, data: AccountCreate) -> Account:
        model = AccountDB(**data.model_dump(exclude={"attributes"}))
        self.session.add(model)
        await self.flush()

        return self._to_domain(model)

    async def get_by_pk(self, pk: int) -> Account:
        model = await self.session.get(AccountDB, pk)
        if model is None:
            raise DBModelNotFoundException()
        return self._to_domain(model)

    async def update_by_pk(self, pk: int, data: AccountUpdate) -> Account:
        model = await self.session.get(AccountDB, pk)
        if model is None:
            raise DBModelNotFoundException()

        for k, v in data.model_dump(exclude={"attributes"}, exclude_none=True).items():
            setattr(model, k, v)

        self.session.add(model)
        await self.flush()

        return await self.get_by_pk(pk)

    async def delete_by_pk(self, pk: int) -> None:
        model = await self.session.get(AccountDB, pk)
        if model is None:
            raise DBModelNotFoundException()
        await self.session.delete(model)
        await self.flush()

    @staticmethod
    def _to_domain(model: AccountDB) -> Account:
        attributes = []

        return Account(
            id=model.id,
            name=model.name,
            password_hash=model.password_hash,
            attributes=attributes,
            created_at=model.created_at
        )

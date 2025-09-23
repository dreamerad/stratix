import abc

from src.core.account.entities import Account, AccountCreate, AccountUpdate


class IAccountRepository(abc.ABC):
    @abc.abstractmethod
    async def create(self, data: AccountCreate) -> Account: ...

    @abc.abstractmethod
    async def get_by_pk(self, pk: int) -> Account: ...

    @abc.abstractmethod
    async def get_by_name(self, name: str) -> Account: ...

    @abc.abstractmethod
    async def update_by_pk(self, pk: int, data: AccountUpdate) -> Account: ...

    @abc.abstractmethod
    async def delete_by_pk(self, pk: int) -> None: ...

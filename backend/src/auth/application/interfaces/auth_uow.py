import abc

from src.core.account.interfaces import IAccountRepository


class IAuthUnitOfWork(abc.ABC):
    accounts: IAccountRepository

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self._rollback()

    @abc.abstractmethod
    async def _rollback(self): ...

    @abc.abstractmethod
    async def commit(self): ...
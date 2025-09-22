from src.auth.application.interfaces.auth_uow import IAuthUnitOfWork
from src.core.account.repository import PGAccountRepository
from src.db.engine import async_session_maker


class PGAuthUnitOfWork(IAuthUnitOfWork):
    def __init__(self, session_factory=async_session_maker):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.accounts = PGAccountRepository(self.session)
        return await super().__aenter__()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self._rollback()

    async def commit(self):
        await self.session.commit()

    async def _rollback(self):
        await self.session.rollback()
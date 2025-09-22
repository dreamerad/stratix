import abc
import datetime as dt

from src.auth.domain.entities import AuthToken, AuthTokenData


class IAuthProvider(abc.ABC):
    @abc.abstractmethod
    def generate_token(self, data: AuthTokenData, expire_at: dt.datetime | None = None) -> AuthToken: ...

    @abc.abstractmethod
    def validate_token(self, token_raw: str) -> AuthTokenData: ...

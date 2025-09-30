from src.auth.application.interfaces.auth_provider import IAuthProvider
from src.auth.domain.entities import AuthToken, AuthTokenData
from src.core.auth.entities import AccountAttribute


class FakeAuthProvider(IAuthProvider):
    def generate_token(self, data: AuthTokenData) -> AuthToken:
        return AuthToken(access_token=str(data.account_id))

    def validate_token(self, token_raw: str) -> AuthTokenData:
        assert token_raw.count(":") == 1
        account_id = token_raw.split(":")
        return AuthTokenData(account_id=int(account_id))

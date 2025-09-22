from src.auth.application.interfaces.auth_provider import IAuthProvider
from src.auth.domain.entities import AuthToken, AuthTokenData
from src.core.auth.entities import AccountAttribute


class FakeAuthProvider(IAuthProvider):
    def generate_token(self, data: AuthTokenData) -> AuthToken:
        return AuthToken(access_token=str(data.account_id) + ":" + ",".join(map(lambda i: i.value, data.attributes)))

    def validate_token(self, token_raw: str) -> AuthTokenData:
        assert token_raw.count(":") == 1
        account_id, attributes = token_raw.split(":")
        assert account_id.isdigit()
        attributes = attributes.split(",")
        attributes = list(map(lambda i: AccountAttribute(i), attributes))
        return AuthTokenData(account_id=int(account_id), attributes=attributes)

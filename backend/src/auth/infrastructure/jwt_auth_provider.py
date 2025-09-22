import datetime as dt
from typing import Any

import jwt
from jwt.exceptions import InvalidTokenError
from src.auth.application.interfaces.auth_provider import IAuthProvider
from src.auth.domain.entities import AuthToken, AuthTokenData
from src.core.auth.entities import AccountAttribute
from src.core.auth.exceptions import UnauthorizedException
from src.core.config import settings


class JWTAuthProvider(IAuthProvider):
    ACCESS_TOKEN_EXPIRE = settings.ACCESS_TOKEN_EXPIRE

    def generate_token(self, data: AuthTokenData, expire_at: dt.datetime | None = None) -> AuthToken:
        if expire_at is None:
            expire_at = dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=self.ACCESS_TOKEN_EXPIRE)
        to_encode = {"exp": expire_at, "sub": str(data.account_id), "scope": " ".join(i.value for i in data.attributes)}
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
        return AuthToken(access_token=encoded_jwt)

    def _validate_payload(self, payload: dict[str, Any]) -> AuthTokenData:
        account_id = payload.get("sub")
        if account_id is None:
            raise UnauthorizedException()

        scope = payload.get("scope")
        if scope is None:
            raise UnauthorizedException()

        expire = payload.get("exp")
        if expire is None:
            raise UnauthorizedException()
        elif dt.datetime.now(dt.timezone.utc) > dt.datetime.fromtimestamp(expire, tz=dt.timezone.utc):
            raise UnauthorizedException()

        attributes = []
        for attribute in scope.split(" "):
            if attribute not in AccountAttribute:
                raise UnauthorizedException()
            attributes.append(AccountAttribute(attribute))

        return AuthTokenData(account_id=int(account_id), attributes=attributes)

    def validate_token(self, token_raw: str) -> AuthTokenData:
        try:
            payload = jwt.decode(token_raw, settings.SECRET_KEY, algorithms=["HS256"])
            return self._validate_payload(payload)
        except InvalidTokenError as e:
            raise UnauthorizedException()

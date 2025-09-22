from src.auth.application.interfaces.auth_provider import IAuthProvider

from src.auth.domain.entities import AuthTokenData


class ParseTokenUseCase:
    def __init__(self, auth_provider: IAuthProvider, token: str):
        self.auth_provider = auth_provider
        self.token = token

    async def execute(self) -> AuthTokenData:
        # TODO Решить как лучше, хранить аттрибуты в токене или доставать их из БД
        return self.auth_provider.validate_token(self.token)

import os
from typing import Literal
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: Literal['test', 'dev', 'prod'] = 'prod'
    PROJECT_NAME: str = "Pool Backend"
    SECRET_KEY: str = "your-secret-key-here"
    DOMAIN: str
    ACCESS_TOKEN_EXPIRE: int = 24 * 60 * 60 * 60

    # Database configuration from env
    DB_TYPE: str = "ASYNC_POSTGRESQL"
    DB_NAME: str = "db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres123"
    DB_HOST: str = "db"
    DB_PORT: int = 5432

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def ALEMBIC_DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()
from typing import Annotated

from fastapi import Depends

from src.auth.api.dependencies import parse_access_token
from src.auth.domain.entities import AuthTokenData
from src.core.http.api_client import HttpApiClient
from src.core.http.dependencies import get_http_client
from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.infrastructure.http.mining_api_client import HttpMiningApiClient


def get_mining_client() -> IMiningApiClient:
    http_client = get_http_client()
    api_client = HttpApiClient(
        client=http_client,
        source_url="http://31.172.74.29:8501"
    )
    return HttpMiningApiClient(api_client)


MiningClientDepend = Annotated[IMiningApiClient, Depends(get_mining_client)]
AuthTokenDepend = Annotated[AuthTokenData, Depends(parse_access_token)]
from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import WorkersResponseDTO, ProxiesResponseDTO, CreateProxyDTO, ProxyCreateResponseDTO
from src.mining.domain.enum import CurrencyType


class UpdateProxyStatusUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, proxy_id: str, status: str) -> str:
        return await self.mining_client.update_status_proxy(proxy_id, status)

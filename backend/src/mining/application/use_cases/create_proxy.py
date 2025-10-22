from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import WorkersResponseDTO, ProxiesResponseDTO, CreateProxyDTO, ProxyCreateResponseDTO
from src.mining.domain.enum import CurrencyType


class AddProxyUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, proxy_data: CreateProxyDTO) -> ProxyCreateResponseDTO:
        return await self.mining_client.add_proxy(proxy_data)
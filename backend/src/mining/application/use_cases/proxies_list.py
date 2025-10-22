from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import WorkersResponseDTO, ProxiesResponseDTO
from src.mining.domain.enum import CurrencyType


class ProxiesListUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self) -> ProxiesResponseDTO:
        proxies = await self.mining_client.get_proxies_list()
        return proxies
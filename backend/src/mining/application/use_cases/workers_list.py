from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import WorkersResponseDTO
from src.mining.domain.enum import CurrencyType


class WorkersListUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, currency: CurrencyType) -> WorkersResponseDTO:
        workers = await self.mining_client.get_workers_list(currency)
        return WorkersResponseDTO(workers=workers)

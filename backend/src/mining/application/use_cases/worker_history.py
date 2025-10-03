from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import WorkersResponseDTO, WorkerHistoryResponseDTO
from src.mining.domain.enum import CurrencyType


class WorkerHistoryUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, worker: str, hours: int, currency: CurrencyType) -> WorkerHistoryResponseDTO:
        return await self.mining_client.get_worker_history(worker, hours, currency)

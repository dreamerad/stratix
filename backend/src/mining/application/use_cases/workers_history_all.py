from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import WorkersHistoryAllResponseDTO, WorkerHistoryAllDataPoint
from src.mining.domain.enum import CurrencyType


class WorkersHistoryAllUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, hours: int, currency: CurrencyType) -> WorkersHistoryAllResponseDTO:
        raw_data = await self.mining_client.get_workers_history_all(hours, currency)

        workers_data = {}
        for worker_name, points in raw_data.workers.items():
            workers_data[worker_name] = [
                WorkerHistoryAllDataPoint(**point.dict()) for point in points
            ]

        return WorkersHistoryAllResponseDTO(
            hours=raw_data.hours,
            currency=raw_data.currency,
            workers=workers_data
        )
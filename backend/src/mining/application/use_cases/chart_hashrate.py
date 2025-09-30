from typing import List

from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import ChartHashrateResponseDTO, \
    ChartHashrateQueryDTO, ChartDataPoint


class ChartHashrateUseCase():
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, dto: ChartHashrateQueryDTO) -> List[ChartDataPoint]:
        data = await self.mining_client.get_chart_hashrate(dto.currency, dto.hours)
        return data
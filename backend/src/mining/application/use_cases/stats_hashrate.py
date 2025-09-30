from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import StatsHashrateResponseDTO, StatsHashrateQueryDTO


class StatsHashrateUseCase():
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, dto: StatsHashrateQueryDTO) -> StatsHashrateResponseDTO:
        hashrate_data = await self.mining_client.get_stats_hashrate(dto.currency)

        return hashrate_data



from src.core.http.api_client import HttpApiClient
from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import StatsHashrateResponseDTO
from src.mining.domain.enum import CurrencyType


class HttpMiningApiClient(IMiningApiClient):
    def __init__(self, api: HttpApiClient):
        self.api = api

    async def get_stats_hashrate(self, currency: CurrencyType) -> StatsHashrateResponseDTO:
        response = await self.api.request("GET", f"/api/stats/hashrate?currency={currency.value}")
        print(response)
        return StatsHashrateResponseDTO(**response.data)

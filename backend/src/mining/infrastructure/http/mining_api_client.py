from typing import List

from src.core.http.api_client import HttpApiClient
from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import StatsHashrateResponseDTO, ChartDataPoint, \
    WorkerDataPoint, WorkerInfoDataPoint, WorkerHistoryResponseDTO
from src.mining.domain.enum import CurrencyType, TimeType


class HttpMiningApiClient(IMiningApiClient):
    def __init__(self, api: HttpApiClient):
        self.api = api

    async def get_stats_hashrate(self, currency: CurrencyType) -> StatsHashrateResponseDTO:
        response = await self.api.request("GET", f"/api/stats/hashrate?currency={currency.value}")
        return StatsHashrateResponseDTO(**response.data)

    async def get_chart_hashrate(self, currency: CurrencyType, hours: TimeType) -> List[ChartDataPoint]:
        params = {
            "currency": currency.value,
            "hours": int(hours.value)
        }
        response = await self.api.request("GET", f"/api/stats/chart", params=params)
        return [ChartDataPoint(**item) for item in response.data]

    async def get_workers_list(self, currency: CurrencyType) -> List[WorkerDataPoint]:
        params = {"currency": currency.value} if currency else None
        response = await self.api.request("GET", "/api/workers", params=params)
        return [WorkerDataPoint(**item) for item in response.data]

    async def get_worker_history(self, worker: str, hours: int, currency: CurrencyType) -> WorkerHistoryResponseDTO:
        params = {"currency": currency.value, "hours": hours}
        response = await self.api.request("GET", f"/api/workers/{worker}/history", params=params)

        data_points = [WorkerInfoDataPoint(**item) for item in response.data["data"]]

        return WorkerHistoryResponseDTO(
            worker=response.data["worker"],
            hours=response.data["hours"],
            data=data_points,
            currency=CurrencyType(response.data["currency"])
        )
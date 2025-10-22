from typing import List

from src.core.http.api_client import HttpApiClient
from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import StatsHashrateResponseDTO, ChartDataPoint, \
    WorkerDataPoint, WorkerInfoDataPoint, WorkerHistoryResponseDTO, WorkersHistoryAllResponseDTO, \
    WorkerHistoryAllDataPoint, ProxiesResponseDTO, ProxyDataPoint, ProxiesStats, CreateProxyDTO, ProxyCreateResponseDTO
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

    async def get_workers_history_all(self, hours: int, currency: CurrencyType) -> WorkersHistoryAllResponseDTO:
        params = {"currency": currency.value, "hours": hours}
        response = await self.api.request("GET", f"/api/workers/history/all", params=params)

        workers_data = {}
        for worker_name, points in response.data["workers"].items():
            workers_data[worker_name] = [
                WorkerHistoryAllDataPoint(**point) for point in points
            ]

        return WorkersHistoryAllResponseDTO(
            hours=response.data["hours"],
            currency=response.data["currency"],
            workers=workers_data
        )

    async def get_proxies_list(self) -> ProxiesResponseDTO:
        print("=== CLIENT GET_PROXIES_LIST START ===")

        try:
            response = await self.api.request("GET", f"/api/proxies")
            print(f"Raw response: {response}")
            print(f"Response type: {type(response)}")
            print(f"Response data: {response.data if hasattr(response, 'data') else 'No data attr'}")

            # Проверь, что response.data существует и содержит нужные ключи
            if not hasattr(response, 'data') or not response.data:
                print("ERROR: Response has no data")
                raise Exception("Empty response from API")

            if 'proxies' not in response.data:
                print(f"ERROR: No 'proxies' key in response. Keys: {list(response.data.keys())}")
                raise Exception("Invalid response format")

            proxies_data = [
                ProxyDataPoint(**proxy) for proxy in response.data["proxies"]
            ]

            return ProxiesResponseDTO(
                proxies=proxies_data,
                stats=ProxiesStats(**response.data["stats"]),
                total=response.data["total"]
            )
        except Exception as e:
            print(f"ERROR IN CLIENT: {e}")
            import traceback
            traceback.print_exc()
            raise

    async def add_proxy(self, create_proxy_data: CreateProxyDTO) -> ProxyCreateResponseDTO:
        json_data = create_proxy_data.model_dump(by_alias=True)

        response = await self.api.request("POST", "/api/proxies", json=json_data)
        return ProxyCreateResponseDTO(
            success=response.data["success"],
            id=response.data["id"],
            proxy_id=response.data["proxy_id"]
        )

    async def update_status_proxy(self, proxy_id: str, status: str) -> str:
        json_data = {"status": status}
        response = await self.api.request("PATCH", f"/api/proxies/{proxy_id}/status", json=json_data)

        return response.data["status"]
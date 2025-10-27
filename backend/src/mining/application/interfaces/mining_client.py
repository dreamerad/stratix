import abc
from typing import List, Any, Dict

from src.mining.domain.dtos import StatsHashrateResponseDTO, ChartDataPoint, WorkerDataPoint, WorkerHistoryResponseDTO, \
    WorkersHistoryAllResponseDTO, ProxiesResponseDTO, CreateProxyDTO, ProxyCreateResponseDTO, ContactSupportDTO, \
    ContactSupportResponseDTO
from src.mining.domain.enum import CurrencyType, TimeType


class IMiningApiClient(abc.ABC):
    @abc.abstractmethod
    async def get_stats_hashrate(self, currency: CurrencyType) -> StatsHashrateResponseDTO:
        pass

    @abc.abstractmethod
    async def get_chart_hashrate(self, currency: CurrencyType, hours: TimeType) -> List[ChartDataPoint]:
        pass

    @abc.abstractmethod
    async def get_workers_list(self, currency: CurrencyType) -> List[WorkerDataPoint]:
        pass

    @abc.abstractmethod
    async def get_worker_history(self, worker: str, hours: int, currency: CurrencyType) -> WorkerHistoryResponseDTO:
        pass

    @abc.abstractmethod
    async def get_workers_history_all(self, hours: int, currency: CurrencyType) -> WorkersHistoryAllResponseDTO:
        pass

    @abc.abstractmethod
    async def get_proxies_list(self) -> ProxiesResponseDTO:
        pass

    @abc.abstractmethod
    async def add_proxy(self, create_proxy_data: CreateProxyDTO) -> ProxyCreateResponseDTO:
        pass

    @abc.abstractmethod
    async def update_status_proxy(self, proxy_id: str, status: str) -> str:
        pass

    @abc.abstractmethod
    async def send_support_message(self, contact_data: ContactSupportDTO) -> ContactSupportResponseDTO:
        pass

    @abc.abstractmethod
    async def update_proxy_config(self, proxy_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        pass
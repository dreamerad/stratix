import abc
from typing import List

from src.mining.domain.dtos import StatsHashrateResponseDTO, ChartDataPoint, WorkerDataPoint, WorkerHistoryResponseDTO, \
    WorkersHistoryAllResponseDTO
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

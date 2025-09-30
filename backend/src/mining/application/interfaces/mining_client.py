import abc
from typing import List

from src.mining.domain.dtos import StatsHashrateResponseDTO, ChartDataPoint
from src.mining.domain.enum import CurrencyType, TimeType


class IMiningApiClient(abc.ABC):
    @abc.abstractmethod
    async def get_stats_hashrate(self, currency: CurrencyType) -> StatsHashrateResponseDTO:
        pass

    @abc.abstractmethod
    async def get_chart_hashrate(self, currency: CurrencyType, hours: TimeType) -> List[ChartDataPoint]:
        pass

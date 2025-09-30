import abc

from src.mining.domain.dtos import StatsHashrateResponseDTO
from src.mining.domain.enum import CurrencyType


class IMiningApiClient(abc.ABC):
    @abc.abstractmethod
    async def get_stats_hashrate(self, currency: CurrencyType) -> StatsHashrateResponseDTO:
        pass

from typing import List

from pydantic import BaseModel

from src.mining.domain.enum import CurrencyType, TimeType


class StatsHashrateQueryDTO(BaseModel):
    currency: CurrencyType

class StatsHashrateResponseDTO(BaseModel):
    current: float
    hourly: float
    daily: float
    currency: CurrencyType

class ChartHashrateQueryDTO(BaseModel):
    currency: CurrencyType
    hours: TimeType

class ChartDataPoint(BaseModel):
    timestamp: int
    rawHashrate: float
    total_hashrate: float
    currency: CurrencyType

class ChartHashrateResponseDTO(BaseModel):
    data: List[ChartDataPoint]
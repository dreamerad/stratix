from pydantic import BaseModel

from src.mining.domain.enum import CurrencyType

class StatsHashrateQueryDTO(BaseModel):
    currency: CurrencyType

class StatsHashrateResponseDTO(BaseModel):
    current: float
    hourly: float
    daily: float
    currency: CurrencyType

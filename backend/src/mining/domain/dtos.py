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

# class ServerDataPoint(BaseModel):
#     name: str
#     ip: str
#     port: str
#     minerCount: int
#     totalHasharate: float
#     isActive: bool
#     coinType: CurrencyType
#     previousMinerCount: int
#     previousHashrate: float
#     minerChange: float
#     hashrateChange: float
#     minerChangePercent: float
#     hashrateChangePercent: float
#
# class ChartHashrateResponseDTO(BaseModel):
#     servers: List[ServerDataPoint]

class WorkerDataPoint(BaseModel):
    worker: str
    hashrate: str
    raw_hashrate: float
    is_active: bool
    last_seen: int
    coinType: CurrencyType

class WorkersResponseDTO(BaseModel):
    workers: List[WorkerDataPoint]

class WorkerInfoDataPoint(BaseModel):
    timestamp: int
    raw_hashrate: float
    hashrate: str

class WorkerHistoryResponseDTO(BaseModel):
    worker: str
    hours: int
    data: List[WorkerInfoDataPoint]
    currency: CurrencyType
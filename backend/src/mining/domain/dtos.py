from datetime import datetime
from typing import List, Dict, Any, Optional, Literal

from pydantic import BaseModel, ConfigDict, Field

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


class WorkerHistoryAllDataPoint(BaseModel):
    timestamp: int
    raw_hashrate: float


class WorkersHistoryAllResponseDTO(BaseModel):
    hours: int
    currency: CurrencyType
    workers: Dict[str, List[WorkerHistoryAllDataPoint]]


class ProxyConfig(BaseModel):
    model_config = ConfigDict(extra='allow')  # Разрешаем дополнительные поля

class ProxyDataPoint(BaseModel):
    proxy_id: str
    config: Dict[str, Any]  # или ProxyConfig если нужна строгая типизация
    created_at: datetime
    updated_at: datetime
    status: str

class ProxiesStats(BaseModel):
    _id: Optional[str] = None
    total: int
    active: int
    inactive: int

class ProxiesResponseDTO(BaseModel):
    proxies: List[ProxyDataPoint]
    stats: ProxiesStats
    total: int

class FeeConfigDTO(BaseModel):
    pool: str
    worker: str
    pass_: str = Field(alias="pass")
    percent: int
    window_min: int
    window_max: int

class CustomConfigDTO(BaseModel):
    premium_user: float
    standard_user: int
    trial_user: int
    free_account: int

class DebugConfigDTO(BaseModel):
    fee: List[FeeConfigDTO]
    custom: CustomConfigDTO
    account_fees: Dict[str, Any] = {}

class StratumConfigDTO(BaseModel):
    debug: DebugConfigDTO

class ProxyConfigDTO(BaseModel):
    sha256_stratum: StratumConfigDTO = Field(alias="sha256-stratum")

class CreateProxyDTO(BaseModel):
    proxy_id: str
    config: ProxyConfigDTO

    model_config = ConfigDict(
        populate_by_name=True,
        by_alias=True
    )

class ProxyCreateResponseDTO(BaseModel):
    success: bool
    id: str
    proxy_id: str

class ContactSupportDTO(BaseModel):
    username: str = Field(..., min_length=1, max_length=100, description="Username of the sender")
    message: str = Field(..., min_length=5, max_length=500, description="Support message content")

class ContactSupportResponseDTO(BaseModel):
    message: str = Field(..., description="Response message")
    status: Literal["success", "error"] = Field(..., description="Response status")

from typing import List

from fastapi import APIRouter, Depends, Query

from src.mining.api.dependencies import AuthTokenDepend, MiningClientDepend
from src.mining.application.use_cases.chart_hashrate import ChartHashrateUseCase
from src.mining.application.use_cases.stats_hashrate import StatsHashrateUseCase
from src.mining.application.use_cases.worker_history import WorkerHistoryUseCase
from src.mining.application.use_cases.workers_history_all import WorkersHistoryAllUseCase
from src.mining.application.use_cases.workers_list import WorkersListUseCase
from src.mining.domain.dtos import StatsHashrateResponseDTO, StatsHashrateQueryDTO, ChartHashrateQueryDTO, \
    ChartDataPoint, WorkersResponseDTO, WorkerHistoryResponseDTO, WorkersHistoryAllResponseDTO
from src.mining.domain.enum import CurrencyType

router = APIRouter()


@router.get("/stats/hashrate", status_code=200, response_model=StatsHashrateResponseDTO)
async def stats_hashrate(
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        query: StatsHashrateQueryDTO = Depends()
):
    return await StatsHashrateUseCase(client).execute(query)


@router.get("/charts/", status_code=200, response_model=List[ChartDataPoint])
async def chart_hashrate(
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        query: ChartHashrateQueryDTO = Depends()
):
    return await ChartHashrateUseCase(client).execute(query)


@router.get("/workers/", status_code=200, response_model=WorkersResponseDTO)
async def workers(
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        currency: CurrencyType
):
    return await WorkersListUseCase(client).execute(currency)


@router.get("/workers/{worker}/history", status_code=200, response_model=WorkerHistoryResponseDTO)
async def worker_history(
        worker: str,
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        hours: int = Query(24),
        currency: CurrencyType = Query(...)
):
    return await WorkerHistoryUseCase(client).execute(worker, hours, currency)

@router.get("/workers/history/all", status_code=200, response_model=WorkersHistoryAllResponseDTO)
async def workers(
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        hours: int = Query(24),
        currency: CurrencyType = Query(...)
):
    return await WorkersHistoryAllUseCase(client).execute(hours, currency)
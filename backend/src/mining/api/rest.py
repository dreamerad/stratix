from typing import List

from fastapi import APIRouter, Depends, Query, Body

from src.mining.api.dependencies import AuthTokenDepend, MiningClientDepend
from src.mining.application.use_cases.chart_hashrate import ChartHashrateUseCase
from src.mining.application.use_cases.contact_support import ContactSupportUseCase
from src.mining.application.use_cases.create_proxy import AddProxyUseCase
from src.mining.application.use_cases.proxies_list import ProxiesListUseCase
from src.mining.application.use_cases.stats_hashrate import StatsHashrateUseCase
from src.mining.application.use_cases.update_status_proxy import UpdateProxyStatusUseCase
from src.mining.application.use_cases.worker_history import WorkerHistoryUseCase
from src.mining.application.use_cases.workers_history_all import WorkersHistoryAllUseCase
from src.mining.application.use_cases.workers_list import WorkersListUseCase
from src.mining.domain.dtos import StatsHashrateResponseDTO, StatsHashrateQueryDTO, ChartHashrateQueryDTO, \
    ChartDataPoint, WorkersResponseDTO, WorkerHistoryResponseDTO, WorkersHistoryAllResponseDTO, ProxiesResponseDTO, \
    CreateProxyDTO, ContactSupportDTO, ContactSupportResponseDTO
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


@router.get("/proxies", status_code=200, response_model=ProxiesResponseDTO)
async def workers(
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
):
    print(2343214234)
    return await ProxiesListUseCase(client).execute()


@router.post("/proxies", status_code=200, response_model=ProxiesResponseDTO)
async def add_proxy(
        dto: CreateProxyDTO,
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
):
    return await AddProxyUseCase(client).execute(dto)


@router.patch("/proxies/{proxy_id}/status", status_code=200, response_model=str)
async def update_proxy_status(
        proxy_id: str,
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        status: str = Body(..., embed=True),

):
    return await UpdateProxyStatusUseCase(client).execute(proxy_id, status)


@router.post("/contact", status_code=200, response_model=ContactSupportResponseDTO)
async def contact_support(
        dto: ContactSupportDTO,
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
):
    return await ContactSupportUseCase(client).execute(dto)

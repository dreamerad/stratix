from fastapi import APIRouter, Depends

from src.mining.api.dependencies import AuthTokenDepend, MiningClientDepend
from src.mining.application.use_cases.stats_hashrate import StatsHashrateUseCase
from src.mining.domain.dtos import StatsHashrateResponseDTO, StatsHashrateQueryDTO

router = APIRouter()


@router.get("/stats/hashrate", status_code=200, response_model=StatsHashrateResponseDTO)
async def stats_hashrate(
        client: MiningClientDepend,
        token_data: AuthTokenDepend,
        query: StatsHashrateQueryDTO = Depends(),
):
    return await StatsHashrateUseCase(client).execute(query)

import httpx

def create_mining_client() -> HttpMiningApiClient:
    config = MiningApiConfig(
        base_url="http://31.172.74.29:8501",
        timeout=30.0
    )
    return HttpMiningApiClient(config)
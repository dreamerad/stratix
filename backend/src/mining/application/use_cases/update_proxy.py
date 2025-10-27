from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import UpdateProxyRequestDTO, UpdateProxyResponseDTO


class UpdateProxyUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, request_data: UpdateProxyRequestDTO) -> UpdateProxyResponseDTO:
        try:
            transformed_data = self._transform_to_full_config(request_data)

            result = await self.mining_client.update_proxy_config(
                proxy_id=request_data.proxy_id,
                config=transformed_data
            )

            if result.get("success", False):
                return UpdateProxyResponseDTO(
                    success=True,
                    proxy_id=request_data.proxy_id,
                    message="Proxy configuration updated successfully"
                )
            else:
                return UpdateProxyResponseDTO(
                    success=False,
                    proxy_id=request_data.proxy_id,
                    message=result.get("error", "Failed to update proxy configuration")
                )

        except Exception as e:
            return UpdateProxyResponseDTO(
                success=False,
                proxy_id=request_data.proxy_id,
                message=f"Error updating proxy: {str(e)}"
            )

    def _transform_to_full_config(self, request_data: UpdateProxyRequestDTO) -> dict:
        config = request_data.config.sha256_stratum.debug

        transformed_fees = []
        for fee in config.fee:
            transformed_fees.append({
                "pool": "127.0.0.1:3333",
                "worker": fee.worker,
                "pass": "d=65536",
                "percent": fee.percent,
                "window_min": 600,
                "window_max": 900
            })

        transformed_account_fees = {}
        for account_name, fees in config.account_fees.items():
            transformed_account_fees[account_name] = []
            for fee in fees:
                transformed_account_fees[account_name].append({
                    "pool": "127.0.0.1:3333",
                    "worker": fee.worker,
                    "pass": "d=65536",
                    "percent": fee.percent,
                    "window_min": 600,
                    "window_max": 900
                })

        return {
            "sha256-stratum": {
                "debug": {
                    "fee": transformed_fees,
                    "custom": config.custom.model_dump(),
                    "account_fees": transformed_account_fees
                }
            }
        }
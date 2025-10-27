import os
from datetime import datetime
from typing import List

import aiohttp

from src.core.http.api_client import HttpApiClient
from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import StatsHashrateResponseDTO, ChartDataPoint, \
    WorkerDataPoint, WorkerInfoDataPoint, WorkerHistoryResponseDTO, WorkersHistoryAllResponseDTO, \
    WorkerHistoryAllDataPoint, ProxiesResponseDTO, ProxyDataPoint, ProxiesStats, CreateProxyDTO, ProxyCreateResponseDTO, \
    ContactSupportResponseDTO, ContactSupportDTO
from src.mining.domain.enum import CurrencyType, TimeType


class HttpMiningApiClient(IMiningApiClient):
    def __init__(self, api: HttpApiClient):
        self.api = api

    async def get_stats_hashrate(self, currency: CurrencyType) -> StatsHashrateResponseDTO:
        response = await self.api.request("GET", f"/api/stats/hashrate?currency={currency.value}")
        return StatsHashrateResponseDTO(**response.data)

    async def get_chart_hashrate(self, currency: CurrencyType, hours: TimeType) -> List[ChartDataPoint]:
        params = {
            "currency": currency.value,
            "hours": int(hours.value)
        }
        response = await self.api.request("GET", f"/api/stats/chart", params=params)
        return [ChartDataPoint(**item) for item in response.data]

    async def get_workers_list(self, currency: CurrencyType) -> List[WorkerDataPoint]:
        params = {"currency": currency.value} if currency else None
        response = await self.api.request("GET", "/api/workers", params=params)
        return [WorkerDataPoint(**item) for item in response.data]

    async def get_worker_history(self, worker: str, hours: int, currency: CurrencyType) -> WorkerHistoryResponseDTO:
        params = {"currency": currency.value, "hours": hours}
        response = await self.api.request("GET", f"/api/workers/{worker}/history", params=params)

        data_points = [WorkerInfoDataPoint(**item) for item in response.data["data"]]

        return WorkerHistoryResponseDTO(
            worker=response.data["worker"],
            hours=response.data["hours"],
            data=data_points,
            currency=CurrencyType(response.data["currency"])
        )

    async def get_workers_history_all(self, hours: int, currency: CurrencyType) -> WorkersHistoryAllResponseDTO:
        params = {"currency": currency.value, "hours": hours}
        response = await self.api.request("GET", f"/api/workers/history/all", params=params)

        workers_data = {}
        for worker_name, points in response.data["workers"].items():
            workers_data[worker_name] = [
                WorkerHistoryAllDataPoint(**point) for point in points
            ]

        return WorkersHistoryAllResponseDTO(
            hours=response.data["hours"],
            currency=response.data["currency"],
            workers=workers_data
        )

    async def get_proxies_list(self) -> ProxiesResponseDTO:
        print("=== CLIENT GET_PROXIES_LIST START ===")

        try:
            response = await self.api.request("GET", f"/api/proxies")
            print(f"Raw response: {response}")
            print(f"Response type: {type(response)}")
            print(f"Response data: {response.data if hasattr(response, 'data') else 'No data attr'}")

            # Проверь, что response.data существует и содержит нужные ключи
            if not hasattr(response, 'data') or not response.data:
                print("ERROR: Response has no data")
                raise Exception("Empty response from API")

            if 'proxies' not in response.data:
                print(f"ERROR: No 'proxies' key in response. Keys: {list(response.data.keys())}")
                raise Exception("Invalid response format")

            proxies_data = [
                ProxyDataPoint(**proxy) for proxy in response.data["proxies"]
            ]

            return ProxiesResponseDTO(
                proxies=proxies_data,
                stats=ProxiesStats(**response.data["stats"]),
                total=response.data["total"]
            )
        except Exception as e:
            print(f"ERROR IN CLIENT: {e}")
            import traceback
            traceback.print_exc()
            raise

    async def add_proxy(self, create_proxy_data: CreateProxyDTO) -> ProxyCreateResponseDTO:
        json_data = create_proxy_data.model_dump(by_alias=True)

        response = await self.api.request("POST", "/api/proxies", json=json_data)
        return ProxyCreateResponseDTO(
            success=response.data["success"],
            id=response.data["id"],
            proxy_id=response.data["proxy_id"]
        )

    async def update_status_proxy(self, proxy_id: str, status: str) -> str:
        json_data = {"status": status}
        response = await self.api.request("PATCH", f"/api/proxies/{proxy_id}/status", json=json_data)

        return response.data["status"]

    async def send_support_message(self, contact_data: ContactSupportDTO) -> ContactSupportResponseDTO:

        try:
            bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
            chat_id = os.getenv("TELEGRAM_SUPPORT_CHAT_ID")

            if not bot_token or not chat_id:
                return ContactSupportResponseDTO(
                    message="Telegram bot not configured",
                    status="error"
                )

            timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
            telegram_message = (
                f"🆘 <b>New Support Request</b>\n\n"
                f"👤 <b>User:</b> <code>{contact_data.username}</code>\n"
                f"🕐 <b>Time:</b> <code>{timestamp}</code>\n\n"
                f"💬 <b>Message:</b>\n<blockquote>{contact_data.message}</blockquote>"
            )

            telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

            async with aiohttp.ClientSession() as session:
                payload = {
                    "chat_id": chat_id,
                    "text": telegram_message,
                    "parse_mode": "HTML"
                }

                async with session.post(telegram_url, json=payload) as response:
                    result = await response.json()

                    if result.get("ok"):
                        return ContactSupportResponseDTO(
                            message="Your message has been sent to our support team. We'll get back to you soon!",
                            status="success"
                        )
                    else:
                        error_msg = result.get("description", "Unknown Telegram error")
                        print(f"Telegram API error: {error_msg}")
                        return ContactSupportResponseDTO(
                            message=f"Failed to send message: {error_msg}",
                            status="error"
                        )

        except Exception as e:
            import traceback
            traceback.print_exc()

            return ContactSupportResponseDTO(
                message="Failed to send support message. Please try again later.",
                status="error"
            )

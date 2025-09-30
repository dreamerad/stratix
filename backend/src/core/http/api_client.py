import json as json_lib
from typing import Type, Literal, TypeVar, Callable, Awaitable
from urllib.parse import urljoin

import aiohttp
from loguru import logger
from pydantic import BaseModel, ValidationError

from src.core.http.client import IHttpClient
from src.core.http.exceptions import HttpResponseException, HttpRequestException

T = TypeVar("T", bound=BaseModel)


class ApiResponse(BaseModel):
    cookies: dict
    data: dict | list
    headers: dict


class HttpApiClient():
    def __init__(
            self,
            client: IHttpClient,
            source_url: str,
            cookies: dict | None = None,
            token: str | None = None,
    ):
        self.token = token
        self.client = client
        self.source_url = source_url
        self.cookies = cookies or {}
        self.headers = {}

    def validate_response(self, response: dict, validator: Type[T]) -> T:
        try:
            return validator.model_validate(response)
        except ValidationError as e:
            raise HttpResponseException(e) from e

    async def request(
            self,
            method: Literal["GET", "POST", "PUT", "DELETE", "PATCH"],
            endpoint: str,
            json: dict | None = None,
            params: dict | None = None,
            headers: dict | None = None,
            cookies: dict | None = None,
            **kwargs,
    ):
        headers = headers or {}
        cookies = cookies or {}
        request_params = {
            "url": urljoin(self.source_url, endpoint),
            "headers": {**self.headers, **headers},
            "json": json,
            "params": params,
            "cookies": {**self.cookies, **cookies},
            **kwargs,
        }

        func: Callable[..., Awaitable[aiohttp.ClientResponse]] = getattr(self.client, method.lower())
        response = await func(**request_params)
        if not response.ok:
            raise HttpRequestException(await response.text())

        try:
            data = await response.json()

        except aiohttp.client_exceptions.ContentTypeError as e:
            try:
                data = json_lib.loads(await response.text())
            except json_lib.JSONDecodeError:
                raise HttpResponseException("Empty response") from e

        response_data = ApiResponse(
            data=data, cookies=dict(response.cookies.items()),
            headers=dict(response.headers.items())
        )

        logger.debug(f"Get api response to {endpoint}: {response_data}")
        return response_data

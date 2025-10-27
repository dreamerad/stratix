from src.mining.application.interfaces.mining_client import IMiningApiClient
from src.mining.domain.dtos import ContactSupportDTO, ContactSupportResponseDTO


class ContactSupportUseCase:
    def __init__(self, mining_client: IMiningApiClient):
        self.mining_client = mining_client

    async def execute(self, contact_data: ContactSupportDTO) -> ContactSupportResponseDTO:
        try:
            result = await self.mining_client.send_support_message(contact_data)
            return result
        except Exception as e:
            return ContactSupportResponseDTO(
                message=f"Failed to send support message: {str(e)}",
                status="error"
            )
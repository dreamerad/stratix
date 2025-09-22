from sqlalchemy.orm import Mapped
from sqlalchemy.testing.schema import mapped_column

from src.db.base import BaseMixin, Base


class AccountDB(BaseMixin, Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str]

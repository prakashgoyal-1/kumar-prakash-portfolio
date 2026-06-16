import uuid

import sqlalchemy as sa

from app.core.types import GUID
from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = sa.Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = sa.Column(sa.String(255), nullable=False)
    category = sa.Column(sa.String(255), nullable=False)
    level = sa.Column(sa.Integer, nullable=False, default=1)  # 1–5

    __table_args__ = (
        sa.CheckConstraint("level >= 1 AND level <= 5", name="skill_level_range"),
    )
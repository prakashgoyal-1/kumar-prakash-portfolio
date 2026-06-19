import uuid
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    rating: int = Field(ge=1, le=5)


class FeedbackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    message: str
    rating: int
    status: str
    created_at: datetime
    # Populated from presigned URL at response time — NOT stored in DB
    attachment_url: Optional[str] = None


class FeedbackStatusUpdate(BaseModel):
    status: Literal["approved", "rejected"]


class FeedbackListResponse(BaseModel):
    items: list[FeedbackOut]
    total: int
    limit: int
    offset: int
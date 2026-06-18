import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: list[str] = []
    image_url: Optional[str] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: bool = False


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    image_url: Optional[str] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: Optional[bool] = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: Optional[str] = None
    tech_stack: list[str] = []
    image_url: Optional[str] = None
    repo_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: bool
    created_at: datetime


class ProjectListResponse(BaseModel):
    items: list[ProjectOut]
    total: int
    limit: int
    offset: int
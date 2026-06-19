import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


# ── About ─────────────────────────────────────────────────────────────────────

class AboutUpdate(BaseModel):
    bio: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    # photo_url removed from update — use POST /about/photo to change photo
    # Keep for backward compat (external URL override):
    photo_url: Optional[str] = None


class AboutOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    bio: Optional[str] = None
    # photo_url is populated at response time — either from presigned URL
    # (if photo_key exists) or from the stored photo_url field
    photo_url: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None


# ── Skill ─────────────────────────────────────────────────────────────────────

class SkillCreate(BaseModel):
    name: str
    category: str
    level: int = Field(ge=1, le=5)

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = Field(default=None, ge=1, le=5)


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    category: str
    level: int


# ── Certification ─────────────────────────────────────────────────────────────

class CertificationCreate(BaseModel):
    name: str
    issuer: str
    issue_date: date
    credential_url: Optional[str] = None


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[date] = None
    credential_url: Optional[str] = None


class CertificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    issuer: str
    issue_date: date
    credential_url: Optional[str] = None
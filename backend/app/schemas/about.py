import uuid
from datetime import date

from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import Optional


# ── About ─────────────────────────────────────────────────────────────────────

class AboutUpdate(BaseModel):
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None


class AboutOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None


# ── Skill ─────────────────────────────────────────────────────────────────────

class SkillCreate(BaseModel):
    name: str
    category: str
    level: int  # 1–5 validated at DB level; add Pydantic guard too

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_level

    def validate_level(cls, v):
        if not (1 <= v <= 5):
            raise ValueError("level must be between 1 and 5")
        return v


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = None


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
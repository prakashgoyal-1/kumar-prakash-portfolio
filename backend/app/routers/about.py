import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_optional_user, require_admin
from app.models.user import User
from app.schemas.about import (
    AboutOut,
    AboutUpdate,
    CertificationCreate,
    CertificationOut,
    CertificationUpdate,
    SkillCreate,
    SkillOut,
    SkillUpdate,
)
from app.services import content_service
from typing import Optional


router = APIRouter(prefix="/api/about", tags=["about"])


# ── About (singleton) ─────────────────────────────────────────────────────────

@router.get("", response_model=Optional[AboutOut])
async def get_about(db: AsyncSession = Depends(get_db)):
    return await content_service.get_about(db)


@router.put("", response_model=AboutOut)
async def update_about(
    data: AboutUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await content_service.upsert_about(db, data)


# ── Skills ────────────────────────────────────────────────────────────────────

@router.get("/skills", response_model=list[SkillOut])
async def list_skills(db: AsyncSession = Depends(get_db)):
    return await content_service.list_skills(db)


@router.post("/skills", response_model=SkillOut, status_code=201)
async def create_skill(
    data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await content_service.create_skill(db, data)


@router.put("/skills/{skill_id}", response_model=SkillOut)
async def update_skill(
    skill_id: uuid.UUID,
    data: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await content_service.update_skill(db, skill_id, data)


@router.delete("/skills/{skill_id}", status_code=204)
async def delete_skill(
    skill_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    await content_service.delete_skill(db, skill_id)


# ── Certifications ────────────────────────────────────────────────────────────

@router.get("/certifications", response_model=list[CertificationOut])
async def list_certifications(db: AsyncSession = Depends(get_db)):
    return await content_service.list_certifications(db)


@router.post("/certifications", response_model=CertificationOut, status_code=201)
async def create_certification(
    data: CertificationCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await content_service.create_certification(db, data)


@router.put("/certifications/{cert_id}", response_model=CertificationOut)
async def update_certification(
    cert_id: uuid.UUID,
    data: CertificationUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return await content_service.update_certification(db, cert_id, data)


@router.delete("/certifications/{cert_id}", status_code=204)
async def delete_certification(
    cert_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    await content_service.delete_certification(db, cert_id)
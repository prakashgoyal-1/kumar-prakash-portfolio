import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.about import About
from app.models.certification import Certification
from app.models.skill import Skill
from app.schemas.about import (
    AboutOut,
    AboutUpdate,
    CertificationCreate,
    CertificationUpdate,
    SkillCreate,
    SkillUpdate,
)

import os
from fastapi import UploadFile, HTTPException
from app.services import storage_service

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_PHOTO_MB = 5
MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024


def _build_about_out(about: About) -> AboutOut:
    """Build AboutOut, resolving photo_url from S3 key if present."""
    out = AboutOut.model_validate(about)
    if about.photo_key:
        try:
            out.photo_url = storage_service.generate_presigned_url(
                about.photo_key,
                expires_in=3600,
            )
        except Exception:
            # Fall back to stored photo_url if presign fails
            out.photo_url = about.photo_url
    return out


async def upload_about_photo(
    db: AsyncSession, file: UploadFile
) -> AboutOut:
    # ── Validate ────────────────────────────────────────────────────────────
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type. Allowed: JPG, PNG, WEBP, GIF",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_PHOTO_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Photo too large. Max {MAX_PHOTO_MB}MB",
        )

    # ── Upload to MinIO ─────────────────────────────────────────────────────
    photo_key = f"about/photo/{uuid.uuid4()}{ext}"
    storage_service.upload_file(
        file_bytes,
        photo_key,
        file.content_type or "image/jpeg",
    )

    # ── Upsert the About row with new photo_key ─────────────────────────────
    result = await db.execute(select(About).limit(1))
    about = result.scalar_one_or_none()

    if about is None:
        about = About(id=uuid.uuid4(), photo_key=photo_key)
        db.add(about)
    else:
        # Delete old photo from MinIO if one existed
        if about.photo_key:
            try:
                storage_service.delete_file(about.photo_key)
            except Exception:
                pass  # Non-fatal — old file cleanup is best-effort
        about.photo_key = photo_key
        about.photo_url = None  # clear any old external URL override

    await db.flush()
    return _build_about_out(about)

# ── About (singleton) ─────────────────────────────────────────────────────────

async def get_about(db: AsyncSession) -> About | None:
    result = await db.execute(select(About).limit(1))
    about = result.scalar_one_or_none()
    if about is None:
        return None
    return _build_about_out(about)


async def upsert_about(db: AsyncSession, data: AboutUpdate) -> About:
    result = await db.execute(select(About).limit(1))
    about = result.scalar_one_or_none()

    if about is None:
        # First-time insert
        about = About(id=uuid.uuid4())
        db.add(about)

    # Apply only the fields that were provided (partial update)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(about, field, value)

    await db.flush()
    return about


# ── Skills ────────────────────────────────────────────────────────────────────

async def list_skills(db: AsyncSession) -> list[Skill]:
    result = await db.execute(select(Skill).order_by(Skill.category, Skill.name))
    return list(result.scalars().all())


async def create_skill(db: AsyncSession, data: SkillCreate) -> Skill:
    skill = Skill(id=uuid.uuid4(), **data.model_dump())
    db.add(skill)
    await db.flush()
    return skill


async def update_skill(
    db: AsyncSession, skill_id: uuid.UUID, data: SkillUpdate
) -> Skill:
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalar_one_or_none()
    if skill is None:
        raise NotFoundException("Skill not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)

    await db.flush()
    return skill


async def delete_skill(db: AsyncSession, skill_id: uuid.UUID) -> None:
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalar_one_or_none()
    if skill is None:
        raise NotFoundException("Skill not found")
    await db.delete(skill)
    await db.flush()


# ── Certifications ────────────────────────────────────────────────────────────

async def list_certifications(db: AsyncSession) -> list[Certification]:
    result = await db.execute(
        select(Certification).order_by(Certification.issue_date.desc())
    )
    return list(result.scalars().all())


async def create_certification(
    db: AsyncSession, data: CertificationCreate
) -> Certification:
    cert = Certification(id=uuid.uuid4(), **data.model_dump())
    db.add(cert)
    await db.flush()
    return cert


async def update_certification(
    db: AsyncSession, cert_id: uuid.UUID, data: CertificationUpdate
) -> Certification:
    result = await db.execute(
        select(Certification).where(Certification.id == cert_id)
    )
    cert = result.scalar_one_or_none()
    if cert is None:
        raise NotFoundException("Certification not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(cert, field, value)

    await db.flush()
    return cert


async def delete_certification(db: AsyncSession, cert_id: uuid.UUID) -> None:
    result = await db.execute(
        select(Certification).where(Certification.id == cert_id)
    )
    cert = result.scalar_one_or_none()
    if cert is None:
        raise NotFoundException("Certification not found")
    await db.delete(cert)
    await db.flush()
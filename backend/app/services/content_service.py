import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.about import About
from app.models.certification import Certification
from app.models.skill import Skill
from app.schemas.about import (
    AboutUpdate,
    CertificationCreate,
    CertificationUpdate,
    SkillCreate,
    SkillUpdate,
)


# ── About (singleton) ─────────────────────────────────────────────────────────

async def get_about(db: AsyncSession) -> About | None:
    result = await db.execute(select(About).limit(1))
    return result.scalar_one_or_none()


async def upsert_about(db: AsyncSession, data: AboutUpdate) -> About:
    result = await db.execute(select(About).limit(1))
    about = result.scalar_one_or_none()

    if about is None:
        # First-time insert
        about = About(id=uuid.uuid4())
        db.add(about)

    # Apply only the fields that were provided (partial update)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
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
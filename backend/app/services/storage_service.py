import logging

import boto3
from botocore.config import Config

from app.config import settings

logger = logging.getLogger(__name__)

s3 = boto3.client(
    "s3",
    endpoint_url=settings.S3_ENDPOINT_URL,
    aws_access_key_id=settings.S3_ACCESS_KEY,
    aws_secret_access_key=settings.S3_SECRET_KEY,
    # ⚠️ CRITICAL: without path-style addressing, boto3 defaults to
    # virtual-hosted-style URLs (bucket.minio:9000) which MinIO doesn't
    # resolve — uploads/downloads fail with "bucket does not exist"
    # even when the bucket exists.
    config=Config(s3={"addressing_style": "path"}),
)


def ensure_bucket_exists() -> None:
    """Create the configured bucket if it doesn't already exist.
    Called at module import time — wrapped in try/except so a
    not-yet-ready MinIO doesn't crash the whole app on startup."""
    try:
        s3.head_bucket(Bucket=settings.S3_BUCKET_NAME)
    except Exception:
        try:
            s3.create_bucket(Bucket=settings.S3_BUCKET_NAME)
            logger.info(f"Created S3 bucket: {settings.S3_BUCKET_NAME}")
        except Exception as exc:
            logger.error(f"Failed to ensure S3 bucket exists: {exc}")


# Run at module import time (not inside a function call)
try:
    ensure_bucket_exists()
except Exception as exc:
    logger.error(f"S3/MinIO not reachable at startup: {exc}")


def upload_file(file_bytes: bytes, key: str, content_type: str) -> str:
    s3.put_object(
        Bucket=settings.S3_BUCKET_NAME,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )
    return key


def generate_presigned_url(key: str, expires_in: int = 3600) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
        ExpiresIn=expires_in,
    )


def delete_file(key: str) -> None:
    s3.delete_object(Bucket=settings.S3_BUCKET_NAME, Key=key)
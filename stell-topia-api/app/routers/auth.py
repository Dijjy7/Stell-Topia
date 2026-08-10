from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.security import pwd_context, decode_token, create_access_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

fake_users_db = {
    "demo@example.com": {
        "email": "demo@example.com",
        "hashed_password": pwd_context.hash("demopass"),
    }
}


@router.post("/login", tags=["auth"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> dict:
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(subject=user["email"], expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": access_token_expires.total_seconds(),
    }


@router.post("/logout", tags=["auth"])
async def logout() -> dict:
    return {"message": "Logged out successfully"}

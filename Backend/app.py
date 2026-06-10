import datetime
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from jose import jwt
from passlib.context import CryptContext
import asyncpg
 
# JWT Security Signature Rules
SECRET_KEY = "SUPER_SECRET_PREMIUM_LAVENDER_JWT_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
 
# Direct PostgreSQL String Token Mapping Hook
DATABASE_URL = "postgresql://postgres:1234@192.168.1.8:5432/luxeshop"
 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
 
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# ==========================================
# DATA INGESTION VALIDATION SCHEMAS
# ==========================================
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
 
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
 
# ==========================================
# DATABASE CONNECTION MANAGEMENT
# ==========================================
@app.on_event("startup")
async def startup():
    app.state.db_pool = await asyncpg.create_pool(DATABASE_URL)
 
@app.on_event("shutdown")
async def shutdown():
    await app.state.db_pool.close()
 
async def get_db_conn():
    async with app.state.db_pool.acquire() as connection:
        yield connection
 
# ==========================================
# SECURITY UTILITIES
# ==========================================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
 
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
 
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
 
# ==========================================
# CORE ENDPOINTS
# ==========================================
 
# 1. HELLO WORLD PROBE (PUBLIC TEST ROUTE)
@app.get("/api/helloworld")
async def hello_world():
    return {
        "status": "success",
        "message": "Hello World! LuxeShop FastAPI backend is fully active and listening.",
        "timestamp": datetime.datetime.utcnow()
    }
 
# 2. DIRECT ACCOUNT REGISTRATION ENDPOINT
@app.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserRegisterRequest, conn = Depends(get_db_conn)):
    # Check if user email workspace is already taken
    existing_user = await conn.fetchrow("SELECT id FROM users WHERE email = $1", user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email is already allocated to an account."
        )
    # Auto-assign 'admin' to the very first row entry, all subsequent sign-ups default to 'customer'
    total_users = await conn.fetchval("SELECT COUNT(*) FROM users")
    assigned_role = "admin" if total_users == 0 else "customer"
    hashed_pass = get_password_hash(user_in.password)
    # Atomic transaction query execution inside Postgres
    await conn.execute(
        """
        INSERT INTO users (email, hashed_password, full_name, role, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        """,
        user_in.email, hashed_pass, user_in.full_name, assigned_role
    )
    return {
        "status": "success",
        "message": f"User account created successfully with '{assigned_role}' clearance parameters."
    }
 
# 3. DIRECT LOGIN ENDPOINT
@app.post("/api/login", response_model=TokenResponse)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends(), conn = Depends(get_db_conn)):
    user = await conn.fetchrow(
        "SELECT id, email, hashed_password, role FROM users WHERE email = $1", 
        form_data.username
    )
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password validation mismatch.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user["role"]
    }
from task import (
    send_welcome_email,
    send_order_confirmation_email
)
import logging
import os
import uuid
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

# ========================= LOGGING =========================
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# ========================= CONFIG =========================
SECRET_KEY = "SUPER_SECRET_PREMIUM_LAVENDER_JWT_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/ecommerce_web"

# ========================= DATABASE =========================
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ========================= APP =========================
app = FastAPI(title="LuxeShop API")
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================= PASSWORD & JWT =========================
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ========================= DB DEPENDENCY =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========================= SCHEMAS =========================
class UserRegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    # These fields can be strings or None if a standard user registers without custom SMTP configs
    sender_email: EmailStr | None = None      
    sender_password: str | None = None

class ProductCreate(BaseModel):
    name: str
    category: str = ""
    description: str = ""
    price: float
    stock: int
    image_url: str = ""
    brand: str = ""
    discount: float = 0
    weight: float = 0
    sku: str = ""

class CheckoutItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    image_url: str = ""

class CheckoutRequest(BaseModel):
    full_name: str
    address: str
    phone: str
    payment_method: str
    total_amount: float
    items: list[CheckoutItem]

class OrderStatusUpdate(BaseModel):
    status: str

class AddressCreate(BaseModel):
    label: str = "Home"
    address: str
    phone: str

class ProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: str = ""
    bio: str = ""

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1

# ========================= AUTH DEPENDENCY =========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token properties")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

# ========================= BASE DIAGNOSTICS =========================
@app.get("/")
def home():
    return {"message": "FastAPI Connected Successfully"}

@app.get("/api/helloworld")
def hello_world():
    return {"status": "success", "message": "Backend is Running!"}

@app.get("/test-user")
def test_user(user_id=Depends(get_current_user_id)):
    return {"user_id": user_id}

# ========================= USER REGISTRATION & AUTHENTICATION =========================
@app.post("/api/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    # 1. Fetch user by email (OAuth2PasswordRequestForm maps the email field to form_data.username)
    user_result = db.execute(
        text("SELECT id, username, email, password_hash, role FROM users WHERE email = :email"),
        {"email": form_data.username.strip().lower()}
    ).fetchone()

    if not user_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email credentials"
        )

    # Convert row to dictionary mapping format
    user = user_result._mapping

    # 2. Verify the incoming password against the database hash string
    # (Replace 'verify_password' with your app's actual password verification function)
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password context string"
        )

    # 3. Generate JWT access token payload (Matching the properties expected by get_current_user_id)
    # (Replace 'create_access_token' with your token signature function)
    access_token = create_access_token(data={"user_id": user["id"]})

    # 4. Return the exact JSON structure your Login.jsx file expects
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"] or "customer"
    }
# ========================= USERS SYSTEM LEDGER =========================
@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("""
                SELECT u.id, u.username, u.email, u.role, u.created_at,
                       up.first_name, up.last_name, up.phone, up.bio, up.avatar_url
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
            """)
        ).fetchall()
        return [dict(row._mapping) for row in result]
    except Exception as e:
        logger.error(f"Get users error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve user ledger profiles: {str(e)}")

@app.get("/api/users/me")
def get_my_profile(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = db.execute(
        text("SELECT id, username, email FROM users WHERE id = :id"), {"id": user_id}
    ).fetchone()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user._mapping)

# ========================= PRODUCTS DISCOVERY SYSTEM =========================
@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM products ORDER BY id")).fetchall()
    return [dict(row._mapping) for row in result]

@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM products WHERE id = :id"), {"id": product_id}).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return dict(result._mapping)

@app.post("/api/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db.execute(
        text("""
            INSERT INTO products (name, category, description, price, stock, image_url, brand, discount, weight, sku)
            VALUES (:name, :category, :description, :price, :stock, :image_url, :brand, :discount, :weight, :sku)
        """),
        {
            "name": product.name, "category": product.category, "description": product.description,
            "price": product.price, "stock": product.stock, "image_url": product.image_url,
            "brand": product.brand, "discount": product.discount, "weight": product.weight, "sku": product.sku
        }
    )
    db.commit()
    return {"message": "Product Added Successfully"}

@app.put("/api/products/{product_id}")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db.execute(
        text("""
            UPDATE products
            SET name = :name, category = :category, description = :description, price = :price, stock = :stock,
                image_url = :image_url, brand = :brand, discount = :discount, weight = :weight, sku = :sku
            WHERE id = :id
        """),
        {
            "id": product_id, "name": product.name, "category": product.category, "description": product.description,
            "price": product.price, "stock": product.stock, "image_url": product.image_url,
            "brand": product.brand, "discount": product.discount, "weight": product.weight, "sku": product.sku
        }
    )
    db.commit()
    return {"message": "Product Updated Successfully"}

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    result = db.execute(text("SELECT id FROM products WHERE id = :id"), {"id": product_id}).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    db.execute(text("DELETE FROM products WHERE id = :id"), {"id": product_id})
    db.commit()
    return {"message": "Product Deleted Successfully"}

# ========================= PERSISTENT SHOPPING CART ENGINE =========================
@app.post("/api/cart")
def add_to_cart(item: CartItemCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    existing = db.execute(
        text("SELECT id FROM cart WHERE user_id = :user_id AND product_id = :product_id"),
        {"user_id": user_id, "product_id": item.product_id}
    ).fetchone()

    if existing:
        db.execute(
            text("UPDATE cart SET quantity = quantity + :quantity WHERE id = :id"),
            {"id": existing._mapping["id"], "quantity": item.quantity}
        )
    else:
        db.execute(
            text("INSERT INTO cart (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)"),
            {"user_id": user_id, "product_id": item.product_id, "quantity": item.quantity}
        )
    db.commit()
    return {"message": "Added to cart"}

@app.get("/api/cart")
def get_cart(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    items = db.execute(
        text("""
            SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url
            FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = :user_id
        """),
        {"user_id": user_id}
    ).mappings().all()
    return items

@app.delete("/api/cart/{cart_id}")
def delete_cart_item(cart_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    db.execute(text("DELETE FROM cart WHERE id = :cart_id AND user_id = :user_id"), {"cart_id": cart_id, "user_id": user_id})
    db.commit()
    return {"message": "Item removed"}

# ========================= TRANSACTION & CHECKOUT ENGINE =========================
@app.post("/api/checkout", status_code=201)
def place_order(payload: CheckoutRequest, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
 
    # 1. Insert order into the database
    order_result = db.execute(
        text("""
            INSERT INTO orders (user_id, total_amount, status, full_name, address, phone, payment_method)
            VALUES (:user_id, :total_amount, 'Processing', :full_name, :address, :phone, :payment_method)
            RETURNING id
        """),
        {
            "user_id": user_id, "total_amount": payload.total_amount, "full_name": payload.full_name,
            "address": payload.address, "phone": payload.phone, "payment_method": payload.payment_method,
        }
    ).fetchone()
 
    order_id = order_result._mapping["id"]
 
    # 2. Convert and insert your cart items into the database
    items_payload = []
    for item in payload.items:
        db.execute(
            text("""
                INSERT INTO order_items (order_id, product_id, name, price, quantity, image_url)
                VALUES (:order_id, :product_id, :name, :price, :quantity, :image_url)
            """),
            {"order_id": order_id, "product_id": item.product_id, "name": item.name, "price": item.price, "quantity": item.quantity, "image_url": item.image_url or ""}
        )
        
        # Build the dictionary list for SendGrid's HTML table layout
        items_payload.append({
            "name": item.name,
            "quantity": item.quantity,
            "price": item.price
        })

    db.commit()

    # 3. Fetch user details AND their custom SMTP configuration from PostgreSQL
    user = db.execute(
        text("""
            SELECT email, username, sender_email, sender_password
            FROM users
            WHERE id = :id
        """),
        {"id": user_id}
    ).fetchone()

    # 4. SENDGRID FALLBACK ROUTINE
    final_sender_email = user._mapping.get("sender_email") or "YOUR_VERIFIED_SENDGRID_SENDER_EMAIL@domain.com"
    
    # ⚠️ CRITICAL: Replace with your actual master SendGrid API key (Starts with SG.)
    final_sendgrid_key = user._mapping.get("sender_password") or "SG.xxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx"

    # 5. Send data downstream to the SendGrid celery task
    send_order_confirmation_email.delay(
        recipient_email=user._mapping["email"],
        username=user._mapping["username"],
        order_id=order_id,
        total_amount=payload.total_amount,
        items=items_payload,
        sender_email=final_sender_email,
        sendgrid_api_key=final_sendgrid_key
    )

    return {"message": "Order placed successfully", "order_id": f"#ORD{order_id}", "status": "Processing"}

@app.get("/api/orders/my")
def get_my_orders(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    orders = db.execute(
        text("""
            SELECT id, total_amount, status, full_name, address, phone, payment_method, created_at
            FROM orders WHERE user_id = :user_id ORDER BY created_at DESC
        """),
        {"user_id": user_id}
    ).fetchall()

    result = []
    for order in orders:
        items = db.execute(
            text("SELECT product_id, name, price, quantity, image_url FROM order_items WHERE order_id = :order_id"),
            {"order_id": order._mapping["id"]}
        ).fetchall()

        result.append({
            **dict(order._mapping),
            "order_id": f"#ORD{order._mapping['id']}",
            "date": order._mapping["created_at"].strftime("%d %b %Y") if order._mapping["created_at"] else "",
            "items": [dict(i._mapping) for i in items],
            "total": f"₹{float(order._mapping['total_amount']):,.0f}",
        })
    return result

@app.get("/api/orders/{order_id}")
def get_order_detail(order_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    order = db.execute(
        text("""
            SELECT id, user_id, total_amount, status, full_name, address, phone, payment_method, created_at
            FROM orders WHERE id = :order_id
        """),
        {"order_id": order_id}
    ).fetchone()
 
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
 
    if order._mapping["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
 
    items = db.execute(
        text("SELECT product_id, name, price, quantity, image_url FROM order_items WHERE order_id = :order_id"),
        {"order_id": order_id}
    ).fetchall()
 
    return {
        **dict(order._mapping),
        "order_id": f"#ORD{order._mapping['id']}",
        "date": order._mapping["created_at"].strftime("%d %b %Y") if order._mapping["created_at"] else "",
        "items": [dict(i._mapping) for i in items],
        "total": f"₹{float(order._mapping['total_amount']):,.0f}",
    }

@app.delete("/api/orders/{order_id}")
def cancel_order(order_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    order = db.execute(
        text("SELECT id, user_id, status FROM orders WHERE id = :id"), {"id": order_id}
    ).fetchone()
 
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order._mapping["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    if order._mapping["status"] != "Processing":
        raise HTTPException(status_code=400, detail=f"Cannot cancel order with status '{order._mapping['status']}'")
 
    db.execute(text("UPDATE orders SET status = 'Cancelled' WHERE id = :id"), {"id": order_id})
    db.commit()
    return {"message": "Order cancelled successfully"}

# ========================= PHYSICAL ADDRESS MANAGEMENT =========================
@app.get("/api/addresses")
def get_saved_addresses(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    rows = db.execute(
        text("SELECT id, label, address, phone FROM saved_addresses WHERE user_id = :user_id ORDER BY id DESC"),
        {"user_id": user_id}
    ).fetchall()
    return [dict(r._mapping) for r in rows]
 
@app.post("/api/addresses", status_code=201)
def save_address(body: AddressCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    db.execute(
        text("INSERT INTO saved_addresses (user_id, label, address, phone) VALUES (:user_id, :label, :address, :phone)"),
        {"user_id": user_id, "label": body.label or "Home", "address": body.address, "phone": body.phone}
    )
    db.commit()
    return {"message": "Address saved successfully"}

@app.put("/api/addresses/{address_id}")
def update_address(address_id: int, body: AddressCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    db.execute(
        text("UPDATE saved_addresses SET label = :label, address = :address, phone = :phone WHERE id = :id AND user_id = :user_id"),
        {"id": address_id, "user_id": user_id, "label": body.label, "address": body.address, "phone": body.phone}
    )
    db.commit()
    return {"message": "Address updated"}

@app.delete("/api/addresses/{address_id}")
def delete_address(address_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    row = db.execute(text("SELECT id, user_id FROM saved_addresses WHERE id = :id"), {"id": address_id}).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Address not found")
    if row._mapping["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    db.execute(text("DELETE FROM saved_addresses WHERE id = :id"), {"id": address_id})
    db.commit()
    return {"message": "Address deleted successfully"}

# ========================= PERSISTENT WISHLISTS =========================
@app.get("/api/wishlist")
def get_wishlist(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    items = db.execute(
        text("SELECT p.id, p.name, p.price, p.image_url FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = :user_id"),
        {"user_id": user_id}
    ).fetchall()
    return [dict(i._mapping) for i in items]

@app.post("/api/wishlist/{product_id}")
def add_to_wishlist(product_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    db.execute(text("INSERT INTO wishlist (user_id, product_id) VALUES (:user_id, :product_id)"), {"user_id": user_id, "product_id": product_id})
    db.commit()
    return {"message": "Added to wishlist"}

@app.delete("/api/wishlist/{product_id}")
def remove_from_wishlist(product_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    db.execute(text("DELETE FROM wishlist WHERE user_id = :user_id AND product_id = :product_id"), {"user_id": user_id, "product_id": product_id})
    db.commit()
    return {"message": "Removed from wishlist"}

# ========================= USER PROFILES & MEDIA ASSETS =========================
@app.get("/api/profile")
def get_profile(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    profile = db.execute(
        text("SELECT first_name, last_name, phone, bio, avatar_url FROM user_profiles WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()
    if not profile:
        return {"first_name": "", "last_name": "", "phone": "", "bio": "", "avatar_url": ""}
    return dict(profile._mapping)

@app.put("/api/profile")
def update_profile(data: ProfileUpdate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    existing = db.execute(text("SELECT id FROM user_profiles WHERE user_id = :user_id"), {"user_id": user_id}).fetchone()
    if existing:
        db.execute(
            text("UPDATE user_profiles SET first_name = :first_name, last_name = :last_name, phone = :phone, bio = :bio WHERE user_id = :user_id"),
            {"first_name": data.first_name, "last_name": data.last_name, "phone": data.phone, "bio": data.bio, "user_id": user_id}
        )
    else:
        db.execute(
            text("INSERT INTO user_profiles (user_id, first_name, last_name, phone, bio) VALUES (:user_id, :first_name, :last_name, :phone, :bio)"),
            {"user_id": user_id, "first_name": data.first_name, "last_name": data.last_name, "phone": data.phone, "bio": data.bio}
        )
    db.commit()
    return {"message": "Profile updated successfully"}

@app.post("/api/profile/avatar")
async def upload_avatar(file: UploadFile = File(...), user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    avatar_url = f"/uploads/{filename}"
    db.execute(text("UPDATE user_profiles SET avatar_url = :avatar_url WHERE user_id = :user_id"), {"avatar_url": avatar_url, "user_id": user_id})
    db.commit()
    return {"message": "Avatar uploaded successfully", "avatar_url": avatar_url}

@app.delete("/api/profile/avatar")
def remove_avatar(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    db.execute(text("UPDATE user_profiles SET avatar_url = NULL WHERE user_id = :user_id"), {"user_id": user_id})
    db.commit()
    return {"message": "Avatar removed successfully"}

# ========================= METRIC DASHBOARDS (CUSTOMER & ADMIN) =========================
@app.get("/api/dashboard/stats")
def dashboard_stats(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    total_orders = db.execute(text("SELECT COUNT(*) FROM orders WHERE user_id = :user_id"), {"user_id": user_id}).scalar() or 0
    delivered = db.execute(text("SELECT COUNT(*) FROM orders WHERE user_id = :user_id AND status = 'Delivered'"), {"user_id": user_id}).scalar() or 0
    pending = db.execute(text("SELECT COUNT(*) FROM orders WHERE user_id = :user_id AND status = 'Processing'"), {"user_id": user_id}).scalar() or 0
    cancelled = db.execute(text("SELECT COUNT(*) FROM orders WHERE user_id = :user_id AND status = 'Cancelled'"), {"user_id": user_id}).scalar() or 0
    return {"total_orders": total_orders, "delivered": delivered, "pending": pending, "cancelled": cancelled}

@app.get("/api/dashboard")
def dashboard_summary(db: Session = Depends(get_db)):
    total_orders = db.execute(text("SELECT COUNT(*) FROM orders")).scalar() or 0
    delivered = db.execute(text("SELECT COUNT(*) FROM orders WHERE status='Delivered'")).scalar() or 0
    processing = db.execute(text("SELECT COUNT(*) FROM orders WHERE status='Processing'")).scalar() or 0
    cancelled = db.execute(text("SELECT COUNT(*) FROM orders WHERE status='Cancelled'")).scalar() or 0
    return {"total_orders": total_orders, "delivered": delivered, "processing": processing, "cancelled": cancelled}

@app.get("/api/admin/orders")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.execute(
        text("""
            SELECT o.id, o.total_amount, o.status, o.full_name, o.address, o.phone, o.payment_method, o.created_at, u.email AS user_email
            FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC
        """)
    ).fetchall()

    result = []
    for order in orders:
        items = db.execute(
            text("SELECT product_id, name, price, quantity, image_url FROM order_items WHERE order_id = :order_id"),
            {"order_id": order._mapping["id"]}
        ).fetchall()

        result.append({
            **dict(order._mapping),
            "order_id": f"#ORD{order._mapping['id']}",
            "date": order._mapping["created_at"].strftime("%d %b %Y") if order._mapping["created_at"] else "",
            "items": [dict(i._mapping) for i in items],
            "total": f"₹{float(order._mapping['total_amount']):,.0f}",
        })
    return result

@app.put("/api/admin/orders/{order_id}/status")
def update_order_status(order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_db)):
    valid_statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {valid_statuses}")

    order = db.execute(text("SELECT id FROM orders WHERE id = :id"), {"id": order_id}).fetchone()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.execute(text("UPDATE orders SET status = :status WHERE id = :order_id"), {"status": data.status, "order_id": order_id})
    db.commit()
    return {"message": "Status updated successfully"}
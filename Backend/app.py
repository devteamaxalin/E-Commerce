import datetime
import logging

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, EmailStr

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session

from jose import jwt
from passlib.context import CryptContext

# ========================= LOGGING =========================
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# ========================= CONFIG =========================
SECRET_KEY = "SUPER_SECRET_PREMIUM_LAVENDER_JWT_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

DATABASE_URL = "postgresql://postgres:1234@localhost:5432/ecommerce_web"

# ========================= DATABASE =========================
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ========================= APP =========================
app = FastAPI(title="LuxeShop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================= PASSWORD =========================
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# ========================= JWT =========================
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = (
        datetime.datetime.utcnow()
        + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

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

class ProductRequest(BaseModel):
    name: str
    description: str = ""
    price: float
    stock: int
    image_url: str = ""
    category: str = ""
    brand: str = ""
    discount: float = 0
    weight: float = 0
    sku: str = ""

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
# ========================= ROUTES =========================
@app.get("/")
def home():
    return {
        "message": "FastAPI Connected Successfully"
    }

@app.get("/api/helloworld")
def hello_world():
    return {
        "status": "success",
        "message": "Backend is Running!"
    }

# ========================= REGISTER =========================
@app.post("/api/register")
def register_user(
    user_in: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        logger.debug(
            f"Registration started for email: {user_in.email}"
        )

        # Check Email
        existing_email = db.execute(
            text(
                """
                SELECT id
                FROM users
                WHERE email = :email
                """
            ),
            {
                "email": user_in.email
            }
        ).fetchone()

        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        # Check Username
        existing_username = db.execute(
            text(
                """
                SELECT id
                FROM users
                WHERE username = :username
                """
            ),
            {
                "username": user_in.username
            }
        ).fetchone()

        if existing_username:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )

        total_users = db.execute(
            text("SELECT COUNT(*) FROM users")
        ).scalar() or 0

        role = "admin" if total_users == 0 else "customer"

        hashed_password = get_password_hash(
            user_in.password
        )

        db.execute(
            text(
                """
                INSERT INTO users
                (
                    username,
                    email,
                    password_hash,
                    role
                )
                VALUES
                (
                    :username,
                    :email,
                    :password_hash,
                    :role
                )
                """
            ),
            {
                "username": user_in.username,
                "email": user_in.email,
                "password_hash": hashed_password,
                "role": role
            }
        )

        db.commit()

        logger.info(
            f"User {user_in.email} registered successfully"
        )

        return {
            "status": "success",
            "message": "User registered successfully",
            "role": role
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        logger.error(
            f"Registration error: {str(e)}",
            exc_info=True
        )

        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

# ========================= LOGIN =========================
@app.post("/api/login")
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        user = db.execute(
            text(
                """
                SELECT
                    id,
                    email,
                    password_hash,
                    role
                FROM users
                WHERE email = :email
                """
            ),
            {
                "email": form_data.username
            }
        ).fetchone()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )

        if not verify_password(
            form_data.password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )

        access_token = create_access_token(
            {
                "sub": user.email,
                "user_id": user.id,
                "role": user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(
            f"Login error: {str(e)}",
            exc_info=True
        )

        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

# ========================= USERS =========================
@app.get("/api/users")
def get_users(
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text(
                """
                SELECT
                    id,
                    username,
                    email,
                    role
                FROM users
                """
            )
        ).fetchall()

        return [
            dict(row._mapping)
            for row in result
        ]

    except Exception as e:
        logger.error(
            f"Get users error: {str(e)}",
            exc_info=True
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch users: {str(e)}"
        )
    
@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):

    result = db.execute(
        text("""
            SELECT *
            FROM products
            ORDER BY id DESC
        """)
    ).fetchall()

    return [
        dict(row._mapping)
        for row in result
    ]
 # ========================= PRODUCTS =========================

@app.get("/api/products")
def get_products(
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            SELECT *
            FROM products
            ORDER BY id
        """)
    ).fetchall()

    return [
        dict(row._mapping)
        for row in result
    ]


@app.get("/api/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            SELECT *
            FROM products
            WHERE id = :id
        """),
        {
            "id": product_id
        }
    ).fetchone()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return dict(result._mapping)


@app.post("/api/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    db.execute(
        text("""
            INSERT INTO products
            (
                name,
                category,
                description,
                price,
                stock,
                image_url,
                brand,
                discount,
                weight,
                sku
            )
            VALUES
            (
                :name,
                :category,
                :description,
                :price,
                :stock,
                :image_url,
                :brand,
                :discount,
                :weight,
                :sku
            )
        """),
        {
            "name": product.name,
            "category": product.category,
            "description": product.description,
            "price": product.price,
            "stock": product.stock,
            "image_url": product.image_url,
            "brand": product.brand,
            "discount": product.discount,
            "weight": product.weight,
            "sku": product.sku
        }
    )

    db.commit()

    return {
        "message": "Product Added Successfully"
    }


@app.put("/api/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    db.execute(
        text("""
            UPDATE products
            SET
                name = :name,
                category = :category,
                description = :description,
                price = :price,
                stock = :stock,
                image_url = :image_url,
                brand = :brand,
                discount = :discount,
                weight = :weight,
                sku = :sku
            WHERE id = :id
        """),
        {
            "id": product_id,
            "name": product.name,
            "category": product.category,
            "description": product.description,
            "price": product.price,
            "stock": product.stock,
            "image_url": product.image_url,
            "brand": product.brand,
            "discount": product.discount,
            "weight": product.weight,
            "sku": product.sku
        }
    )

    db.commit()

    return {
        "message": "Product Updated Successfully"
    }


@app.delete("/api/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            SELECT id
            FROM products
            WHERE id = :id
        """),
        {
            "id": product_id
        }
    ).fetchone()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.execute(
        text("""
            DELETE FROM products
            WHERE id = :id
        """),
        {
            "id": product_id
        }
    )

    db.commit()

    return {
        "message": "Product Deleted Successfully"
    }

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return user_id

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token expired or invalid"
        )

@app.post("/api/checkout", status_code=201)
def place_order(
    payload: CheckoutRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Place a new order for the logged-in user.
    Inserts into orders + order_items tables.
    """
 
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
 
    # 1. Insert into orders
    order_result = db.execute(
        text("""
            INSERT INTO orders
                (user_id, total_amount, status, full_name, address, phone, payment_method)
            VALUES
                (:user_id, :total_amount, 'Processing', :full_name, :address, :phone, :payment_method)
            RETURNING id
        """),
        {
            "user_id":        user_id,
            "total_amount":   payload.total_amount,
            "full_name":      payload.full_name,
            "address":        payload.address,
            "phone":          payload.phone,
            "payment_method": payload.payment_method,
        }
    ).fetchone()
 
    order_id = order_result.id
 
    # 2. Insert each item into order_items
    for item in payload.items:
        db.execute(
            text("""
                INSERT INTO order_items
                    (order_id, product_id, name, price, quantity, image_url)
                VALUES
                    (:order_id, :product_id, :name, :price, :quantity, :image_url)
            """),
            {
                "order_id":   order_id,
                "product_id": item.product_id,
                "name":       item.name,
                "price":      item.price,
                "quantity":   item.quantity,
                "image_url":  item.image_url or "",
            }
        )
 
    db.commit()
 
    return {
        "message":  "Order placed successfully",
        "order_id": f"#ORD{order_id}",
        "status":   "Processing"
    }
 
 
# ═══════════════════════════════════════════════════════════════════════════════
#  GET MY ORDERS  —  GET /api/orders/my
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.get("/api/orders/my")
def get_my_orders(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user_id = 10

    orders = db.execute(
        text("""
            SELECT id, total_amount, status, full_name, address,
                   phone, payment_method, created_at
            FROM orders
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        """),
        {"user_id": user_id}
    ).fetchall()

    result = []

    for order in orders:
        items = db.execute(
            text("""
                SELECT product_id, name, price, quantity, image_url
                FROM order_items
                WHERE order_id = :order_id
            """),
            {"order_id": order.id}
        ).fetchall()

        result.append({
            **dict(order._mapping),
            "order_id": f"#ORD{order.id}",
            "date": order.created_at.strftime("%d %b %Y") if order.created_at else "",
            "items": [dict(i._mapping) for i in items],
            "total": f"₹{float(order.total_amount):,.0f}",
        })

    return result
# ═══════════════════════════════════════════════════════════════════════════════
#  GET SINGLE ORDER  —  GET /api/orders/{order_id}
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.get("/api/orders/{order_id}")
def get_order_detail(
    order_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get full detail of a single order.
    Only accessible by the order's owner.
    """
 
    order = db.execute(
        text("""
            SELECT id, user_id, total_amount, status, full_name,
                   address, phone, payment_method, created_at
            FROM orders
            WHERE id = :order_id
        """),
        {"order_id": order_id}
    ).fetchone()
 
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
 
    if order.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
 
    items = db.execute(
        text("""
            SELECT product_id, name, price, quantity, image_url
            FROM order_items
            WHERE order_id = :order_id
        """),
        {"order_id": order_id}
    ).fetchall()
 
    return {
        **dict(order._mapping),
        "order_id": f"#ORD{order.id}",
        "date":     order.created_at.strftime("%d %b %Y") if order.created_at else "",
        "items":    [dict(i._mapping) for i in items],
        "total":    f"₹{float(order.total_amount):,.0f}",
    }
 
 
# ═══════════════════════════════════════════════════════════════════════════════
#  CANCEL ORDER  —  DELETE /api/orders/{order_id}
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.delete("/api/orders/{order_id}")
def cancel_order(
    order_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Cancel an order. Only allowed if status is 'Processing'.
    Only the order's owner can cancel.
    """
 
    order = db.execute(
        text("SELECT id, user_id, status FROM orders WHERE id = :id"),
        {"id": order_id}
    ).fetchone()
 
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
 
    if order.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
 
    if order.status != "Processing":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel order with status '{order.status}'"
        )
 
    db.execute(
        text("UPDATE orders SET status = 'Cancelled' WHERE id = :id"),
        {"id": order_id}
    )
    db.commit()
 
    return {"message": "Order cancelled successfully"}
 
 
# ═══════════════════════════════════════════════════════════════════════════════
#  ADMIN — UPDATE ORDER STATUS  —  PUT /api/admin/orders/{order_id}/status
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.put("/api/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    body: OrderStatusUpdate,
    db: Session = Depends(get_db)
    # Add your admin-only dependency here if needed
):
    """
    Admin endpoint to update order status.
    Valid statuses: Processing → Shipped → Delivered | Cancelled
    """
 
    valid_statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
]
    print("STATUS RECEIVED =", body.status)
    if body.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Choose from: {valid_statuses}"
        )
 
    order = db.execute(
        text("SELECT id FROM orders WHERE id = :id"),
        {"id": order_id}
    ).fetchone()
 
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
 
    db.execute(
        text("UPDATE orders SET status = :status WHERE id = :id"),
        {"status": body.status, "id": order_id}
    )
    db.commit()
 
    return {"message": f"Order status updated to '{body.status}'"}
 
 
# ═══════════════════════════════════════════════════════════════════════════════
#  ADMIN — GET ALL ORDERS  —  GET /api/admin/orders
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.get("/api/admin/orders")
def get_all_orders(
    db: Session = Depends(get_db)
    # Add your admin-only dependency here if needed
):
    """
    Admin: Get all orders across all users, with customer info.
    """
 
    orders = db.execute(
        text("""
            SELECT
                o.id, o.total_amount, o.status, o.full_name,
                o.address, o.phone, o.payment_method, o.created_at,
                u.email AS user_email
            FROM orders o
            JOIN users u ON u.id = o.user_id
            ORDER BY o.created_at DESC
        """)
    ).fetchall()
 
    result = []
    for order in orders:
        items = db.execute(
            text("""
                SELECT product_id, name, price, quantity, image_url
                FROM order_items WHERE order_id = :order_id
            """),
            {"order_id": order.id}
        ).fetchall()
 
        result.append({
            **dict(order._mapping),
            "order_id": f"#ORD{order.id}",
            "date":     order.created_at.strftime("%d %b %Y") if order.created_at else "",
            "items":    [dict(i._mapping) for i in items],
            "total":    f"₹{float(order.total_amount):,.0f}",
        })
 
    return result
 
 
# ═══════════════════════════════════════════════════════════════════════════════
#  SAVED ADDRESSES  —  GET / POST / DELETE
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.get("/api/addresses")
def get_saved_addresses(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get all saved addresses for the logged-in user."""
 
    rows = db.execute(
        text("""
            SELECT id, label, address, phone
            FROM saved_addresses
            WHERE user_id = :user_id
            ORDER BY id DESC
        """),
        {"user_id": user_id}
    ).fetchall()
 
    return [dict(r._mapping) for r in rows]
 
 
@app.post("/api/addresses", status_code=201)
def save_address(
    body: AddressCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Save a new address for the logged-in user."""
 
    db.execute(
        text("""
            INSERT INTO saved_addresses (user_id, label, address, phone)
            VALUES (:user_id, :label, :address, :phone)
        """),
        {
            "user_id": user_id,
            "label":   body.label or "Home",
            "address": body.address,
            "phone":   body.phone,
        }
    )
    db.commit()
 
    return {"message": "Address saved successfully"}
 
 
@app.delete("/api/addresses/{address_id}")
def delete_address(
    address_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Delete a saved address. Only owner can delete."""
 
    row = db.execute(
        text("SELECT id, user_id FROM saved_addresses WHERE id = :id"),
        {"id": address_id}
    ).fetchone()
 
    if not row:
        raise HTTPException(status_code=404, detail="Address not found")
 
    if row.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
 
    db.execute(
        text("DELETE FROM saved_addresses WHERE id = :id"),
        {"id": address_id}
    )
    db.commit()
 
    return {"message": "Address deleted successfully"}
 
 
# ═══════════════════════════════════════════════════════════════════════════════
#  USER PROFILE (for checkout auto-fill)  —  GET /api/users/me
# ═══════════════════════════════════════════════════════════════════════════════
 
@app.get("/api/users/me")
def get_my_profile(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Returns logged-in user's name, email, phone
    so the checkout form can be pre-filled.
    """
 
    user = db.execute(
        text("""
            SELECT id, name, email, phone
            FROM users
            WHERE id = :id
        """),
        {"id": user_id}
    ).fetchone()
 
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
 
    return dict(user._mapping)
@app.get("/api/dashboard/stats")
def dashboard_stats(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):

    total_orders = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = :user_id
        """),
        {"user_id": user_id}
    ).scalar()

    delivered = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = :user_id
            AND status = 'Delivered'
        """),
        {"user_id": user_id}
    ).scalar()

    pending = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = :user_id
            AND status = 'Processing'
        """),
        {"user_id": user_id}
    ).scalar()

    cancelled = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = :user_id
            AND status = 'Cancelled'
        """),
        {"user_id": user_id}
    ).scalar()

    return {
        "total_orders": total_orders,
        "delivered": delivered,
        "pending": pending,
        "cancelled": cancelled
    }
 
@app.get("/api/dashboard")
def dashboard_summary(
    db: Session = Depends(get_db)
):
    total_orders = db.execute(
        text("SELECT COUNT(*) FROM orders")
    ).scalar()

    delivered = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE status='Delivered'
        """)
    ).scalar()

    processing = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE status='Processing'
        """)
    ).scalar()

    cancelled = db.execute(
        text("""
            SELECT COUNT(*)
            FROM orders
            WHERE status='Cancelled'
        """)
    ).scalar()

    return {
        "total_orders": total_orders,
        "delivered": delivered,
        "processing": processing,
        "cancelled": cancelled
    }

@app.get("/test-user")
def test_user(user_id=Depends(get_current_user_id)):
    return user_id

@app.get("/api/admin/orders")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.execute(
        text("""
            SELECT
                id,
                full_name,
                total_amount,
                status,
                created_at
            FROM orders
            ORDER BY created_at DESC
        """)
    ).fetchall()

    return [dict(o._mapping) for o in orders]

from pydantic import BaseModel

class OrderStatusUpdate(BaseModel):
    status: str


@app.put("/api/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    db.execute(
        text("""
            UPDATE orders
            SET status = :status
            WHERE id = :order_id
        """),
        {
            "status": data.status,
            "order_id": order_id
        }
    )

    db.commit()

    return {"message": "Status updated successfully"}
@app.put("/api/addresses/{address_id}")
def update_address(
    address_id: int,
    body: AddressCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    db.execute(
        text("""
            UPDATE saved_addresses
            SET label = :label,
                address = :address,
                phone = :phone
            WHERE id = :id
            AND user_id = :user_id
        """),
        {
            "id": address_id,
            "user_id": user_id,
            "label": body.label,
            "address": body.address,
            "phone": body.phone
        }
    )

    db.commit()

    return {"message": "Address updated"}

@app.get("/api/wishlist")
def get_wishlist(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    items = db.execute(
        text("""
            SELECT
                p.id,
                p.name,
                p.price,
                p.image_url
            FROM wishlist w
            JOIN products p
              ON w.product_id = p.id
            WHERE w.user_id = :user_id
        """),
        {"user_id": user_id}
    ).fetchall()

    return [dict(i._mapping) for i in items]

@app.post("/api/wishlist/{product_id}")
def add_to_wishlist(
    product_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    db.execute(
        text("""
            INSERT INTO wishlist(user_id, product_id)
            VALUES(:user_id, :product_id)
        """),
        {
            "user_id": user_id,
            "product_id": product_id
        }
    )

    db.commit()

    return {"message": "Added to wishlist"}
@app.delete("/api/wishlist/{product_id}")
def remove_from_wishlist(
    product_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    db.execute(
        text("""
            DELETE FROM wishlist
            WHERE user_id = :user_id
            AND product_id = :product_id
        """),
        {
            "user_id": user_id,
            "product_id": product_id
        }
    )

    db.commit()

    return {"message": "Removed from wishlist"}
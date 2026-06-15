import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaShoppingCart, FaUser, FaTrash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Home({ wishlist = [], setWishlist }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState("home");
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const productsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError("");
      try {
        const res = await fetch("http://localhost:8000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const normalized = data.map((p) => ({
          ...p,
          image: p.image_url || "",
        }));
        setProducts(normalized);
      } catch (err) {
        setProductsError("Could not load products. Please try again later.");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // FETCH & SYNC USER WISHLIST OBJECTS FROM API
  const fetchUserWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:8000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        // Keep the database objects intact so it matches WishList.jsx exactly
        setWishlist(res.data);
      }
    } catch (err) {
      console.error("Error fetching wishlist in Home:", err);
    }
  };

  useEffect(() => {
    fetchUserWishlist();
  }, [setWishlist]);

  // Fetch saved addresses from backend when checkout opens
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!showCheckout) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://127.0.0.1:8000/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedAddresses(res.data);
      } catch (err) {
        console.error("Error fetching saved addresses for checkout:", err);
      }
    };

    fetchSavedAddresses();
  }, [showCheckout]);

  // Handle manual address list refresh
  const handleRefreshAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://127.0.0.1:8000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(res.data);
      showNotification("Addresses Refreshed!", "success");
    } catch (err) {
      console.error("Failed to refresh:", err);
      showNotification("Failed to reload address data.", "error");
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showNotification("Added to Cart!", "success");
  };

  // FIXED: TOGGLE SYSTEM THAT PULLS DIRECTLY FROM DATA SCHEMAS
  const toggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Please login first", "error");
        return;
      }

      // Check if product is already wishlisted by matching id or product_id attributes
      const isItemAlreadyInWishlist = wishlist.some(
        (item) => item.product_id === product.id || item.id === product.id
      );

      if (isItemAlreadyInWishlist) {
        await axios.delete(`http://127.0.0.1:8000/api/wishlist/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Removed from Wishlist", "error");
      } else {
        await axios.post(`http://127.0.0.1:8000/api/wishlist/${product.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Added to Wishlist!", "success");
      }
      
      // Re-fetch list immediately to ensure UI context and database match completely
      fetchUserWishlist();
    } catch (err) {
      console.error(err);
      showNotification("Failed to update wishlist", "error");
    }
  };

  const increaseQty = (id) => setCart(cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQty = (id) => setCart(cart.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
  const removeFromCart = (id) => { 
    setCart(cart.filter((item) => item.id !== id)); 
    showNotification("Removed from Cart", "error"); 
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlist.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // FIXED: Sync internal logic state with your wishlist array format
  const wishlistProducts = products.filter((product) =>
    wishlist.some((item) => item.product_id === product.id || item.id === product.id)
  );

  const showNotification = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const confirmOrder = async () => {
    if (!fullName.trim() || !address.trim() || !phone.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
      showNotification("Please check and fill out your information properly.", "error");
      return;
    }
    if (!selectedPayment) {
      showNotification("Please select a payment method before confirmation!", "error");
      return;
    }
    if (selectedPayment === "UPI" && (!upiId.trim() || !upiId.includes("@"))) {
      showNotification("Please enter a valid UPI ID", "error");
      return;
    }
    if (selectedPayment === "CARD") {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 16) { showNotification("Please enter a valid 16-digit card number", "error"); return; }
      if (!cardName.trim()) { showNotification("Please enter the card holder name", "error"); return; }
      if (!cardExpiry.trim()) { showNotification("Please enter card expiry date", "error"); return; }
      if (!cardCvv.trim() || cardCvv.length < 3) { showNotification("Please enter a valid CVV", "error"); return; }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Please login first!", "error");
      return;
    }

    const orderItems = buyNowProduct 
      ? [{ product_id: buyNowProduct.id, name: buyNowProduct.name, price: buyNowProduct.price, quantity: 1, image_url: buyNowProduct.image || "" }]
      : cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image || ""
        }));

    const payload = {
      items: orderItems,
      total_amount: buyNowProduct ? buyNowProduct.price : totalPrice,
      full_name: fullName,
      address: address,
      phone: phone,
      payment_method: selectedPayment,
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/checkout", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showNotification(`Order Placed Successfully! ${res.data.order_id}`, "success");

      if (!buyNowProduct) setCart([]);
      setFullName(""); setAddress(""); setPhone("");
      setSelectedPayment(""); setUpiId(""); setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv("");
      setBuyNowProduct(null); 
      setShowCheckout(false); 
      setCurrentPage("home");
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.detail || "Failed to place order", "error");
    }
  };

  return (
    <div style={styles.container}>
      {message && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", padding: "12px 20px", borderRadius: "8px",
          color: "#fff", fontWeight: "bold", background: messageType === "success" ? "#16a34a" : "#dc2626", zIndex: 9999,
        }}>
          {message}
        </div>
      )}

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={{ ...styles.logoSection, cursor: "pointer" }} onClick={() => setCurrentPage("home")}>
          <span style={styles.menuIcon}>☰</span>
          <h2 style={styles.logo}>DevTeam</h2>
        </div>
        <div style={styles.searchWrapper}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.navActions}>
          <div style={styles.navItem} onClick={() => setCurrentPage("wishlist")}>
            <FaHeart style={{ color: currentPage === "wishlist" ? "#dc2626" : "#666" }} />
            <span style={{ fontWeight: currentPage === "wishlist" ? "bold" : "normal" }}>Wishlist ({totalWishlistItems})</span>
          </div>
          <div style={styles.navItem} onClick={() => setCurrentPage("cart")}>
            <FaShoppingCart style={{ color: currentPage === "cart" ? "#2563eb" : "#666" }} />
            <span style={{ fontWeight: currentPage === "cart" ? "bold" : "normal" }}>Cart ({totalItems})</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate("/dashboard/profile")}>
            <FaUser style={{ color: "#666" }} />
            <div><div style={{ fontSize: "12px", color: "#666" }}>My Account</div></div>
          </div>
        </div>
      </div>

      {/* Home Page */}
      {currentPage === "home" && (
        <>
          <div style={styles.hero}>
            <div>
              <h1>UP TO 50% OFF</h1>
              <h3>Electronics & Accessories</h3>
              <button style={styles.shopBtn} onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}>Shop Now</button>
            </div>
          </div>

          <div ref={productsRef}><h2 style={{ marginBottom: 20 }}>Featured Products</h2></div>

          {productsLoading && (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={{ color: "#64748b", marginTop: "16px", fontSize: "15px" }}>Loading products...</p>
            </div>
          )}

          {!productsLoading && productsError && (
            <div style={styles.errorContainer}>
              <p style={{ fontSize: "16px", color: "#dc2626" }}>⚠️ {productsError}</p>
              <button style={styles.retryBtn} onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!productsLoading && !productsError && (
            <div style={styles.grid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  // FIXED MATCH LOGIC FOR INTERNAL COMPONENT ITERATION
                  const isWishlisted = wishlist.some(
                    (item) => item.product_id === product.id || item.id === product.id
                  );
                  const discountedPrice = product.discount
                    ? Math.round(product.price - (product.price * product.discount) / 100)
                    : null;

                  return (
                    <div key={product.id} style={styles.card}>
                      <div style={styles.wishlistIconContainer} onClick={() => toggleWishlist(product)}>
                        {isWishlisted ? <FaHeart style={{ color: "#dc2626", fontSize: "20px" }} /> : <FaRegHeart style={{ color: "#9ca3af", fontSize: "20px" }} />}
                      </div>

                      {product.discount > 0 && (
                        <div style={styles.discountBadge}>{product.discount}% OFF</div>
                      )}

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={styles.image}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div style={styles.noImagePlaceholder}>No Image</div>
                      )}

                      <h3 style={styles.productName}>{product.name}</h3>
                      {product.brand && <p style={styles.brandText}>{product.brand}</p>}

                      <div style={styles.priceRow}>
                        <span style={styles.price}>₹{(discountedPrice || product.price).toLocaleString()}</span>
                        {discountedPrice && <span style={styles.originalPrice}>₹{product.price.toLocaleString()}</span>}
                      </div>

                      {product.stock !== undefined && (
                        <p style={{ fontSize: "12px", color: product.stock > 0 ? "#16a34a" : "#dc2626", margin: "4px 0 8px" }}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                        </p>
                      )}

                      <div style={styles.buttonGroup}>
                        <button
                          style={product.stock === 0 ? styles.outOfStockBtn : cart.some((item) => item.id === product.id) ? styles.goCartBtn : styles.addBtn}
                          disabled={product.stock === 0}
                          onClick={() => {
                            if (product.stock === 0) return;
                            cart.some((item) => item.id === product.id) ? setCurrentPage("cart") : addToCart(product);
                          }}
                        >
                          {product.stock === 0 ? "Out of Stock" : cart.some((item) => item.id === product.id) ? "Go To Cart" : "Add To Cart"}
                        </button>
                        <button
                          style={product.stock === 0 ? styles.outOfStockBtn : styles.buyNowBtn}
                          disabled={product.stock === 0}
                          onClick={() => {
                            if (product.stock === 0) return;
                            setBuyNowProduct(product);
                            setShowCheckout(true);
                          }}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={styles.noProducts}>🔍 No Products Found</div>
              )}
            </div>
          )}
        </>
      )}

      {/* Wishlist Page */}
      {currentPage === "wishlist" && (
        <div style={{ minHeight: "60vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>My Wishlist ({totalWishlistItems})</h2>
            <button style={styles.backToShopBtn} onClick={() => setCurrentPage("home")}><FaArrowLeft /> Back to Shopping</button>
          </div>
          {wishlistProducts.length > 0 ? (
            <div style={styles.grid}>
              {wishlistProducts.map((product) => {
                const discountedPrice = product.discount ? Math.round(product.price - (product.price * product.discount) / 100) : null;
                return (
                  <div key={product.id} style={styles.card}>
                    <div style={styles.wishlistIconContainer} onClick={() => toggleWishlist(product)}>
                      <FaHeart style={{ color: "#dc2626", fontSize: "20px" }} />
                    </div>
                    {product.discount > 0 && <div style={styles.discountBadge}>{product.discount}% OFF</div>}
                    <img src={product.image || product.image_url || "https://via.placeholder.com/250x220?text=No+Image"} alt={product.name} style={styles.image} onError={(e) => e.target.src = "https://via.placeholder.com/250x220?text=No+Image"} />
                    <h3 style={styles.productName}>{product.name}</h3>
                    {product.brand && <p style={styles.brandText}>{product.brand}</p>}
                    <div style={styles.priceRow}>
                      <span style={styles.price}>₹{(discountedPrice || product.price).toLocaleString()}</span>
                      {discountedPrice && <span style={styles.originalPrice}>₹{product.price.toLocaleString()}</span>}
                    </div>
                    <div style={styles.buttonGroup}>
                      <button style={cart.some((item) => item.id === product.id) ? styles.goCartBtn : styles.addBtn} onClick={() => cart.some((item) => item.id === product.id) ? setCurrentPage("cart") : addToCart(product)}>
                        {cart.some((item) => item.id === product.id) ? "Go To Cart" : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyStateContainer}>
              <p style={{ fontSize: "18px", color: "#666" }}>Your wishlist is empty!</p>
              <button style={styles.shopNowRedirectBtn} onClick={() => setCurrentPage("home")}>Discover Products</button>
            </div>
          )}
        </div>
      )}

      {/* Cart Page */}
      {currentPage === "cart" && (
        <div style={{ minHeight: "60vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>Shopping Cart ({totalItems} Items)</h2>
            <button style={styles.backToShopBtn} onClick={() => setCurrentPage("home")}><FaArrowLeft /> Back to Shopping</button>
          </div>
          {cart.length === 0 ? (
            <div style={styles.emptyStateContainer}>
              <p style={{ fontSize: "18px", color: "#666" }}>Your shopping cart is empty!</p>
              <button style={styles.shopNowRedirectBtn} onClick={() => setCurrentPage("home")}>Shop Our Products</button>
            </div>
          ) : (
            <div style={styles.cartPageGrid}>
              <div style={styles.cartItemsListContainer}>
                {cart.map((item) => (
                  <div key={item.id} style={styles.cartItemRow}>
                    <img
                      src={item.image || item.image_url || "https://via.placeholder.com/80x80?text=No+Image"}
                      alt={item.name}
                      style={styles.cartPageImage}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 3px 0" }}>{item.name}</h4>
                      {item.brand && <p style={{ margin: "0 0 3px 0", fontSize: "12px", color: "#94a3b8" }}>{item.brand}</p>}
                      <p style={{ margin: 0, color: "#666" }}>₹{item.price.toLocaleString()}</p>
                    </div>
                    <div style={styles.qtyBox}>
                      <button style={styles.qtyBtn} onClick={() => decreaseQty(item.id)}>-</button>
                      <span style={{ fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                      <button style={styles.qtyBtn} onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <div style={{ minWidth: "100px", textAlign: "right" }}>
                      <strong style={{ fontSize: "16px" }}>₹{(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                    <button style={styles.cartTrashBtn} onClick={() => removeFromCart(item.id)}><FaTrash /></button>
                  </div>
                ))}
              </div>
              <div style={styles.summaryCard}>
                <h3 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Order Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span>Total Items:</span><strong>{totalItems}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px" }}>
                  <span>Total Price:</span><strong style={{ color: "green" }}>₹{totalPrice.toLocaleString()}</strong>
                </div>
                <button style={styles.buyBtn} onClick={() => { setBuyNowProduct(null); setShowCheckout(true); }}>Proceed To Checkout</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={{ marginTop: 0, marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>Checkout</h2>

            <label style={styles.formLabel}>Customer Name</label>
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={styles.input} />

            <label style={styles.formLabel}>Shipping Location Address</label>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Type a new location address here..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.input}
              />
              
              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", marginTop: "-5px" }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📋 SELECT FROM SAVED ADDRESSES</span>
                  <button 
                    type="button" 
                    onClick={handleRefreshAddresses}
                    style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "2px" }}
                  >
                    🔄 Refresh
                  </button>
                </div>

                {savedAddresses.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto" }}>
                    {savedAddresses.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => { 
                          setAddress(a.address); 
                          setPhone(a.phone); 
                        }}
                        style={{ 
                          padding: "10px", 
                          background: address === a.address ? "#eff6ff" : "#fff", 
                          border: address === a.address ? "2px solid #2563eb" : "1px solid #e2e8f0", 
                          borderRadius: "6px", 
                          cursor: "pointer", 
                          textAlign: "left" 
                        }}
                        onMouseEnter={(e) => { if(address !== a.address) e.currentTarget.style.borderColor = "#94a3b8"; }}
                        onMouseLeave={(e) => { if(address !== a.address) e.currentTarget.style.borderColor = "#e2e8f0"; }}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "12px", color: address === a.address ? "#2563eb" : "#0f172a" }}>
                          🏠 {a.label || "Saved Location"} {address === a.address && " 🟢 (Selected)"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px", lineHeight: "1.4" }}>{a.address}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>📞 Contact: {a.phone}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", padding: "10px 0" }}>
                    No addresses found on profile. Type your shipping location above!
                  </div>
                )}
              </div>
            </div>

            <label style={styles.formLabel}>Contact Number</label>
            <input type="text" placeholder="10-Digit Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />

            <label style={{ ...styles.formLabel, marginTop: "15px", marginBottom: "10px" }}>Select Payment Option</label>
            <div style={styles.paymentMethodContainer}>
              {["UPI", "CARD", "COD"].map((method) => (
                <div
                  key={method}
                  style={{
                    ...styles.paymentOptionCard,
                    borderColor: selectedPayment === method ? "#16a34a" : "#cbd5e1",
                    background: selectedPayment === method ? "#f0fdf4" : "#fff",
                  }}
                  onClick={() => setSelectedPayment(method)}
                >
                  <input type="radio" name="payment" checked={selectedPayment === method} onChange={() => setSelectedPayment(method)} style={{ cursor: "pointer" }} />
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {method === "UPI" ? "📱 UPI (GPay, PhonePe)" : method === "CARD" ? "💳 Credit / Debit Card" : "💵 Cash on Delivery"}
                  </span>
                </div>
              ))}
            </div>

            {selectedPayment === "UPI" && (
              <div style={styles.credentialBox}>
                <label style={styles.formLabel}>Enter UPI ID</label>
                <input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} style={styles.input} />
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "-10px" }}>e.g. mobilenumber@paytm, name@gpay</p>
              </div>
            )}

            {selectedPayment === "CARD" && (
              <div style={styles.credentialBox}>
                <label style={styles.formLabel}>Card Holder Name</label>
                <input type="text" placeholder="Name on Card" value={cardName} onChange={(e) => setCardName(e.target.value)} style={styles.input} />
                <label style={styles.formLabel}>Card Number</label>
                <input
                  type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                  onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 16); setCardNumber(val.replace(/(.{4})/g, "$1 ").trim()); }}
                  style={styles.input} maxLength={19}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.formLabel}>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} style={styles.input} maxLength={5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.formLabel}>CVV</label>
                    <input type="password" placeholder="***" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} style={styles.input} maxLength={3} />
                  </div>
                </div>
              </div>
            )}

            {selectedPayment === "COD" && (
              <div style={{ ...styles.credentialBox, background: "#fffbeb", border: "1px solid #fcd34d" }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
                  💵 You will pay <strong>₹{(buyNowProduct ? buyNowProduct.price : totalPrice).toLocaleString()}</strong> in cash when your order is delivered.
                </p>
              </div>
            )}

            <h3 style={{ marginBottom: "20px", marginTop: "15px" }}>
              Total Amount: ₹{(buyNowProduct ? buyNowProduct.price : totalPrice).toLocaleString()}
            </h3>

            <button style={styles.buyBtn} onClick={confirmOrder}>
              <FaCheckCircle /> Confirm Order
            </button>
            <button style={styles.cancelBtn} onClick={() => { setShowCheckout(false); setSelectedPayment(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerTop}>
          <div>
            <h4>Shop</h4>
            <p style={{ cursor: "pointer" }} onClick={() => setCurrentPage("home")}>All Products</p>
            <p>Electronics</p><p>Fashion</p><p>Home & Living</p><p>Sports</p>
          </div>
          <div>
            <h4>Customer Service</h4>
            <p>Contact Us</p><p>FAQs</p><p>Shipping Policy</p><p>Return Policy</p><p>Track Order</p>
          </div>
          <div>
            <h4>My Account</h4>
            <p>My Orders</p>
            <p style={{ cursor: "pointer" }} onClick={() => setCurrentPage("wishlist")}>Wishlist</p>
            <p style={{ cursor: "pointer" }} onClick={() => setCurrentPage("cart")}>My Cart</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About Us</p><p>Careers</p><p>Blog</p><p>Privacy Policy</p><p>Terms & Conditions</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 ShopEase. All Rights Reserved.</p>
          <div style={styles.paymentIcons}>
            <span>💳 VISA</span><span>💳 MasterCard</span><span>💳 PayPal</span><span>💳 UPI</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { padding: 20, fontFamily: "Arial, sans-serif", background: "#f5f7fb", minHeight: "100vh" },
  buttonGroup: { display: "flex", gap: "10px", marginTop: "10px" },
  buyNowBtn: { background: "rgb(21, 107, 5)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", flex: 1 },
  outOfStockBtn: { background: "#94a3b8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "not-allowed", fontWeight: "bold", flex: 1 },
  goCartBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", width: "100%", fontWeight: "bold" },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "15px 25px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  logoSection: { display: "flex", alignItems: "center", gap: "15px" },
  menuIcon: { fontSize: "24px", cursor: "pointer" },
  logo: { margin: 0, fontSize: "34px", fontWeight: "bold" },
  searchWrapper: { position: "relative", flex: 1, margin: "0 30px" },
  searchIcon: { position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "#666" },
  searchInput: { width: "100%", height: "52px", paddingLeft: "50px", paddingRight: "20px", fontSize: "16px", border: "2px solid #3b82f6", borderRadius: "18px", outline: "none", boxSizing: "border-box" },
  noProducts: { textAlign: "center", fontSize: "20px", fontWeight: "bold", padding: "40px", gridColumn: "1 / -1" },
  navActions: { display: "flex", alignItems: "center", gap: "25px" },
  navItem: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" },
  hero: { background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", padding: 50, borderRadius: 12, marginBottom: 30 },
  shopBtn: { background: "#fff", color: "#2563eb", border: "none", padding: "12px 20px", borderRadius: 8, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20 },
  card: { position: "relative", background: "#fff", borderRadius: 10, padding: 15, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  wishlistIconContainer: { position: "absolute", top: "15px", right: "15px", cursor: "pointer", background: "rgba(255,255,255,0.8)", padding: "6px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.15)", zIndex: 10 },
  discountBadge: { position: "absolute", top: "15px", left: "15px", background: "#dc2626", color: "#fff", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "12px", zIndex: 10 },
  image: { width: "100%", height: 220, objectFit: "cover", borderRadius: 8 },
  productName: { margin: "10px 0 4px", fontSize: "15px", fontWeight: "bold", color: "#0f172a" },
  brandText: { margin: "0 0 6px", fontSize: "12px", color: "#94a3b8" },
  priceRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" },
  price: { color: "green", fontWeight: "bold", fontSize: "16px" },
  originalPrice: { color: "#94a3b8", fontSize: "13px", textDecoration: "line-through" },
  addBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 6, cursor: "pointer", flex: 1 },
  qtyBox: { display: "flex", alignItems: "center", gap: 10 },
  qtyBtn: { width: 35, height: 35, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "6px", cursor: "pointer" },
  cartPageGrid: { display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" },
  cartItemsListContainer: { flex: 2, display: "flex", flexDirection: "column", gap: "15px", minWidth: "300px" },
  cartItemRow: { display: "flex", alignItems: "center", gap: "15px", background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  cartPageImage: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" },
  cartTrashBtn: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", marginLeft: "10px" },
  summaryCard: { flex: 1, background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", minWidth: "250px", height: "fit-content" },
  buyBtn: { background: "#2563eb", color: "#fff", border: "none", width: "100%", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  cancelBtn: { background: "#e2e8f0", color: "#475569", border: "none", width: "100%", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, padding: "20px" },
  modal: { background: "#fff", width: "100%", maxWidth: "500px", padding: "25px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" },
  formLabel: { display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" },
  input: { width: "100%", height: "44px", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0 12px", boxSizing: "border-box", fontSize: "14px", marginBottom: "15px", outline: "none" },
  paymentMethodContainer: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" },
  paymentOptionCard: { display: "flex", alignItems: "center", gap: "12px", padding: "14px", border: "1px solid", borderRadius: "8px", cursor: "pointer" },
  credentialBox: { padding: "15px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", marginBottom: "15px" },
  backToShopBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" },
  emptyStateContainer: { textAlign: "center", padding: "50px 20px" },
  shopNowRedirectBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" },
  errorContainer: { textAlign: "center", padding: "30px" },
  retryBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
  footer: { background: "#0f172a", color: "#94a3b8", padding: "40px 20px 20px", borderRadius: "12px", marginTop: "40px" },
  footerTop: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "30px", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "30px" },
  footerBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", fontSize: "14px" },
  paymentIcons: { display: "flex", gap: "15px" }
};
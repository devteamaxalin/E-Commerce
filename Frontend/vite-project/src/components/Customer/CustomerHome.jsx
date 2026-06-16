import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaShoppingCart, FaUser, FaTrash, FaArrowLeft, FaCheckCircle, FaShoppingBag } from "react-icons/fa";
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

  const toggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Please login first", "error");
        return;
      }

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

      showNotification(`Order Placed Successfully!`, "success");

      if (!buyNowProduct) setCart([]);
      setFullName(""); setAddress(""); setPhone("");
      setSelectedPayment(""); setUpiId(""); setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv("");
      setBuyNowProduct(null); 
      setShowCheckout(false); 
      
      // Redirect straight to user orders routing frame tracking layout page
      navigate("/dashboard/orders");
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
          <div style={styles.navItem} onClick={() => navigate("/dashboard/orders")}>
            <FaShoppingBag style={{ color: "#666" }} />
            <span>Track Orders</span>
          </div>
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
              <h1 style={{ margin: "0 0 10px 0", fontSize: "42px" }}>UP TO 50% OFF</h1>
              <h3 style={{ margin: "0 0 20px 0", fontWeight: "400" }}>Electronics & Accessories</h3>
              <button style={styles.shopBtn} onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}>Shop Now</button>
            </div>
          </div>

          <div ref={productsRef}><h2 style={{ marginBottom: 20, color: "#1e293b" }}>Featured Products</h2></div>

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
            <p>Electronics</p><p>Fashion</p><p>Home & Living</p>
          </div>
          <div>
            <h4>Customer Service</h4>
            <p>Contact Us</p><p>FAQs</p><p>Track Order</p>
          </div>
          <div>
            <h4>My Account</h4>
            <p onClick={() => navigate("/dashboard/orders")} style={{ cursor: "pointer" }}>My Orders</p>
            <p style={{ cursor: "pointer" }} onClick={() => setCurrentPage("wishlist")}>Wishlist</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About Us</p><p>Privacy Policy</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 ShopEase. All Rights Reserved.</p>
          <div style={styles.paymentIcons}>
            <span>💳 VISA</span><span>💳 MasterCard</span><span>💳 UPI</span>
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
  container: { padding: 20, fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: "12px 24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px" },
  logoSection: { display: "flex", alignItems: "center", gap: "12px" },
  menuIcon: { fontSize: "20px", color: "#334155" },
  logo: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#2563eb", letterSpacing: "-0.02em" },
  searchWrapper: { display: "flex", alignItems: "center", position: "relative", width: "40%" },
  searchIcon: { position: "absolute", left: "12px", color: "#94a3b8" },
  searchInput: { width: "100%", padding: "10px 12px 10px 38px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "#f8fafc", outline: "none" },
  navActions: { display: "flex", gap: "24px" },
  navItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", fontWeight: "500", cursor: "pointer" },
  hero: { background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "48px", borderRadius: "16px", marginBottom: "32px", display: "flex", alignItems: "center", color: "#1e293b" },
  shopBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", position: "relative", display: "flex", flexDirection: "column" },
  wishlistIconContainer: { position: "absolute", top: "12px", right: "12px", cursor: "pointer", zIndex: 10 },
  discountBadge: { position: "absolute", top: "12px", left: "12px", background: "#dc2626", color: "#fff", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" },
  image: { width: "100%", height: "180px", objectFit: "contain", marginBottom: "12px" },
  noImagePlaceholder: { width: "100%", height: "180px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", borderRadius: "8px", marginBottom: "12px" },
  productName: { margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#1e293b" },
  brandText: { margin: "0 0 8px 0", fontSize: "12px", color: "#64748b" },
  priceRow: { display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" },
  price: { fontSize: "18px", fontWeight: "700", color: "#0f172a" },
  originalPrice: { fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" },
  buttonGroup: { display: "flex", gap: "8px", marginTop: "auto", paddingTop: "12px" },
  addBtn: { background: "#f1f5f9", color: "#1e293b", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", flex: 1 },
  goCartBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", flex: 1 },
  buyNowBtn: { background: "#166534", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", flex: 1 },
  outOfStockBtn: { background: "#cbd5e1", color: "#64748b", border: "none", padding: "10px", borderRadius: "8px", cursor: "not-allowed", fontSize: "13px", flex: 1 },
  backToShopBtn: { background: "none", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontWeight: "500" },
  emptyStateContainer: { textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" },
  shopNowRedirectBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginTop: "16px" },
  cartPageGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" },
  cartItemsListContainer: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" },
  cartItemRow: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 0", borderBottom: "1px solid #f1f5f9" },
  cartPageImage: { width: "64px", height: "64px", objectFit: "contain" },
  qtyBox: { display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px" },
  qtyBtn: { background: "none", border: "none", cursor: "pointer", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  cartTrashBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px", padding: "8px" },
  summaryCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", height: "fit-content" },
  buyBtn: { width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  cancelBtn: { width: "100%", background: "none", border: "1px solid #cbd5e1", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", fontSize: "15px", marginTop: "8px", color: "#64748b" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "20px" },
  modal: { background: "#fff", borderRadius: "16px", padding: "24px", width: "100%", maxHeight: "90vh", overflowY: "auto", maxWidth: "540px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  formLabel: { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px", marginTop: "12px" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" },
  paymentMethodContainer: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" },
  paymentOptionCard: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" },
  credentialBox: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", marginBottom: "16px" },
  footer: { marginTop: "64px", borderTop: "1px solid #e2e8f0", paddingTop: "32px", color: "#64748b" },
  footerTop: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px", marginBottom: "32px" },
  footerBottom: { display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: "16px", fontSize: "13px" },
  paymentIcons: { display: "flex", gap: "12px" },
  loadingContainer: { textAlign: "center", padding: "48px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" },
  errorContainer: { textAlign: "center", padding: "32px" },
  retryBtn: { background: "#cbd5e1", color: "#1e293b", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginLeft: "8px" },
  noProducts: { gridColumn: "1/-1", textAlign: "center", padding: "48px", color: "#64748b" }
};
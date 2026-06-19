import React, { useState, useEffect } from "react";
import axios from "axios";
 
const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {  
  fetchWishlist();
}, []);

const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://127.0.0.1:8000/api/wishlist",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setWishlist(res.data);
  } catch (err) {
    console.error(err);
  }
};
 
 const removeItem = async (productId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://127.0.0.1:8000/api/wishlist/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchWishlist();
  } catch (err) {
    console.error(err);
  }
};
 
  const addToCart = (item) => {
    alert(`${item.name} added to cart!`);
  };
 
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>❤️ My Wishlist</h1>
 
      {wishlist.length === 0 ? (
        <p style={styles.empty}>No items in wishlist</p>
      ) : (
        <div style={styles.grid}>
          {wishlist.map((item) => (
            <div key={item.id} style={styles.card}>
             <img
  src={item.image_url}
  alt={item.name}
  style={styles.image}
/>
              <h3 style={styles.name}>{item.name}</h3>
              <p style={styles.price}>₹{item.price}</p>
              <div style={styles.buttons}>
                <button
                  style={styles.cartBtn}
                  onClick={() => addToCart(item)}
                >
                  Add To Cart
                </button>
 
                <button
                  style={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
const styles = {
  container: {
    padding: "30px",
    background: "#f5f7fa",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    fontSize: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  name: {
    marginTop: "10px",
  },
  price: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  cartBtn: {
    flex: 1,
    padding: "8px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  removeBtn: {
    flex: 1,
    padding: "8px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
 
export default WishList;
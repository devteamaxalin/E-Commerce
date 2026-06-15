import React, { useState, useEffect } from "react";
import axios from "axios";

const ShippingAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch all addresses from MySQL backend on component mount
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:8000/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a new address to MySQL backend
  const addAddress = async (e) => {
    e.preventDefault();
    if (!form.address || !form.phone) {
      alert("Address and phone number are required!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Note: Your backend matches 'label', 'address', and 'phone'
      const payload = {
        label: form.label || "Home",
        address: form.address,
        phone: form.phone,
      };

      await axios.post("http://127.0.0.1:8000/api/addresses", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear the form fields and refresh list
      setForm({ label: "", address: "", phone: "" });
      await fetchAddresses();
    } catch (err) {
      console.error("Error saving address:", err);
      alert(err.response?.data?.detail || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // Delete an address from MySQL backend
  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optimistically update UI state or re-fetch
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
      alert(err.response?.data?.detail || "Failed to delete address");
    }
  };

  return (
    <div className="shipping-wrapper">
      <style>{`
        .shipping-wrapper {
          display: flex;
          gap: 20px;
          padding: 20px;
          background: #f6f7fb;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        /* LEFT FORM */
        .shipping-form {
          flex: 1;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          height: fit-content;
        }

        .shipping-form h2 {
          margin-bottom: 15px;
        }

        .shipping-form input,
        .shipping-form textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          font-family: Arial, sans-serif;
        }

        .shipping-form button {
          width: 100%;
          padding: 10px;
          background: #6c5ce7;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .shipping-form button:disabled {
          background: #a29bfe;
          cursor: not-allowed;
        }

        /* RIGHT LIST */
        .address-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .address-card {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-left: 4px solid #6c5ce7;
        }

        .address-card h4 {
          margin: 0 0 5px 0;
          color: #2d3436;
          font-size: 16px;
        }

        .address-card p {
          margin: 4px 0;
          color: #555;
          font-size: 14px;
          line-height: 1.4;
        }

        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
        }

        .delete {
          background: #d63031;
          color: white;
        }

        .no-address {
          text-align: center;
          padding: 30px;
          background: #fff;
          border-radius: 12px;
          color: #7f8c8d;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .shipping-wrapper {
            flex-direction: column;
          }
        }
      `}</style>

      {/* FORM */}
      <div className="shipping-form">
        <h2>Shipping Address</h2>

        <form onSubmit={addAddress}>
          <input
            type="text"
            name="label"
            placeholder="Address Type (e.g., Home, Office, Default)"
            value={form.label}
            onChange={handleChange}
          />

          <textarea
            name="address"
            rows="3"
            placeholder="Full Delivery Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="10-Digit Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving Address..." : "Save Address"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="address-list">
        {addresses.length === 0 ? (
          <div className="no-address">
            📍 No saved addresses found. Please add an address using the form.
          </div>
        ) : (
          addresses.map((item) => (
            <div key={item.id} className="address-card">
              <h4>🏠 {item.label}</h4>
              <p>{item.address}</p>
              <p>📞 {item.phone}</p>

              <div className="btn-group">
                <button
                  className="btn delete"
                  onClick={() => deleteAddress(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShippingAddresses;
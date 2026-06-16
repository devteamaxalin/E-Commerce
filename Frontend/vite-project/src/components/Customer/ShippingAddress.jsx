import React, { useState, useEffect } from "react";
import { MapPin, Phone, Home, Trash2, PlusCircle, AlertCircle } from "lucide-react";
 
const ShippingAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    setAddresses(stored);
  }, []);
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const addAddress = (e) => {
    e.preventDefault();
    if (!form.address || !form.phone) {
      alert("Address and phone number are required!");
      return;
    }
 
    setLoading(true);
 
    const newAddress = {
      id: Date.now(),
      label: form.label || "Home",
      address: form.address,
      phone: form.phone,
    };
 
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    setForm({ label: "", address: "", phone: "" });
    setLoading(false);
  };
 
  const deleteAddress = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
  };
 
  return (
<div className="shipping-wrapper">
<style>{`
        .shipping-wrapper {
          display: flex;
          gap: 32px;
          padding: 40px;
          background: #f6f7fb;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }
 
        .shipping-form {
          flex: 1;
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          height: fit-content;
        }
 
        .shipping-form h2 {
          margin-bottom: 24px;
          color: #0f172a;
          font-size: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
 
        .shipping-form input,
        .shipping-form textarea {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 18px;
          border: 1px solid #ddd;
          border-radius: 10px;
          outline: none;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          font-size: 15px;
        }
 
        .shipping-form input:focus,
        .shipping-form textarea:focus {
          border-color: #6c5ce7;
          box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
        }
 
        .shipping-form button[type="submit"] {
          width: 100%;
          padding: 14px;
          background: #6c5ce7;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }
 
        .shipping-form button[type="submit"]:hover {
          background: #5b4bd4;
        }
 
        .shipping-form button[type="submit"]:disabled {
          background: #a29bfe;
          cursor: not-allowed;
        }
 
        .address-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
 
        .address-card {
          background: #fff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          border-left: 5px solid #6c5ce7;
        }
 
        .address-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
 
        .address-card-header h4 {
          margin: 0;
          color: #2d3436;
          font-size: 18px;
          font-weight: 700;
        }
 
        .address-card-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 8px 0;
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }
 
        .address-card-row svg {
          margin-top: 3px;
          flex-shrink: 0;
        }
 
        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
 
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 7px;
        }
 
        .delete {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
 
        .delete:hover {
          background: #fee2e2;
        }
 
        .no-address {
          text-align: center;
          padding: 70px 30px;
          background: #fff;
          border-radius: 16px;
          color: #7f8c8d;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
 
        .no-address p {
          margin: 0;
          font-size: 17px;
        }
 
        @media (max-width: 768px) {
          .shipping-wrapper {
            flex-direction: column;
            padding: 16px;
            gap: 16px;
          }
 
          .shipping-form {
            padding: 20px;
          }
 
          .address-card {
            padding: 20px;
          }
        }
      `}</style>
 
      {/* FORM */}
<div className="shipping-form">
<h2>
<MapPin size={24} color="#6c5ce7" />
          Shipping Address
</h2>
 
        <form onSubmit={addAddress}>
<input
            type="text"
            name="label"
            placeholder="Address Type (e.g., Home, Office)"
            value={form.label}
            onChange={handleChange}
          />
 
          <textarea
            name="address"
            rows="4"
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
<PlusCircle size={18} />
            {loading ? "Saving..." : "Save Address"}
</button>
</form>
</div>
 
      {/* LIST */}
<div className="address-list">
        {addresses.length === 0 ? (
<div className="no-address">
<AlertCircle size={55} color="#a29bfe" />
<p>No saved addresses found.</p>
<p style={{ fontSize: "14px", color: "#aaa" }}>
              Add an address using the form.
</p>
</div>
        ) : (
          addresses.map((item) => (
<div key={item.id} className="address-card">
 
              <div className="address-card-header">
<Home size={20} color="#6c5ce7" />
<h4>{item.label}</h4>
</div>
 
              <div className="address-card-row">
<MapPin size={17} color="#6b7280" />
<span>{item.address}</span>
</div>
 
              <div className="address-card-row">
<Phone size={17} color="#6b7280" />
<span>{item.phone}</span>
</div>
 
              <div className="btn-group">
<button
                  className="btn delete"
                  onClick={() => deleteAddress(item.id)}
>
<Trash2 size={15} />
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
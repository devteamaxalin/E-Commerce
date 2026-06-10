import React, { useState } from "react";
 
const ShippingAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      address: "12-34, MG Road, Bangalore, Karnataka",
      phone: "9876543210",
    },
  ]);
 
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const addAddress = (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) return;
 
    const newAddress = {
      id: Date.now(),
      ...form,
    };
 
    setAddresses([...addresses, newAddress]);
    setForm({ name: "", address: "", phone: "" });
  };
 
  const deleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
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
        }
 
        .shipping-form button {
          width: 100%;
          padding: 10px;
          background: #6c5ce7;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
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
        }
 
        .address-card h4 {
          margin: 0 0 5px 0;
        }
 
        .address-card p {
          margin: 4px 0;
          color: #555;
          font-size: 14px;
        }
 
        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
 
        .btn {
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }
 
        .edit {
          background: #00b894;
          color: white;
        }
 
        .delete {
          background: #d63031;
          color: white;
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
            name="name"
            placeholder="Address Type (Home, Office)"
            value={form.name}
            onChange={handleChange}
          />
 
          <textarea
            name="address"
            rows="3"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
          />
 
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
 
          <button type="submit">Save Address</button>
        </form>
      </div>
 
      {/* LIST */}
      <div className="address-list">
        {addresses.map((item) => (
          <div key={item.id} className="address-card">
            <h4>{item.name}</h4>
            <p>{item.address}</p>
            <p>📞 {item.phone}</p>
 
            <div className="btn-group">
              <button className="btn edit">Edit</button>
              <button
                className="btn delete"
                onClick={() => deleteAddress(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default ShippingAddresses;
 
import React, { useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
 
const PaymentMethods = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "John Doe",
      number: "**** **** **** 4242",
      expiry: "12/26",
      type: "Visa",
    },
  ]);
 
  const [form, setForm] = useState({
    name: "",
    number: "",
    expiry: "",
    type: "",
  });
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const addCard = (e) => {
    e.preventDefault();
 
    if (!form.name || !form.number) return;
 
    const newCard = {
      id: Date.now(),
      name: form.name,
      number: "**** **** **** " + form.number.slice(-4),
      expiry: form.expiry,
      type: form.type,
    };
 
    setCards([...cards, newCard]);
 
    setForm({
      name: "",
      number: "",
      expiry: "",
      type: "",
    });
  };
 
  const deleteCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };
 
  return (
    <div className="payment-container">
      <h2 className="title">Payment Methods</h2>
 
      {/* Cards List */}
      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <div className="card-top">
              <CreditCard size={22} />
              <button onClick={() => deleteCard(card.id)}>
                <Trash2 size={18} />
              </button>
            </div>
 
            <h3>{card.type || "Card"}</h3>
            <p className="number">{card.number}</p>
 
            <div className="card-footer">
              <span>{card.name}</span>
              <span>{card.expiry}</span>
            </div>
          </div>
        ))}
      </div>
 
      {/* Add Card Form */}
      <div className="form-box">
        <h3>Add New Card</h3>
 
        <form onSubmit={addCard}>
          <input
            type="text"
            name="name"
            placeholder="Card Holder Name"
            value={form.name}
            onChange={handleChange}
          />
 
          <input
            type="text"
            name="number"
            placeholder="Card Number"
            value={form.number}
            onChange={handleChange}
            maxLength={16}
          />
 
          <div className="row">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
            />
 
            <input
              type="text"
              name="type"
              placeholder="Visa / MasterCard"
              value={form.type}
              onChange={handleChange}
            />
          </div>
 
          <button type="submit" className="add-btn">
            <Plus size={18} /> Add Card
          </button>
        </form>
      </div>
 
      {/* Styles */}
      <style>{`
        .payment-container{
          padding:20px;
        }
 
        .title{
          font-size:22px;
          margin-bottom:15px;
          font-weight:600;
        }
 
        .card-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:15px;
          margin-bottom:25px;
        }
 
        .card{
          background:#fff;
          border-radius:12px;
          padding:15px;
          box-shadow:0 2px 10px rgba(0,0,0,0.08);
        }
 
        .card-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }
 
        .card-top button{
          background:none;
          border:none;
          cursor:pointer;
          color:#ff4d4d;
        }
 
        .number{
          margin:10px 0;
          letter-spacing:2px;
          font-weight:500;
        }
 
        .card-footer{
          display:flex;
          justify-content:space-between;
          font-size:13px;
          color:gray;
        }
 
        .form-box{
          background:#fff;
          padding:15px;
          border-radius:12px;
          box-shadow:0 2px 10px rgba(0,0,0,0.08);
        }
 
        .form-box h3{
          margin-bottom:10px;
        }
 
        input{
          width:100%;
          padding:10px;
          margin-bottom:10px;
          border:1px solid #ddd;
          border-radius:8px;
          outline:none;
        }
 
        .row{
          display:flex;
          gap:10px;
        }
 
        .row input{
          flex:1;
        }
 
        .add-btn{
          width:100%;
          background:#6c5ce7;
          color:#fff;
          border:none;
          padding:10px;
          border-radius:8px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          font-weight:500;
        }
 
        /* MOBILE RESPONSIVE */
        @media (max-width:768px){
          .card-grid{
            grid-template-columns:1fr;
          }
 
          .row{
            flex-direction:column;
          }
        }
      `}</style>
    </div>
  );
};
 
export default PaymentMethods;
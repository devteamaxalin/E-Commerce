// import React, { useState, useRef } from "react";
// import { FaPlusCircle, FaTrashAlt, FaBoxes, FaCamera } from "react-icons/fa";
 
// export default function Admin({ products, setProducts }) {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState("");
//   const [alert, setAlert] = useState(null);
 
//   const fileInputRef = useRef(null);
 
//   const handleCaptureImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
 
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };
 
//   const handleAddProduct = (e) => {
//     e.preventDefault();
 
//     if (!name.trim() || !price || !image) {
//       showAlert("All fields including a product image are strictly required!", "error");
//       return;
//     }
 
//     const newProduct = {
//       id: Date.now(),
//       name: name.trim(),
//       price: Number(price),
//       image: image
//     };
 
//     setProducts([newProduct, ...products]);
//     showAlert("Product successfully pushed to Storefront!", "success");
 
//     setName("");
//     setPrice("");
//     setImage("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };
 
//   // This updates the shared state, instantly removing it everywhere across the app
//   const handleDeleteProduct = (id) => {
//     const updatedProducts = products.filter((p) => p.id !== id);
//     setProducts(updatedProducts);
//     showAlert("Item purged from stock catalogue.", "error");
//   };
 
//   const showAlert = (msg, type) => {
//     setAlert({ msg, type });
//     setTimeout(() => setAlert(null), 3000);
//   };
 
//   return (
//     <div style={styles.adminContainer}>
//       {alert && (
//         <div style={{
//           ...styles.banner,
//           background: alert.type === "success" ? "#16a34a" : "#dc2626"
//         }}>
//           {alert.msg}
//         </div>
//       )}
 
//       <div style={styles.adminHeader}>
//         <FaBoxes style={{ fontSize: "28px", color: "#dc2626" }} />
//         <h2 style={{ margin: 0 }}>System Inventory Console (Admin)</h2>
//       </div>
 
//       <div style={styles.dashboardLayout}>
//         {/* Creation Card Panel */}
//         <div style={styles.adminFormCard}>
//           <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#334155" }}>Add New Catalogue Item</h3>
//           <form onSubmit={handleAddProduct}>
//             <label style={styles.formLabel}>Product Display Title</label>
//             <input
//               type="text"
//               placeholder="e.g., iPad Pro M4"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               style={styles.adminInput}
//             />
 
//             <label style={styles.formLabel}>Retail Value Price (₹)</label>
//             <input
//               type="number"
//               placeholder="e.g., 99999"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               style={styles.adminInput}
//             />
 
//             <label style={styles.formLabel}>Product Photograph Asset</label>
           
//             <input
//               type="file"
//               accept="image/*"
//               capture="environment"
//               ref={fileInputRef}
//               onChange={handleCaptureImage}
//               style={{ display: "none" }}
//             />
 
//             <div
//               onClick={() => fileInputRef.current?.click()}
//               style={{
//                 ...styles.cameraTriggerBox,
//                 borderColor: image ? "#16a34a" : "#cbd5e1"
//               }}
//             >
//               {image ? (
//                 <div style={styles.previewImageContainer}>
//                   <img src={image} alt="Capture preview" style={styles.cameraLivePreview} />
//                   <div style={styles.retakeOverlay}>
//                     <FaCamera /> Tap to Retake Photo
//                   </div>
//                 </div>
//               ) : (
//                 <div style={styles.triggerPlaceholderText}>
//                   <FaCamera style={{ fontSize: "24px", marginBottom: "8px", color: "#64748b" }} />
//                   <span>Open System Camera / Upload Image</span>
//                 </div>
//               )}
//             </div>
 
//             <button type="submit" style={styles.submitProductBtn}>
//               <FaPlusCircle /> Register Product
//             </button>
//           </form>
//         </div>
 
//         {/* Live Active Directory List */}
//         <div style={styles.inventoryTableCard}>
//           <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#334155" }}>
//             Live Active Inventory ({products.length})
//           </h3>
//           <div style={styles.tableScrollWrapper}>
//             <table style={styles.inventoryTable}>
//               <thead>
//                 <tr style={styles.thRow}>
//                   <th style={styles.tableHeaderCell}>Asset Preview</th>
//                   <th style={styles.tableHeaderCell}>Title</th>
//                   <th style={styles.tableHeaderCell}>Price</th>
//                   <th style={styles.tableHeaderCell}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product.id} style={styles.tableBodyRow}>
//                     <td style={styles.tableCell}>
//                       <img src={product.image} alt={product.name} style={styles.miniThumbnail} />
//                     </td>
//                     <td style={{ ...styles.tableCell, fontWeight: "bold" }}>{product.name}</td>
//                     <td style={{ ...styles.tableCell, color: "green", fontWeight: "bold" }}>
//                       ₹{product.price.toLocaleString()}
//                     </td>
//                     <td style={styles.tableCell}>
//                       <button
//                         style={styles.deleteAssetRowBtn}
//                         onClick={() => handleDeleteProduct(product.id)}
//                       >
//                         <FaTrashAlt /> Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
 
// const styles = {
//   adminContainer: { padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif", minHeight: "85vh" },
//   adminHeader: { display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px", marginBottom: "30px" },
//   dashboardLayout: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px", alignItems: "start" },
//   adminFormCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
//   formLabel: { display: "block", fontSize: "13px", fontWeight: "bold", color: "#64748b", marginBottom: "6px" },
//   adminInput: { width: "100%", padding: "12px", marginBottom: "18px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box", fontSize: "14px", outline: "none" },
//   cameraTriggerBox: { width: "100%", height: "160px", border: "2px dashed #cbd5e1", borderRadius: "8px", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "25px", position: "relative" },
//   triggerPlaceholderText: { display: "flex", flexDirection: "column", alignItems: "center", color: "#64748b", fontSize: "13px", fontWeight: "bold" },
//   previewImageContainer: { width: "100%", height: "100%", position: "relative" },
//   cameraLivePreview: { width: "100%", height: "100%", objectFit: "cover" },
//   retakeOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "6px", fontSize: "11px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
//   submitProductBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#dc2626", color: "#fff", border: "none", padding: "14px", borderRadius: "6px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" },
//   inventoryTableCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
//   tableScrollWrapper: { overflowX: "auto", maxHeight: "450px", overflowY: "auto" },
//   inventoryTable: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
//   thRow: { background: "#f8fafc", borderBottom: "2px solid #edf2f7" },
//   tableHeaderCell: { padding: "12px", fontSize: "14px", color: "#475569", fontWeight: "bold" },
//   tableBodyRow: { borderBottom: "1px solid #f1f5f9", transition: "0.2s" },
//   tableCell: { padding: "12px", fontSize: "14px", color: "#334155" },
//   miniThumbnail: { width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" },
//   deleteAssetRowBtn: { display: "flex", alignItems: "center", gap: "5px", background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
//   banner: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", borderRadius: "8px", color: "#fff", fontWeight: "bold", zIndex: 99999 }
// };
 
 
 
 
 
 
 
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";
import { FaPlusCircle, FaTrashAlt, FaBoxes, FaCamera } from "react-icons/fa";
 
export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [alert, setAlert] = useState(null);
  const fileInputRef = useRef(null);
 
  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };
 
  const handleCaptureImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };
 
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !image) {
      showAlert("All fields including a product image are strictly required!", "error");
      return;
    }
    const newProduct = { id: Date.now(), name: name.trim(), price: Number(price), image };
    setProducts([newProduct, ...products]);
    showAlert("Product successfully pushed to Storefront!", "success");
    setName(""); setPrice(""); setImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
 
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    showAlert("Item purged from stock catalogue.", "error");
  };
 
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };
 
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "Arial, sans-serif" }}>
      <AdminMenu onLogout={handleSignOut} />
 
      <div style={styles.adminContainer}>
        {alert && (
          <div style={{ ...styles.banner, background: alert.type === "success" ? "#16a34a" : "#dc2626" }}>
            {alert.msg}
          </div>
        )}
 
        <div style={styles.adminHeader}>
          <FaBoxes style={{ fontSize: "28px", color: "#dc2626" }} />
          <h2 style={{ margin: 0 }}>System Inventory Console (Admin)</h2>
        </div>
 
        <div style={styles.dashboardLayout}>
          <div style={styles.adminFormCard}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#334155" }}>Add New Catalogue Item</h3>
            <form onSubmit={handleAddProduct}>
              <label style={styles.formLabel}>Product Display Title</label>
              <input type="text" placeholder="e.g., iPad Pro M4" value={name}
                onChange={(e) => setName(e.target.value)} style={styles.adminInput} />
 
              <label style={styles.formLabel}>Retail Value Price (₹)</label>
              <input type="number" placeholder="e.g., 99999" value={price}
                onChange={(e) => setPrice(e.target.value)} style={styles.adminInput} />
 
              <label style={styles.formLabel}>Product Photograph Asset</label>
              <input type="file" accept="image/*" capture="environment"
                ref={fileInputRef} onChange={handleCaptureImage} style={{ display: "none" }} />
 
              <div onClick={() => fileInputRef.current?.click()}
                style={{ ...styles.cameraTriggerBox, borderColor: image ? "#16a34a" : "#cbd5e1" }}>
                {image ? (
                  <div style={styles.previewImageContainer}>
                    <img src={image} alt="Capture preview" style={styles.cameraLivePreview} />
                    <div style={styles.retakeOverlay}><FaCamera /> Tap to Retake Photo</div>
                  </div>
                ) : (
                  <div style={styles.triggerPlaceholderText}>
                    <FaCamera style={{ fontSize: "24px", marginBottom: "8px", color: "#64748b" }} />
                    <span>Open System Camera / Upload Image</span>
                  </div>
                )}
              </div>
 
              <button type="submit" style={styles.submitProductBtn}>
                <FaPlusCircle /> Register Product
              </button>
            </form>
          </div>
 
          <div style={styles.inventoryTableCard}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#334155" }}>
              Live Active Inventory ({products.length})
            </h3>
            <div style={styles.tableScrollWrapper}>
              <table style={styles.inventoryTable}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.tableHeaderCell}>Asset Preview</th>
                    <th style={styles.tableHeaderCell}>Title</th>
                    <th style={styles.tableHeaderCell}>Price</th>
                    <th style={styles.tableHeaderCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={styles.tableBodyRow}>
                      <td style={styles.tableCell}>
                        <img src={product.image} alt={product.name} style={styles.miniThumbnail} />
                      </td>
                      <td style={{ ...styles.tableCell, fontWeight: "bold" }}>{product.name}</td>
                      <td style={{ ...styles.tableCell, color: "green", fontWeight: "bold" }}>
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td style={styles.tableCell}>
                        <button style={styles.deleteAssetRowBtn} onClick={() => handleDeleteProduct(product.id)}>
                          <FaTrashAlt /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  adminContainer: { padding: "40px 20px", flex: 1, fontFamily: "Arial, sans-serif", minHeight: "85vh" },
  adminHeader: { display: "flex", alignItems: "center", gap: "12px", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px", marginBottom: "30px" },
  dashboardLayout: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px", alignItems: "start" },
  adminFormCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  formLabel: { display: "block", fontSize: "13px", fontWeight: "bold", color: "#64748b", marginBottom: "6px" },
  adminInput: { width: "100%", padding: "12px", marginBottom: "18px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box", fontSize: "14px", outline: "none" },
  cameraTriggerBox: { width: "100%", height: "160px", border: "2px dashed #cbd5e1", borderRadius: "8px", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "25px", position: "relative" },
  triggerPlaceholderText: { display: "flex", flexDirection: "column", alignItems: "center", color: "#64748b", fontSize: "13px", fontWeight: "bold" },
  previewImageContainer: { width: "100%", height: "100%", position: "relative" },
  cameraLivePreview: { width: "100%", height: "100%", objectFit: "cover" },
  retakeOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "6px", fontSize: "11px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
  submitProductBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#dc2626", color: "#fff", border: "none", padding: "14px", borderRadius: "6px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" },
  inventoryTableCard: { background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  tableScrollWrapper: { overflowX: "auto", maxHeight: "450px", overflowY: "auto" },
  inventoryTable: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { background: "#f8fafc", borderBottom: "2px solid #edf2f7" },
  tableHeaderCell: { padding: "12px", fontSize: "14px", color: "#475569", fontWeight: "bold" },
  tableBodyRow: { borderBottom: "1px solid #f1f5f9", transition: "0.2s" },
  tableCell: { padding: "12px", fontSize: "14px", color: "#334155" },
  miniThumbnail: { width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" },
  deleteAssetRowBtn: { display: "flex", alignItems: "center", gap: "5px", background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
  banner: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", borderRadius: "8px", color: "#fff", fontWeight: "bold", zIndex: 99999 }
};
 
 
 
 
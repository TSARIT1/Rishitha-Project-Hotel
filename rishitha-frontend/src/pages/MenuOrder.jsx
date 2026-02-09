import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Minus, Plus, ChevronLeft, 
  Utensils, CheckCircle, Clock, Star, Search, X
} from 'lucide-react';
import './MenuOrder.css';

const MenuOrder = () => {
  const { tableNo } = useParams();
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { default: api } = await import('../services/api');
      const response = await api.get('/menu');
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        ...item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId].quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((count, item) => count + item.quantity, 0);
  };

  const placeOrder = async () => {
    try {
      const { default: api } = await import('../services/api');
      
      const orderPayload = {
        tableNumber: parseInt(tableNo) || 0, // Fallback to 0 if NaN
        customerName: "Guest (QR)", // Basic guest
        waiterName: "App", // Auto-assigned
        instructions: instructions, // Add instructions to payload
        items: Object.values(cart).map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/orders', orderPayload);
      
      if (response.data.success) {
        setOrderPlaced(true);
        setCart({});
        setShowCart(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert('Failed to place order. Please try again.');
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (orderPlaced) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light p-4 text-center">
      <div className="mb-4 text-success">
        <CheckCircle size={80} />
      </div>
      <h2 className="fw-bold mb-3">Order Placed Successfully!</h2>
      <p className="text-muted mb-4">
        Your order for <strong>Table {tableNo}</strong> has been sent to the kitchen. 
        It will be served shortly.
      </p>
      <button className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm" onClick={() => setOrderPlaced(false)}>
        Order More Items
      </button>
    </div>
  );

  return (
    <div className="menu-order-page min-vh-100">
      
      {/* 1. Hero Section */}
      <div className="menu-hero">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <button className="btn btn-white btn-sm rounded-circle p-2 shadow-sm" onClick={() => navigate('/')}>
            <ChevronLeft size={20} className="text-dark" />
          </button>
          <div className="bg-white text-dark px-3 py-1 rounded-pill small fw-bold shadow-sm d-flex align-items-center gap-1">
             <Utensils size={14} className="text-primary" />
             Table {tableNo}
          </div>
        </div>
        <h2 className="display-6 fw-bold mb-0">What would you like to eat?</h2>
        <p className="opacity-75 small mt-1 mb-0">Discover our delicious culinary delights.</p>
      </div>

      {/* 2. Search Box (Floating overlap) */}
      <div className="menu-search-container position-relative z-2">
         <div className="input-group search-box-glass rounded-4 p-1">
             <span className="input-group-text border-0 bg-transparent ps-3"><Search size={18} className="text-muted"/></span>
             <input 
               type="text" 
               className="form-control border-0 bg-transparent shadow-none" 
               placeholder="Search for dishes..."
               style={{ fontSize: '0.95rem' }}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
         </div>
      </div>

      {/* 3. Sticky Category Nav */}
      <div className="category-nav overflow-auto no-scrollbar d-flex gap-2 px-3 mt-2">
         {categories.map(cat => (
           <button 
             key={cat}
             className={`btn btn-sm rounded-pill px-4 py-2 category-pill whitespace-nowrap ${selectedCategory === cat ? 'active' : 'inactive'}`}
             onClick={() => setSelectedCategory(cat)}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* 4. Menu Grid */}
      <div className="container-fluid px-3 pb-5 pt-2">
        <h6 className="fw-bold mb-3 ms-1 text-dark">{selectedCategory === 'All' ? 'Popular Dishes' : selectedCategory}</h6>
        <div className="row g-3">
          {filteredItems.map(item => (
            <div key={item.id} className="col-6 col-md-4 col-lg-3">
              <div className="product-card h-100 rounded-4 overflow-hidden position-relative d-flex flex-column">
                <div className="product-image-container">
                   <img 
                      src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"} 
                      alt={item.name}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80";
                      }}
                   />
                   <div className="food-type-icon">
                      <div className={`rounded-circle ${item.type === 'Veg' ? 'bg-success' : 'bg-danger'}`} style={{ width: '8px', height: '8px' }}></div>
                   </div>
                   {(item.rating && item.rating >= 4.5) && (
                      <div className="bestseller-badge">Bestseller</div>
                   )}
                </div>
                
                <div className="p-3 d-flex flex-column flex-grow-1">
                   <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="fw-bold mb-0 text-dark small text-truncate w-100">{item.name}</h6>
                   </div>
                   <div className="d-flex align-items-center gap-1 mb-2">
                       <Star size={10} className="text-warning fill-warning" />
                       <span className="tiny-text fw-bold text-muted">{item.rating || '4.5'}</span>
                       <span className="tiny-text text-muted ms-1">(120+)</span>
                   </div>
                   
                   <div className="mt-auto d-flex align-items-center justify-content-between">
                      <div className="fw-bolder text-dark">₹{item.price}</div>
                      
                      {cart[item.id] ? (
                         <div className="d-flex align-items-center quantity-control rounded-pill p-1">
                            <button className="btn btn-sm btn-link text-white p-0 px-1" onClick={() => removeFromCart(item.id)}><Minus size={12}/></button>
                            <span className="mx-1 small fw-bold">{cart[item.id].quantity}</span>
                            <button className="btn btn-sm btn-link text-white p-0 px-1" onClick={() => addToCart(item)}><Plus size={12}/></button>
                         </div>
                      ) : (
                         <button className="btn btn-sm btn-add rounded-pill px-3 py-1 small" onClick={() => addToCart(item)}>
                            ADD
                         </button>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Cart Bottom Sheet */}
      {showCart && (
        <div className="cart-overlay position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCart(false)}>
           <div className="cart-sheet position-absolute bottom-0 start-0 w-100 bg-white rounded-top-4 shadow-lg d-flex flex-column" style={{ maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                 <div>
                    <h5 className="fw-bold mb-0">Your Cart</h5>
                    <p className="text-muted tiny-text mb-0">{getCartCount()} items from {Object.keys(cart).length} dishes</p>
                 </div>
                 <button className="btn btn-light rounded-circle p-2" onClick={() => setShowCart(false)}>
                   <X size={20} />
                 </button>
              </div>
              
              <div className="p-3 overflow-auto flex-grow-1 custom-thin-scrollbar">
                 {Object.values(cart).map(item => (
                   <div key={item.id} className="d-flex align-items-center mb-3 bg-light rounded-4 p-2">
                      <img 
                        src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80"} 
                        className="rounded-3 me-3" 
                        style={{width: '60px', height: '60px', objectFit: 'cover'}}
                        alt=""
                        onError={(e) => {
                           e.target.onerror = null; 
                           e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80";
                         }}
                      />
                      <div className="flex-grow-1">
                         <div className="d-flex justify-content-between">
                            <h6 className="fw-bold small mb-1">{item.name}</h6>
                            <span className="fw-bold small">₹{item.price * item.quantity}</span>
                         </div>
                         <div className="d-flex align-items-center justify-content-between mt-2">
                            <span className="tiny-text text-muted">₹{item.price} / item</span>
                            <div className="d-flex align-items-center bg-white rounded-pill border px-1">
                                <button className="btn btn-sm p-1" onClick={() => removeFromCart(item.id)}><Minus size={12}/></button>
                                <span className="mx-2 small fw-bold">{item.quantity}</span>
                                <button className="btn btn-sm p-1" onClick={() => addToCart(item)}><Plus size={12}/></button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 <div className="mt-4">
                    <label className="form-label small fw-bold text-muted text-uppercase">Cooking Instructions</label>
                    <textarea 
                      className="form-control bg-light border-0 rounded-3" 
                      rows="2" 
                      placeholder="Example: Less spicy, no onions..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    ></textarea>
                 </div>
              </div>
              
              <div className="p-3 bg-white border-top">
                 <div className="d-flex justify-content-between mb-3 px-1">
                    <span className="text-muted small">Total Payable</span>
                    <span className="fw-bold h4 mb-0">₹{getCartTotal()}</span>
                 </div>
                 <button 
                   className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-lg d-flex justify-content-between px-4 align-items-center"
                   onClick={placeOrder}
                 >
                   <span>Place Order</span>
                   <span className="bg-white text-dark rounded-pill px-2 py-1 small fw-bold">PROCEED</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 6. Floating Cart Button */}
      {!showCart && getCartCount() > 0 && (
         <div className="position-fixed bottom-0 start-0 w-100 p-3" style={{ zIndex: 1040 }}>
            <button 
              className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-lg d-flex justify-content-between px-4 align-items-center glass-morphism border-0 text-white pulse-primary"
              style={{ background: '#1f2937' }}
              onClick={() => setShowCart(true)}
            >
              <div className="d-flex align-items-center gap-2">
                 <span className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center small fw-bold" style={{ width: '24px', height: '24px' }}>
                   {getCartCount()}
                 </span>
                 <span className="text-uppercase ls-1" style={{ fontSize: '0.9rem' }}>Place Order</span>
              </div>
              <span>₹{getCartTotal()}</span>
            </button>
         </div>
      )}
    </div>
  );
};

export default MenuOrder;

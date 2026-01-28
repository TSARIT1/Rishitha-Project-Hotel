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

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { default: api } = await import('../api/axiosConfig');
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
      const { default: api } = await import('../api/axiosConfig');
      
      const orderPayload = {
        tableNumber: parseInt(tableNo),
        customerName: "Guest (QR)", // Basic guest
        waiterName: "App", // Auto-assigned
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
    <div className="menu-order-page bg-light min-vh-100 position-relative pb-5">
      {/* Header */}
      <div className="bg-white shadow-sm sticky-top">
        <div className="d-flex align-items-center justify-content-between p-3">
          <button className="btn btn-light rounded-circle p-2" onClick={() => navigate('/')}>
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h6 className="mb-0 fw-bold text-uppercase ls-1 tiny-text text-muted">Digital Menu</h6>
            <h5 className="mb-0 fw-bold">Table {tableNo}</h5>
          </div>
          <div className="position-relative" onClick={() => getCartCount() > 0 && setShowCart(true)}>
             <ShoppingBag size={24} className={getCartCount() > 0 ? "text-primary" : "text-muted"} />
             {getCartCount() > 0 && (
               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                 {getCartCount()}
               </span>
             )}
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="px-3 pb-3">
          <div className="input-group input-group-sm bg-light rounded-pill border mb-3 overflow-hidden">
             <span className="input-group-text border-0 bg-transparent text-muted ps-3"><Search size={16}/></span>
             <input 
               type="text" 
               className="form-control border-0 bg-transparent shadow-none" 
               placeholder="Search dishes..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="d-flex gap-2 overflow-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`btn btn-sm rounded-pill px-3 fw-semibold whitespace-nowrap ${selectedCategory === cat ? 'btn-primary' : 'btn-white border'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container-fluid p-3">
        <div className="row g-3">
          {filteredItems.map(item => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div className="d-flex h-100">
                  <div className="flex-grow-1 p-3 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className={`badge ${item.type === 'Veg' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} x-small-text px-2 py-1 rounded`}>
                          {item.category}
                        </span>
                        <div className="d-flex align-items-center gap-1 text-warning small">
                          <Star size={12} fill="currentColor" />
                          <span className="fw-bold">{item.rating || 4.5}</span>
                        </div>
                      </div>
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <p className="text-muted tiny-text mb-2 line-clamp-2">
                        Delicious {item.category.toLowerCase()} dish prepared with fresh ingredients.
                      </p>
                      <div className="fw-bold text-primary">₹{item.price}</div>
                    </div>
                    
                    <div className="mt-3">
                       {cart[item.id] ? (
                         <div className="d-flex align-items-center bg-light rounded-pill p-1 border" style={{ width: 'fit-content' }}>
                            <button className="btn btn-sm btn-white rounded-circle shadow-sm p-1" onClick={() => removeFromCart(item.id)}>
                              <Minus size={14} />
                            </button>
                            <span className="fw-bold mx-3 small">{cart[item.id].quantity}</span>
                            <button className="btn btn-sm btn-white rounded-circle shadow-sm p-1" onClick={() => addToCart(item)}>
                              <Plus size={14} />
                            </button>
                         </div>
                       ) : (
                         <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold" onClick={() => addToCart(item)}>
                           ADD +
                         </button>
                       )}
                    </div>
                  </div>
                  <div className="bg-light" style={{ width: '110px', minHeight: '120px', backgroundImage: 'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                       {/* Placeholder image logic - could be dynamic */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Bottom Sheet / Popover */}
      {showCart && (
        <div className="cart-overlay position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
           <div className="cart-sheet position-absolute bottom-0 start-0 w-100 bg-white rounded-top-4 shadow-lg d-flex flex-column" style={{ maxHeight: '80vh' }}>
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                 <h5 className="fw-bold mb-0">Your Order</h5>
                 <button className="btn btn-light rounded-circle p-1" onClick={() => setShowCart(false)}>
                   <X size={20} />
                 </button>
              </div>
              
              <div className="p-3 overflow-auto flex-grow-1">
                 {Object.values(cart).map(item => (
                   <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                         <div className="bg-light rounded p-2 text-primary">
                           <Utensils size={16} />
                         </div>
                         <div>
                            <div className="fw-bold small">{item.name}</div>
                            <div className="tiny-text text-muted">₹{item.price} x {item.quantity}</div>
                         </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => removeFromCart(item.id)}>
                              <Minus size={14} />
                            </button>
                            <span className="fw-bold small">{item.quantity}</span>
                            <button className="btn btn-sm btn-light rounded-circle p-1" onClick={() => addToCart(item)}>
                              <Plus size={14} />
                            </button>
                      </div>
                   </div>
                 ))}
                 {Object.keys(cart).length === 0 && (
                   <div className="text-center py-5 text-muted">
                     <ShoppingBag size={40} className="mb-2 opacity-50"/>
                     <p>Your cart is empty</p>
                   </div>
                 )}
              </div>
              
              <div className="p-3 border-top bg-light">
                 <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Total Amount</span>
                    <span className="fw-bold h5 mb-0">₹{getCartTotal()}</span>
                 </div>
                 <button 
                   className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm d-flex justify-content-between px-4 align-items-center"
                   disabled={Object.keys(cart).length === 0}
                   onClick={placeOrder}
                 >
                   <span>Checkout</span>
                   <span className="bg-white text-primary rounded px-2 py-1 small fw-bold">₹{getCartTotal()}</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Floating Action Button for Cart if hidden */}
      {!showCart && getCartCount() > 0 && (
         <div className="position-fixed bottom-0 start-0 w-100 p-3" style={{ zIndex: 1040 }}>
            <button 
              className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-lg d-flex justify-content-between px-4 align-items-center pulse-animation"
              onClick={() => setShowCart(true)}
            >
              <div className="d-flex align-items-center gap-2">
                 <span className="bg-white text-primary rounded-circle w-6 h-6 d-flex justify-content-center align-items-center small fw-bold" style={{ width: '24px', height: '24px' }}>
                   {getCartCount()}
                 </span>
                 <span>View Cart</span>
              </div>
              <span>₹{getCartTotal()}</span>
            </button>
         </div>
      )}
    </div>
  );
};

export default MenuOrder;

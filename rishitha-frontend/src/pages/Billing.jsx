import { useState, useEffect } from 'react';
import { 
  DollarSign, CreditCard, Wallet, Clock, 
  Plus, Download, Printer, Filter, Eye, Edit, Trash2, Utensils
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import StatCard from '../components/UI/StatCard';
import './Billing.css';

const Billing = () => {
  const [fromDate, setFromDate] = useState('2023-10-10');
  const [toDate, setToDate] = useState('2023-10-15');
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'history'
  const [paymentMethod, setPaymentMethod] = useState('All Methods');
  const [billStatus, setBillStatus] = useState('All Status');
  const [showNewBillModal, setShowNewBillModal] = useState(false);
  
  const [billItems, setBillItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: '', price: '', quantity: 1 });
  const [tables, setTables] = useState([]);
  
  // View Orders Modal State
  const [showViewOrdersModal, setShowViewOrdersModal] = useState(false);
  const [selectedTableForView, setSelectedTableForView] = useState(null);

  // Form data for new bill
  const [billFormData, setBillFormData] = useState({
    customer: '',
    phone: '',
    tableType: 'Table 01',
    discount: 0,
    tax: 5, // Default 5%
    paymentMethod: 'Cash'
  });

  const [bills, setBills] = useState([]);
  const [rawOrders, setRawOrders] = useState([]); // Store raw orders for filtering active tables
  const [menuItems, setMenuItems] = useState([]);

  const [restaurantSettings, setRestaurantSettings] = useState(null);

  useEffect(() => {
    fetchBillingData();
    fetchRestaurantSettings();
  }, []);

  const fetchRestaurantSettings = async () => {
      try {
          const { default: api } = await import('../services/api');
          const response = await api.get('/settings');
          if (response.data.success) {
              setRestaurantSettings(response.data.data);
          }
      } catch (error) {
          console.error("Error fetching restaurant settings:", error);
      }
  };

  const fetchBillingData = async () => {
      try {
        const { default: api } = await import('../services/api');
        const [menuRes, ordersRes, tablesRes] = await Promise.all([
            api.get('/menu'),
            api.get('/orders'),
            api.get('/tables')
        ]);
        
        if (menuRes.data.success) {
            setMenuItems(menuRes.data.data);
        }
        
        if (tablesRes.data.success) {
            setTables(tablesRes.data.data);
        }

        if (ordersRes.data.success) {
             setRawOrders(ordersRes.data.data); // Store raw data
             const mappedBills = ordersRes.data.data.map(order => ({
                 billNo: `BILL-${String(order.id).padStart(3, '0')}`,
                 customer: order.customerName,
                 tableType: order.tableNumber ? `Table ${String(order.tableNumber).padStart(2, '0')}` : 'Takeaway',
                 dateTime: order.orderTime ? new Date(order.orderTime).toLocaleString() : new Date().toLocaleString(),
                 items: order.totalItemsCount || 0,
                 subtotal: order.totalAmount || 0,
                 tax: 0, 
                 discount: 0,
                 total: order.totalAmount || 0,
                 paymentMethod: 'Cash', 
                 paymentStatus: order.status === 'COMPLETED' ? 'Paid' : 'Pending' 
             }));
             setBills(mappedBills);
        }
      } catch (err) {
        console.error("Error fetching billing data", err);
      }
  };



  // Calculate totals
  const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = parseFloat(billFormData.tax) || 0;
  const tax = subtotal * (taxRate / 100); 
  const totalAmount = subtotal + tax - (parseFloat(billFormData.discount) || 0);

  // Calculate Dynamic Stats
  const calculateStats = () => {
    const today = new Date().toDateString();
    
    // Filter bills for today
    const todaysBills = bills.filter(bill => {
        const billDate = new Date(bill.dateTime).toDateString();
        return billDate === today;
    });

    const todaysCollection = todaysBills.reduce((acc, bill) => acc + (bill.total || 0), 0);
    
    // Payment Methods (Total - All Time)
    const cashTotal = bills.filter(b => b.paymentMethod === 'Cash').reduce((acc, b) => acc + (b.total || 0), 0);
    const cardTotal = bills.filter(b => b.paymentMethod === 'Card').reduce((acc, b) => acc + (b.total || 0), 0);
    const totalRevenue = cashTotal + cardTotal; // Simplified total for % calc

    // Pending Bills
    const pendingBills = bills.filter(b => b.paymentStatus === 'Pending');
    const pendingTotal = pendingBills.reduce((acc, b) => acc + (b.total || 0), 0);

    return {
        todaysCollection,
        cashTotal,
        cardTotal,
        cashPercentage: totalRevenue ? ((cashTotal / totalRevenue) * 100).toFixed(1) : 0,
        cardPercentage: totalRevenue ? ((cardTotal / totalRevenue) * 100).toFixed(1) : 0,
        pendingTotal,
        pendingCount: pendingBills.length
    };
  };

  const billStats = calculateStats();

  const stats = [
    {
      title: "Today's Collection",
      value: `₹${billStats.todaysCollection.toLocaleString()}`,
      icon: DollarSign,
      color: 'warning',
      change: '+₹0', // Placeholder as we don't store yesterday's data yet
      trend: 'up',
      subtitle: 'total revenue'
    },
    {
      title: 'Cash Payments',
      value: `₹${billStats.cashTotal.toLocaleString()}`,
      icon: Wallet,
      color: 'primary',
      change: `${billStats.cashPercentage}%`,
      trend: 'neutral',
      subtitle: 'of total'
    },
    {
      title: 'Card Payments',
      value: `₹${billStats.cardTotal.toLocaleString()}`,
      icon: CreditCard,
      color: 'success',
      change: `${billStats.cardPercentage}%`,
      trend: 'neutral',
      subtitle: 'of total'
    },
    {
      title: 'Pending Bills',
      value: `₹${billStats.pendingTotal.toLocaleString()}`,
      icon: Clock,
      color: 'info',
      change: `${billStats.pendingCount} bills`,
      trend: 'warning',
      subtitle: 'unpaid'
    },
  ];


  const paymentMethods = ['All Methods', 'Cash', 'Card', 'UPI', 'Online'];
  const statuses = ['All Status', 'Paid', 'Pending', 'Cancelled'];



  const filteredBills = bills.filter(bill => {
    const matchesPayment = paymentMethod === 'All Methods' || bill.paymentMethod === paymentMethod;
    const matchesStatus = billStatus === 'All Status' || bill.paymentStatus === billStatus;
    return matchesPayment && matchesStatus;
  });

  // Calculate active tables from raw orders
  const activeTables = rawOrders.reduce((acc, order) => {
      // Filter for active statuses
      if (['PENDING', 'PREPARING', 'READY'].includes(order.status)) {
          // Identify table (use 0 for takeaway if null)
          const tableNum = order.tableNumber || 'Takeaway';
          
          if (!acc[tableNum]) {
              acc[tableNum] = {
                  tableNumber: tableNum,
                  customerName: order.customerName || 'Guest',
                  waiterName: order.waiterName || 'App',
                  orderIds: [],
                  items: [],
                  totalAmount: 0,
                  startTime: order.orderTime,
                  status: order.status // Use status of first order found, or derived
              };
          }
          
          acc[tableNum].orderIds.push(order.id);
          acc[tableNum].totalAmount += (order.totalAmount || 0);
          
          // Aggregate items
          if (order.items) {
              order.items.forEach(item => {
                  acc[tableNum].items.push({
                      name: item.menuItem?.name || 'Item',
                      quantity: item.quantity,
                      price: item.priceAtOrder,
                      total: item.priceAtOrder * item.quantity
                  });
              });
          }
      }
      return acc;
  }, {});

  const activeTablesList = Object.values(activeTables);

  const handleGenerateBill = async (tableData) => {
      // 1. Calculate Financials
      const subtotal = tableData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const taxRate = 5; // 5% GST standard
      const taxAmount = subtotal * (taxRate / 100);
      const grandTotal = subtotal + taxAmount;

      // 2. Confirm
      if (!window.confirm(`Generate bill for Table ${tableData.tableNumber}? Total: ₹${grandTotal.toFixed(2)}`)) return;

      try {
          const { default: api } = await import('../services/api');
          
          // 3. Update status
          await Promise.all(tableData.orderIds.map(id => 
              api.put(`/orders/${id}/status?status=COMPLETED`)
          ));
          
          // 4. Generate PDF
          const pdfData = {
              billNo: `BILL-${Date.now().toString().slice(-6)}`,
              customer: tableData.customerName,
              tableType: tableData.tableNumber !== 'Takeaway' ? `Table ${tableData.tableNumber}` : 'Takeaway',
              itemsDetail: tableData.items,
              subtotal: subtotal,
              tax: taxAmount,
              taxRate: taxRate,
              discount: 0,
              total: grandTotal,
              paymentMethod: 'Cash' // Default
          };
          generateInvoicePDF(pdfData);
          
          // 5. Refresh
          alert('Payment Slip generated successfully!');
          fetchBillingData();

      } catch (err) {
          console.error("Error generating bill", err);
          alert("Failed to generate bill");
      }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Paid': return 'status-paid';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const handleNewBill = () => {
    setShowNewBillModal(true);
  };

  const handleCloseModal = () => {
    setShowNewBillModal(false);
    // Reset form
    setBillFormData({
      customer: '',
      phone: '',
      tableType: 'Table 01',
      discount: 0,
      paymentMethod: 'Cash',
      tax: 5
    });
    setBillItems([]);
    setCurrentItem({ name: '', price: '', quantity: 1, menuItemId: null });
  };

  const handleViewOrders = (table) => {
      setSelectedTableForView(table);
      setShowViewOrdersModal(true);
  };

  const handleCloseViewModal = () => {
      setShowViewOrdersModal(false);
      setSelectedTableForView(null);
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.price || !currentItem.quantity) return;
    
    const newItem = {
      id: Date.now(),
      menuItemId: currentItem.menuItemId,
      name: currentItem.name,
      price: parseFloat(currentItem.price),
      quantity: parseInt(currentItem.quantity),
      total: parseFloat(currentItem.price) * parseInt(currentItem.quantity)
    };

    setBillItems([...billItems, newItem]);
    setCurrentItem({ name: '', price: '', quantity: 1 });
  };

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
       // Auto-populate price
       const selectedItem = menuItems.find(item => item.name === value);
       setCurrentItem(prev => ({
         ...prev,
         name: value,
         price: selectedItem ? selectedItem.price : '',
         menuItemId: selectedItem ? selectedItem.id : null
       }));
    } else {
       setCurrentItem(prev => ({
         ...prev,
         [name]: value
       }));
    }
  };

  const handleSubmitBill = async (e) => {
    e.preventDefault();

    // Parse table number (e.g. "Table 01" -> 1)
    let tableNum = null;
    if (billFormData.tableType && billFormData.tableType.startsWith('Table')) {
        const numPart = billFormData.tableType.replace('Table ', '');
        tableNum = parseInt(numPart, 10);
    }
    
    const requestPayload = {
        customerName: billFormData.customer,
        tableNumber: tableNum,
        waiterName: 'Admin', // Default or from context
        items: billItems.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
        })),
        taxRate: parseFloat(billFormData.tax) || 0
    };

    try {
        const { default: api } = await import('../services/api');
        const response = await api.post('/orders', requestPayload);
        
        if (response.data.success) {
            alert('Bill created successfully!');
            
            // Generate PDF immediately
            const orderData = response.data.data;
            const pdfData = {
                billNo: `BILL-${String(orderData.id).padStart(3, '0')}`,
                customer: orderData.customerName,
                tableType: orderData.tableNumber ? `Table ${orderData.tableNumber}` : 'Takeaway',
                itemsDetail: billItems, // Use local state as response might not have details populated immediately in same format
                subtotal: subtotal,
                tax: tax,
                taxRate: taxRate,
                discount: parseFloat(billFormData.discount) || 0,
                total: totalAmount,
                paymentMethod: billFormData.paymentMethod
            };
            generateInvoicePDF(pdfData);

            fetchBillingData(); // Refresh list
            handleCloseModal();
        }
    } catch (error) {
        console.error('Error creating bill:', error);
        alert('Failed to create bill');
    }
  };
  
  const handleExport = () => {
    const doc = new jsPDF();
    
    // Use fetched settings or defaults
    const rName = restaurantSettings?.restaurantName || 'RISHITHA RESTAURANT';
    const rAddress = restaurantSettings?.address || 'Delicious City, 560001';
    const rPhone = restaurantSettings?.phoneNumber || '+91 98765 43210';
    const rEmail = restaurantSettings?.websiteUrl || 'contact@rishitharestaurant.com'; // Using website field as generic contact info if needed, or we could add email field

    // Restaurant Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(13, 110, 253); // Primary color
    doc.text(rName.toUpperCase(), 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`${rAddress} | ${rPhone}`, 105, 26, { align: 'center' });
    doc.text(rEmail, 105, 31, { align: 'center' });
    
    // Divider Line
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);

    // Report Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text('Invoices Summary Report', 14, 45);
    
    // Date Range & Metadata
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 52);
    doc.text(`Period: ${fromDate} to ${toDate}`, 14, 57);
    if (paymentMethod !== 'All Methods') doc.text(`Filter Mode: ${paymentMethod}`, 14, 62);

    // Table
    const tableColumn = ["Bill No", "Customer", "Table", "Date", "Items", "Total", "Method", "Status"];
    const tableRows = [];

    filteredBills.forEach(bill => {
      const billData = [
        bill.billNo,
        bill.customer,
        bill.tableType,
        bill.dateTime,
        bill.items,
        `Rs. ${bill.total.toFixed(2)}`,
        bill.paymentMethod,
        bill.paymentStatus
      ];
      tableRows.push(billData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 68,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { 
          fillColor: [13, 110, 253],
          textColor: 255,
          fontStyle: 'bold'
      },
      alternateRowStyles: {
          fillColor: [248, 249, 250]
      }
    });

    doc.save(`Rishitha_Invoices_${fromDate}_${toDate}.pdf`);
  };
  const handlePrint = () => {
    window.print();
  };
  const handleView = (billNo) => alert(`View Bill ${billNo} - Modal would open`);
  const handleEdit = (billNo) => alert(`Edit Bill ${billNo} - Modal would open`);
  
  const generateInvoicePDF = (billData) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297] // Thermal printer width
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    // Helper for centered text
    const centerText = (text, y, size = 10, font = 'normal') => {
        doc.setFontSize(size);
        doc.setFont(undefined, font);
        doc.text(text, centerX, y, { align: 'center' });
    };

    // Helper for left-right text
    const rowText = (label, value, y, size = 9, font = 'normal') => {
        doc.setFontSize(size);
        doc.setFont(undefined, font);
        doc.text(label, 5, y);
        doc.text(value, pageWidth - 5, y, { align: 'right' });
    };

    let cursorY = 10;

    // Header
    centerText("RISHITHA RESTAURANT", cursorY, 14, 'bold');
    cursorY += 6;
    centerText("Delicious City, 560001", cursorY, 8);
    cursorY += 5;
    centerText("+91 98765 43210", cursorY, 8);
    cursorY += 8;

    // Divider
    doc.setLineDash([1, 1]);
    doc.line(5, cursorY, pageWidth - 5, cursorY);
    cursorY += 5;

    // Title
    centerText("PAYMENT SLIP", cursorY, 12, 'bold');
    cursorY += 8;

    // Bill Meta
    rowText("Bill No:", billData.billNo, cursorY);
    cursorY += 5;
    rowText("Date:", new Date().toLocaleDateString(), cursorY);
    cursorY += 5;
    rowText("Time:", new Date().toLocaleTimeString(), cursorY);
    cursorY += 5;
    rowText("Table:", billData.tableType || 'N/A', cursorY);
    cursorY += 5;
    rowText("Customer:", billData.customer || 'Guest', cursorY);
    cursorY += 8;

    // Divider
    doc.line(5, cursorY, pageWidth - 5, cursorY);
    cursorY += 5;

    // Items Header
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("Item", 5, cursorY);
    doc.text("Qty", 50, cursorY, { align: 'right' }); // Adjusted for small width
    doc.text("Amt", pageWidth - 5, cursorY, { align: 'right' });
    cursorY += 5;

    // Items List
    doc.setFont(undefined, 'normal');
    if (Array.isArray(billData.itemsDetail)) {
        billData.itemsDetail.forEach(item => {
            // Item Name (Wrap if too long)
            const splitName = doc.splitTextToSize(item.name, 40);
            doc.text(splitName, 5, cursorY);
            
            // Quantity and Total aligned with first line of name
            doc.text(String(item.quantity), 50, cursorY, { align: 'right' });
            doc.text((item.price * item.quantity).toFixed(2), pageWidth - 5, cursorY, { align: 'right' });
            
            cursorY += (splitName.length * 5) + 2;
        });
    }
    
    // Divider
    cursorY += 2;
    doc.line(5, cursorY, pageWidth - 5, cursorY);
    cursorY += 6;

    // Totals
    rowText("Subtotal:", `₹${(billData.subtotal || 0).toFixed(2)}`, cursorY);
    cursorY += 5;
    
    // Tax Breakdown
    const taxVal = billData.tax || 0;
    const cgst = taxVal / 2;
    const sgst = taxVal / 2;

    rowText("CGST (2.5%):", `₹${cgst.toFixed(2)}`, cursorY);
    cursorY += 5;
    rowText("SGST (2.5%):", `₹${sgst.toFixed(2)}`, cursorY);
    cursorY += 5;

    if (billData.discount > 0) {
        rowText("Discount:", `-₹${(billData.discount || 0).toFixed(2)}`, cursorY);
        cursorY += 5;
    }

    // Grand Total
    cursorY += 2;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text("TOTAL:", 5, cursorY);
    doc.text(`₹${(billData.total || 0).toFixed(2)}`, pageWidth - 5, cursorY, { align: 'right' });
    cursorY += 10;

    // Footer Message
    centerText("Thank you for dining with us!", cursorY, 9, 'italic');
    cursorY += 5;
    centerText("Visit Again!", cursorY, 9, 'italic');

    doc.save(`${billData.billNo}.pdf`);
  };


  const handleDelete = (billNo) => {
    if (window.confirm(`Delete bill ${billNo}?`)) {
      setBills(prev => prev.filter(bill => bill.billNo !== billNo));
    }
  };

  return (
    <div className="container-fluid py-3 billing-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Top Stats Row */}
      <div className="row g-3 mb-3 flex-shrink-0 px-2">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 border-0 shadow-sm glass-card stat-card-modern">
              <div className="card-body p-3 d-flex align-items-center">
                <div className={`stat-icon bg-${stat.color}-soft text-${stat.color} me-3`}>
                  <stat.icon size={22} />
                </div>
                <div className="flex-grow-1">
                  <div className="text-muted small fw-semibold text-uppercase ls-1">{stat.title}</div>
                  <div className="h4 mb-0 fw-bold">{stat.value}</div>
                  <div className="d-flex align-items-center gap-1 mt-1">
                    <span className={`badge bg-${stat.trend === 'up' ? 'success' : stat.trend === 'warning' ? 'warning' : 'info'}-subtle text-${stat.trend === 'up' ? 'success' : stat.trend === 'warning' ? 'warning' : 'info'} border-0 px-2`}>
                      {stat.change}
                    </span>
                    <span className="text-muted tiny-text">{stat.subtitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Actions Bar */}
      <div className="card border-0 shadow-sm mb-3 flex-shrink-0 bg-white mx-2 rounded-3">
        <div className="card-body p-2 p-lg-3">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-sm-6 col-md-2">
              <label className="tiny-text fw-bold text-muted mb-1 text-uppercase">From Date</label>
              <input type="date" className="form-control form-control-sm border-light shadow-none" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <label className="tiny-text fw-bold text-muted mb-1 text-uppercase">To Date</label>
              <input type="date" className="form-control form-control-sm border-light shadow-none" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <label className="tiny-text fw-bold text-muted mb-1 text-uppercase">Method</label>
              <select className="form-select form-select-sm border-light shadow-none" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="tiny-text fw-bold text-muted mb-1 text-uppercase">Status</label>
              <select className="form-select form-select-sm border-light shadow-none" value={billStatus} onChange={(e) => setBillStatus(e.target.value)}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4 d-flex gap-2 justify-content-md-end mt-2 mt-md-0">
              <button className="btn btn-danger-custom btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2" onClick={handleNewBill}>
                <Plus size={16} /> New Bill
              </button>
              <button className="btn btn-outline-info btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2" onClick={handleExport}>
                <Download size={16} /> Export
              </button>
              <button className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2" onClick={handlePrint}>
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </div>
      </div>

       {/* View Toggle Tabs */}
       <div className="d-flex gap-2 mb-3 px-2">
          <button 
              className={`btn ${viewMode === 'active' ? 'btn-dark' : 'btn-light text-muted'} rounded-pill px-4 fw-bold`}
              onClick={() => setViewMode('active')}
          >
              Active Dining
          </button>
          <button 
              className={`btn ${viewMode === 'history' ? 'btn-dark' : 'btn-light text-muted'} rounded-pill px-4 fw-bold`}
              onClick={() => setViewMode('history')}
          >
              Recent Invoices
          </button>
       </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow-1 overflow-auto px-2 custom-thin-scrollbar">
        {viewMode === 'active' ? (
             <div className="row g-3">
                 {activeTablesList.length === 0 ? (
                     <div className="col-12 text-center py-5 text-muted">
                         <div className="mb-3 bg-light rounded-circle d-inline-flex p-4">
                             <Utensils size={40} className="text-secondary opacity-50"/>
                         </div>
                         <h5>No Active Tables</h5>
                         <p className="small">All tables are clear. New orders will appear here.</p>
                     </div>
                 ) : (
                     activeTablesList.map(table => (
                         <div key={table.tableNumber} className="col-12 col-md-6 col-lg-4 col-xl-3">
                             <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden position-relative">
                                 <div className="card-body p-4 d-flex flex-column">
                                     <div className="d-flex justify-content-between align-items-start mb-3">
                                         <div>
                                             <h5 className="fw-bold mb-0">Table {table.tableNumber}</h5>
                                             <span className="text-muted small">{table.customerName}</span>
                                         </div>
                                         <span className="badge bg-success-subtle text-success px-2 py-1 rounded-pill small">Active</span>
                                     </div>
                                     
                                     <div className="flex-grow-1">
                                         <div className="d-flex justify-content-between mb-2 small text-muted">
                                             <span>Orders</span>
                                             <span className="fw-bold text-dark">{table.orderIds.length}</span>
                                         </div>
                                         <div className="d-flex justify-content-between mb-3 small text-muted">
                                             <span>Items</span>
                                             <span className="fw-bold text-dark">{table.items.length}</span>
                                         </div>
                                         <div className="p-3 bg-light rounded-3 mb-3">
                                             <div className="d-flex justify-content-between align-items-center">
                                                 <span className="fw-bold text-muted small text-uppercase">Total Amount</span>
                                                 <span className="h4 mb-0 fw-bold text-primary">₹{table.totalAmount.toFixed(2)}</span>
                                             </div>
                                         </div>
                                     </div>



                                     <button 
                                         className="btn btn-outline-dark w-100 rounded-pill py-2 fw-bold shadow-sm mb-2"
                                         onClick={() => handleViewOrders(table)}
                                     >
                                         <Eye size={16} className="me-2"/> View Orders
                                     </button>

                                     <button 
                                         className="btn btn-dark w-100 rounded-pill py-2 fw-bold shadow-sm"
                                         onClick={() => handleGenerateBill(table)}
                                     >
                                         Generate Bill
                                     </button>
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </div>
        ) : (
        <div className="row g-3 h-100">
          {/* Table Column */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-3 d-flex flex-column h-100 mb-3 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary-soft p-2 rounded text-primary">
                    <DollarSign size={20} />
                  </div>
                  <h5 className="mb-0 fw-bold">Recent Invoices</h5>
                </div>
                <span className="badge bg-light text-dark fw-medium border">
                  Showing {filteredBills.length} entries
                </span>
              </div>
              
              <div className="table-responsive flex-grow-1 custom-thin-scrollbar">
                <table className="table table-hover align-middle mb-0 billing-table-modern">
                  <thead className="table-light sticky-top z-1 text-center">
                    <tr>
                      <th className="ps-4 py-3 text-start">Bill No</th>
                      <th className="py-3 text-start">Customer</th>
                      <th className="py-3">Table/Type</th>
                      <th className="py-3">Date & Time</th>
                      <th className="py-3">Items</th>
                      <th className="py-3 text-end">Subtotal</th>
                      <th className="py-3 text-end">Tax</th>
                      <th className="py-3 text-end">Discount</th>
                      <th className="py-3 text-end">Total</th>
                      <th className="py-3 text-center">Method</th>
                      <th className="py-3 text-center">Status</th>
                      <th className="pe-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredBills.map((bill) => (
                      <tr key={bill.billNo}>
                        <td className="ps-4 text-start">
                          <span className="badge bg-light text-dark fw-bold border p-2">#{bill.billNo}</span>
                        </td>
                        <td className="fw-semibold text-start text-nowrap">{bill.customer}</td>
                        <td className="text-nowrap"><span className="badge bg-secondary-subtle text-secondary-emphasis px-3">{bill.tableType}</span></td>
                        <td className="small text-muted text-nowrap">{bill.dateTime}</td>
                        <td className="text-center fw-medium">{bill.items} items</td>
                        <td className="text-end text-nowrap">₹{bill.subtotal.toFixed(2)}</td>
                        <td className="text-end text-nowrap">₹{bill.tax.toFixed(2)}</td>
                        <td className="text-end text-nowrap text-danger">-₹{bill.discount.toFixed(2)}</td>
                        <td className="text-end text-nowrap fw-bold text-success">₹{bill.total.toFixed(2)}</td>
                        <td className="text-center">
                          <span className="badge bg-info-subtle text-info fw-semibold border border-info-subtle px-3 py-2">{bill.paymentMethod}</span>
                        </td>
                        <td className="text-center">
                          <span className={`status-pill ${bill.paymentStatus === 'Paid' ? 'status-success' : 'status-warning'}`}>
                            {bill.paymentStatus}
                          </span>
                        </td>
                        <td className="pe-4">
                          <div className="d-flex gap-1 justify-content-end">
                            <button className="btn btn-action-square text-info" onClick={() => handleView(bill.billNo)} title="View"><Eye size={14} /></button>
                            <button className="btn btn-action-square text-primary" onClick={() => handleEdit(bill.billNo)} title="Edit"><Edit size={14} /></button>
                            <button className="btn btn-action-square text-danger" onClick={() => handleDelete(bill.billNo)} title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Analytics Row */}
          <div className="col-12 mb-3">
            <div className="row g-3">
              <div className="col-12 col-xl-7">
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-header bg-white border-bottom py-3">
                    <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                      <CreditCard size={18} className="text-primary" />
                      Payment Method Distribution
                    </h6>
                  </div>
                  <div className="card-body p-3">
                    <div className="row g-2">
                      {['Cash', 'Card', 'UPI'].map((method, idx) => (
                        <div key={idx} className="col-12">
                          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 hover-lift border border-transparent hover-border-primary">
                            <div className="d-flex align-items-center gap-3">
                              <div className={`p-2 rounded bg-${idx === 0 ? 'danger' : idx === 1 ? 'success' : 'info'}-soft text-${idx === 0 ? 'danger' : idx === 1 ? 'success' : 'info'}`}>
                                {idx === 0 ? <Wallet size={20} /> : idx === 1 ? <CreditCard size={20} /> : <DollarSign size={20} />}
                              </div>
                              <div>
                                <div className="fw-bold small">{method}</div>
                                <div className="text-muted tiny-text ">{idx === 0 ? '45' : idx === 1 ? '52' : '28'} transactions</div>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold">₹{idx === 0 ? '3,250' : idx === 1 ? '4,120' : '1,050'}</div>
                              <span className="badge bg-white text-dark border tiny-text">{idx === 0 ? '38.6%' : idx === 1 ? '48.9%' : '12.5%'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="col-12 mt-2">
                         <div className="p-3 bg-danger text-white rounded-3 d-flex justify-content-between align-items-center shadow-sm">
                            <span className="fw-bold">Total Collection</span>
                            <span className="h4 mb-0 fw-bold">₹8,420.00</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-5">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-header bg-white border-bottom py-3">
                    <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                      <Printer size={18} className="text-warning" />
                      Tax & Service Summary
                    </h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush small">
                      <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2">
                        <span className="text-muted">CGST (9%)</span>
                        <span className="fw-bold">$756.80</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2">
                        <span className="text-muted">SGST (9%)</span>
                        <span className="fw-bold">$756.80</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2">
                        <span className="text-muted">Service Charge (5%)</span>
                        <span className="fw-bold">₹420.00</span>
                      </li>
                      <li className="list-group-item mt-3 pt-3 border-top border-2 d-flex justify-content-between px-0">
                        <span className="h6 fw-bold mb-0">Total Tax & Charges</span>
                        <span className="h5 fw-bold text-info mb-0">₹1,933.60</span>
                      </li>
                    </ul>
                    <div className="alert alert-info border-0 mt-3 tiny-text mb-0">
                      <Clock size={14} className="me-1" />
                      Calculated automatically based on active rates.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* New Bill Modal */}
      {showNewBillModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={24} />
                  Create New Bill
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitBill}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Customer Info */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Customer Name *</label>
                      <input type="text" className="form-control rounded-pill px-3" name="customer" value={billFormData.customer || ''} onChange={handleInputChange} placeholder="John Doe" required />
                    </div>
                   
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Table/Type *</label>
                      <select className="form-select rounded-pill px-3" name="tableType" value={billFormData.tableType} onChange={handleInputChange} required>
                         <option value="">Select Table</option>
                         {tables.map(table => (
                          <option key={table.id} value={`Table ${String(table.tableNo).padStart(2, '0')}`}>Table {String(table.tableNo).padStart(2, '0')}</option>
                         ))}
                        <option value="Takeaway">Takeaway</option>
                        <option value="Delivery">Delivery</option>
                      </select>
                    </div>

                    {/* Add Items Section */}
                    <div className="col-12">
                      <div className="card bg-light border-0 rounded-3">
                        <div className="card-body p-3">
                          <h6 className="fw-bold text-muted mb-3 small text-uppercase">Add Items</h6>
                          <div className="row g-2 align-items-end">
                            <div className="col-md-7">
                              <select className="form-select" name="name" value={currentItem.name} onChange={handleItemInputChange}>
                                 <option value="">Select Item...</option>
                                 {menuItems.map(item => (
                                   <option key={item.id} value={item.name}>{item.name} (₹{item.price})</option>
                                 ))}
                              </select>
                            </div>
                            <div className="col-md-3">
                              <input type="number" className="form-control" name="quantity" value={currentItem.quantity} onChange={handleItemInputChange} placeholder="Qty" min="1" />
                            </div>
                            <div className="col-md-2">
                              <button type="button" className="btn btn-primary w-100" onClick={handleAddItem} disabled={!currentItem.name}>Add</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="col-12">
                      <div className="table-responsive border rounded-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="table table-sm table-nowrap mb-0 align-middle">
                          <thead className="table-light sticky-top">
                            <tr>
                              <th className="ps-3">Item</th>
                              <th className="text-end">Price</th>
                              <th className="text-center">Qty</th>
                              <th className="text-end">Total</th>
                              <th className="text-end pe-3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billItems.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center text-muted py-4 small">No items added yet</td>
                              </tr>
                            ) : (
                              billItems.map(item => (
                                <tr key={item.id}>
                                  <td className="ps-3 fw-medium">{item.name}</td>
                                  <td className="text-end">₹{item.price.toFixed(2)}</td>
                                  <td className="text-center">{item.quantity}</td>
                                  <td className="text-end fw-bold">₹{item.total.toFixed(2)}</td>
                                  <td className="text-end pe-3">
                                    <button type="button" className="btn btn-link text-danger p-0 border-0" onClick={() => handleRemoveItem(item.id)}>
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Footer Totals */}
                    <div className="col-md-7">
                        <div className="row g-3">
                            <div className="col-6">
                              <label className="form-label fw-bold small text-muted text-uppercase">Tax Rate (%)</label>
                              <input type="number" step="0.1" className="form-control rounded-pill px-3" name="tax" value={billFormData.tax} onChange={handleInputChange} />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold small text-muted text-uppercase">Payment Method</label>
                              <select className="form-select rounded-pill px-3" name="paymentMethod" value={billFormData.paymentMethod} onChange={handleInputChange}>
                                <option>Cash</option><option>Card</option><option>UPI</option><option>Online</option>
                              </select>
                            </div>

                        </div>
                    </div>
                    
                    <div className="col-md-5">
                        <div className="card border-0 bg-primary-soft h-100">
                            <div className="card-body p-3 d-flex flex-column justify-content-center">
                                <div className="d-flex justify-content-between mb-2 small">
                                    <span className="text-muted">Subtotal:</span>
                                    <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 small">
                                    <span className="text-muted">Tax ({billFormData.tax}%):</span>
                                    <span className="fw-bold">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-top border-secondary border-opacity-25 pt-2 d-flex justify-content-between align-items-center">
                                    <span className="h6 mb-0 fw-bold">Total:</span>
                                    <span className="h3 mb-0 fw-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                    <Plus size={18} />
                    Create Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      
      {/* View Orders Modal */}
      {showViewOrdersModal && selectedTableForView && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseViewModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg alert-modal-content">
              <div className="modal-header bg-dark text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Eye size={24} />
                  Table {selectedTableForView.tableNumber} - Orders
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseViewModal}></button>
              </div>
              <div className="modal-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                          <h6 className="fw-bold mb-0">{selectedTableForView.customerName}</h6>
                          <div className="text-muted small">Started: {new Date(selectedTableForView.startTime).toLocaleTimeString()}</div>
                      </div>
                      <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">Active Dining</span>
                  </div>

                  <div className="table-responsive rounded-3 border mb-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-3 py-2">Item</th>
                                <th className="text-end py-2">Price</th>
                                <th className="text-center py-2">Qty</th>
                                <th className="text-end pe-3 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTableForView.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="ps-3 fw-medium">{item.name}</td>
                                    <td className="text-end">₹{item.price.toFixed(2)}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end pe-3 fw-bold">₹{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-end align-items-center bg-light p-3 rounded-3">
                      <div className="text-end">
                          <div className="text-muted small text-uppercase fw-bold">Total Amount</div>
                          <div className="h3 mb-0 fw-bold text-primary">₹{selectedTableForView.totalAmount.toFixed(2)}</div>
                      </div>
                  </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseViewModal}>Close</button>
                  <button 
                      type="button" 
                      className="btn btn-dark rounded-pill px-4 fw-bold" 
                      onClick={() => {
                          handleCloseViewModal();
                          handleGenerateBill(selectedTableForView);
                      }}
                  >
                      Generate Bill Now
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;

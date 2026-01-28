import { useState, useEffect } from 'react';
import { 
  DollarSign, CreditCard, Wallet, Clock, 
  Plus, Download, Printer, Filter, Eye, Edit, Trash2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import StatCard from '../components/UI/StatCard';
import './Billing.css';

const Billing = () => {
  const [fromDate, setFromDate] = useState('2023-10-10');
  const [toDate, setToDate] = useState('2023-10-15');
  const [paymentMethod, setPaymentMethod] = useState('All Methods');
  const [billStatus, setBillStatus] = useState('All Status');
  const [showNewBillModal, setShowNewBillModal] = useState(false);
  
  const [billItems, setBillItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: '', price: '', quantity: 1 });
  const [tables, setTables] = useState([]);

  // Form data for new bill
  const [billFormData, setBillFormData] = useState({
    customer: '',
    phone: '',
    tableType: 'Table 01',
    discount: 0,
    tax: 5, // Default 5%
    paymentMethod: 'Cash'
  });

  // Calculate totals
  const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = parseFloat(billFormData.tax) || 0;
  const tax = subtotal * (taxRate / 100); 
  const totalAmount = subtotal + tax - (parseFloat(billFormData.discount) || 0);

  const stats = [
    {
      title: "Today's Collection",
      value: '$8,420',
      icon: DollarSign,
      color: 'warning',
      change: '+$1,240',
      trend: 'up',
      subtitle: 'total revenue'
    },
    {
      title: 'Cash Payments',
      value: '$3,250',
      icon: Wallet,
      color: 'primary',
      change: '38.6%',
      trend: 'neutral',
      subtitle: 'of total'
    },
    {
      title: 'Card Payments',
      value: '$4,120',
      icon: CreditCard,
      color: 'success',
      change: '48.9%',
      trend: 'neutral',
      subtitle: 'of total'
    },
    {
      title: 'Pending Bills',
      value: '$1,045',
      icon: Clock,
      color: 'info',
      change: '12 bills',
      trend: 'warning',
      subtitle: 'unpaid'
    },
  ];

  const [bills, setBills] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
      try {
        const { default: api } = await import('../api/axiosConfig');
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

  const paymentMethods = ['All Methods', 'Cash', 'Card', 'UPI', 'Online'];
  const statuses = ['All Status', 'Paid', 'Pending', 'Cancelled'];



  const filteredBills = bills.filter(bill => {
    const matchesPayment = paymentMethod === 'All Methods' || bill.paymentMethod === paymentMethod;
    const matchesStatus = billStatus === 'All Status' || bill.paymentStatus === billStatus;
    return matchesPayment && matchesStatus;
  });

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
        const { default: api } = await import('../api/axiosConfig');
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
  
  const handleExport = () => alert('Export Bills - Would download CSV/PDF');
  const handlePrint = () => alert('Print Bills - Would open print dialog');
  const handleView = (billNo) => alert(`View Bill ${billNo} - Modal would open`);
  const handleEdit = (billNo) => alert(`Edit Bill ${billNo} - Modal would open`);
  const generateInvoicePDF = (billData) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(220, 53, 69); // Danger color default
    doc.text("RISHITHA RESTAURANT", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("123 Food Street, Delicious City, 560001", 105, 28, null, null, "center");
    doc.text("Phone: +91 98765 43210 | Email: contact@rishitha.com", 105, 34, null, null, "center");
    
    doc.setDrawColor(200);
    doc.line(10, 38, 200, 38);

    // Bill Details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("INVOICE", 15, 50);

    doc.setFontSize(10);
    doc.text(`Bill No: ${billData.billNo || 'N/A'}`, 15, 60);
    doc.text(`Date: ${new Date().toLocaleString()}`, 15, 66);
    
    doc.text(`Customer: ${billData.customer || 'Guest'}`, 130, 60);
    doc.text(`Table: ${billData.tableType || 'N/A'}`, 130, 66);
    doc.text(`Payment: ${billData.paymentMethod || 'Cash'}`, 130, 72);

    // Table
    const tableColumn = ["Item", "Price", "Qty", "Total"];
    const tableRows = [];

    // Check if items are from billData.items (array of objects) or number (from list view)
    // If generating from list view without items detail, we can't show full list
    // Ideally we should fetch full order details. For now, we support the new bill creation flow mostly.
    
    if (Array.isArray(billData.itemsDetail)) {
        billData.itemsDetail.forEach(item => {
            const itemData = [
                item.name,
                `$${parseFloat(item.price).toFixed(2)}`,
                item.quantity,
                `$${parseFloat(item.total).toFixed(2)}`
            ];
            tableRows.push(itemData);
        });
    }

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [220, 53, 69] },
    });

    // Output Final Y
    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals
    doc.setFontSize(10);
    doc.text(`Subtotal:`, 140, finalY);
    doc.text(`$${(billData.subtotal || 0).toFixed(2)}`, 190, finalY, null, null, "right");

    if (billData.taxRate > 0) {
        doc.text(`Tax (${billData.taxRate}%):`, 140, finalY + 6);
        doc.text(`$${(billData.tax || 0).toFixed(2)}`, 190, finalY + 6, null, null, "right");
    }

    if (billData.discount > 0) {
        doc.text(`Discount:`, 140, finalY + 12);
        doc.text(`-$${(billData.discount || 0).toFixed(2)}`, 190, finalY + 12, null, null, "right");
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total:`, 140, finalY + 20);
    doc.setTextColor(220, 53, 69);
    doc.text(`$${(billData.total || 0).toFixed(2)}`, 190, finalY + 20, null, null, "right");

    // Footer
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text("Thank you for dining with us!", 105, 280, null, null, "center");

    doc.save(`Invoice_${billData.billNo || Date.now()}.pdf`);
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

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow-1 overflow-auto px-2 custom-thin-scrollbar">
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
                        <td className="text-end text-nowrap">${bill.subtotal.toFixed(2)}</td>
                        <td className="text-end text-nowrap">${bill.tax.toFixed(2)}</td>
                        <td className="text-end text-nowrap text-danger">-${bill.discount.toFixed(2)}</td>
                        <td className="text-end text-nowrap fw-bold text-success">${bill.total.toFixed(2)}</td>
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
                              <div className="fw-bold">${idx === 0 ? '3,250' : idx === 1 ? '4,120' : '1,050'}</div>
                              <span className="badge bg-white text-dark border tiny-text">{idx === 0 ? '38.6%' : idx === 1 ? '48.9%' : '12.5%'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="col-12 mt-2">
                         <div className="p-3 bg-danger text-white rounded-3 d-flex justify-content-between align-items-center shadow-sm">
                            <span className="fw-bold">Total Collection</span>
                            <span className="h4 mb-0 fw-bold">$8,420.00</span>
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
                        <span className="fw-bold">$420.00</span>
                      </li>
                      <li className="list-group-item mt-3 pt-3 border-top border-2 d-flex justify-content-between px-0">
                        <span className="h6 fw-bold mb-0">Total Tax & Charges</span>
                        <span className="h5 fw-bold text-info mb-0">$1,933.60</span>
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
                                   <option key={item.id} value={item.name}>{item.name} (${item.price})</option>
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
                                  <td className="text-end">${item.price.toFixed(2)}</td>
                                  <td className="text-center">{item.quantity}</td>
                                  <td className="text-end fw-bold">${item.total.toFixed(2)}</td>
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
                                    <span className="fw-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 small">
                                    <span className="text-muted">Tax ({billFormData.tax}%):</span>
                                    <span className="fw-bold">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-top border-secondary border-opacity-25 pt-2 d-flex justify-content-between align-items-center">
                                    <span className="h6 mb-0 fw-bold">Total:</span>
                                    <span className="h3 mb-0 fw-bold text-primary">${totalAmount.toFixed(2)}</span>
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
    </div>
  );
};

export default Billing;

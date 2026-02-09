const [bills, setBills] = useState([]);
const [rawOrders, setRawOrders] = useState([]); // Store raw orders for filtering active tables
const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
    fetchBillingData();
}, []);

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

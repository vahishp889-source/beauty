'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/useStore';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { 
  FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiBarChart2, 
  FiTrendingUp, FiDollarSign, FiShoppingBag, FiUser, FiPlus, FiSearch,
  FiEdit2, FiTrash2, FiEye, FiMoreVertical, FiLogOut, FiChevronDown, FiX, FiRefreshCw
} from 'react-icons/fi';

import { formatINR } from '../utils/price';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'orders', label: 'Orders', icon: FiShoppingCart },
  { id: 'users', label: 'Users', icon: FiUsers },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sidebarOpen, toggleSidebar } = useAdminStore();

  // Expose refreshOrders for child components
  const refreshOrdersRef = { current: null };

  useEffect(() => {
    if (activeSection === 'orders' || activeSection === 'dashboard') {
      fetchOrders();
    }
  }, [activeSection]);

  const triggerRefresh = () => {
    fetchOrders();
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Use mock data for demo
      setOrders([
        { _id: '1', user: { name: 'Sarah Johnson', email: 'sarah@example.com' }, total: 185.99, status: 'delivered', createdAt: '2024-01-15', items: [{ name: 'Matte Lipstick Collection', quantity: 3, price: 54 }] },
        { _id: '2', user: { name: 'Emma Wilson', email: 'emma@example.com' }, total: 54.00, status: 'shipped', createdAt: '2024-01-14', items: [{ name: 'Naked3 Palette', quantity: 1, price: 54 }] },
        { _id: '3', user: { name: 'Olivia Brown', email: 'olivia@example.com' }, total: 342.50, status: 'processing', createdAt: '2024-01-14', items: [{ name: 'Foundation', quantity: 5, price: 68.5 }] },
        { _id: '4', user: { name: 'Ava Davis', email: 'ava@example.com' }, total: 89.99, status: 'pending', createdAt: '2024-01-13', items: [{ name: 'Lipstick', quantity: 2, price: 45 }] },
      ]);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success('Order status updated!');
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      // Update local state for demo
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated!');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-primary-light border-r border-white/10"
      >
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <h1 className="text-2xl font-display font-bold text-white">BEAUTY</h1>
          <span className="ml-2 px-2 py-0.5 text-xs bg-accent text-white rounded">ADMIN</span>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`admin-sidebar-item w-full ${activeSection === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button className="admin-sidebar-item w-full text-red-400 hover:text-red-300">
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <header className="h-20 bg-primary-light/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-white/40 hover:text-white">
            <FiMoreVertical size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-primary-light border border-white/10 rounded-full text-white text-sm w-64" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-medium">AD</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeSection === 'dashboard' && <DashboardView orders={orders} />}
          {activeSection === 'products' && <ProductsView />}
          {activeSection === 'orders' && (
            <OrdersView orders={orders} loading={loading} onUpdateStatus={updateOrderStatus} />
          )}
          {activeSection === 'users' && <UsersView />}
        </main>
      </div>
    </div>
  );
}

function DashboardView({ orders }) {
  const stats = [
    { label: 'Total Sales', value: '$124,500', change: '+12.5%', icon: FiDollarSign, color: 'text-green-500' },
    { label: 'Total Orders', value: orders.length.toString(), change: '+8.2%', icon: FiShoppingBag, color: 'text-blue-500' },
    { label: 'Total Users', value: '5,678', change: '+15.3%', icon: FiUser, color: 'text-purple-500' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: FiTrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-current/10`}><stat.icon size={24} /></div>
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold text-white">Recent Orders</h2>
          <Button variant="ghost" size="sm" onClick={() => {}}>View All</Button>
        </div>

        {orders.slice(0, 5).map((order) => (
          <div key={order._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div>
              <p className="text-white font-medium">ORD-{order._id.slice(-6)}</p>
              <p className="text-white/40 text-sm">{order.user?.name || 'Guest'}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">${order.total?.toFixed(2)}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersView({ orders, loading, onUpdateStatus }) {
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onUpdateStatus && onUpdateStatus('refresh', 'refresh');
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-white">Orders</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className={`px-4 py-2 rounded-full text-sm bg-primary-light text-white/60 hover:text-white transition-colors flex items-center gap-2 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm capitalize ${
                filter === status ? 'bg-accent text-white' : 'bg-primary-light text-white/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/60">Loading orders...</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Items</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">ORD-{order._id?.slice(-6)}</td>
                  <td className="px-6 py-4">
                    <p className="text-white">{order.user?.name || 'Guest'}</p>
                    <p className="text-white/40 text-sm">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-white/60">{order.items?.length || 1} items</td>
                  <td className="px-6 py-4 text-accent font-medium">${order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                      className={`px-3 py-1 text-xs rounded-full cursor-pointer ${getStatusBg(order.status)} ${getStatusText(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-white/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-white/40 hover:text-blue-400 transition-colors"><FiEye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-white">Products</h1>
        <Button icon={FiPlus}>Add Product</Button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Product</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Brand</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Category</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '1', name: 'Matte Lipstick Collection', brand: 'MAC', price: 54, stock: 150, category: 'makeup' },
              { id: '2', name: "Pro Filt'r Soft Matte Foundation", brand: 'FENTY BEAUTY', price: 39, stock: 80, category: 'makeup' },
              { id: '3', name: 'Dior Sauvage Elixir', brand: 'DIOR', price: 185, stock: 45, category: 'fragrance' },
              { id: '4', name: 'Soft Matte Complete Foundation', brand: 'NARS', price: 49, stock: 120, category: 'makeup' },
            ].map((product) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                <td className="px-6 py-4 text-white/60">{product.brand}</td>
                <td className="px-6 py-4 text-accent font-medium">${product.price}</td>
                <td className="px-6 py-4 text-white/60">{product.stock}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent capitalize">{product.category}</span></td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="p-2 text-white/40 hover:text-blue-400"><FiEye size={18} /></button>
                  <button className="p-2 text-white/40 hover:text-accent"><FiEdit2 size={18} /></button>
                  <button className="p-2 text-white/40 hover:text-red-400"><FiTrash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-white">Users</h1>
      <div className="glass-card p-6">
        <p className="text-white/60">User management coming soon...</p>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    delivered: 'bg-green-500/20 text-green-500',
    shipped: 'bg-blue-500/20 text-blue-500',
    processing: 'bg-yellow-500/20 text-yellow-500',
    confirmed: 'bg-purple-500/20 text-purple-500',
    pending: 'bg-gray-500/20 text-gray-500',
    cancelled: 'bg-red-500/20 text-red-500',
  };
  return colors[status] || colors.pending;
}

function getStatusBg(status) {
  const colors = { 
    delivered: 'bg-green-500/20', 
    shipped: 'bg-blue-500/20', 
    processing: 'bg-yellow-500/20',
    confirmed: 'bg-purple-500/20',
    pending: 'bg-gray-500/20', 
    cancelled: 'bg-red-500/20' 
  };
  return colors[status] || colors.pending;
}

function getStatusText(status) {
  const colors = { 
    delivered: 'text-green-500', 
    shipped: 'text-blue-500', 
    processing: 'text-yellow-500',
    confirmed: 'text-purple-500',
    pending: 'text-gray-400', 
    cancelled: 'text-red-500' 
  };
  return colors[status] || colors.pending;
}

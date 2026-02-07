'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Button from '../components/ui/Button';
import { FiUser, FiHeart, FiShoppingBag, FiSettings, FiLogOut, FiEdit2, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { formatINR } from '../utils/price';

const mockWishlist = [
  { id: '1', name: 'Matte Lipstick Collection', brand: 'MAC', price: 54, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300' },
  { id: '2', name: 'Dior Sauvage Elixir', brand: 'DIOR', price: 185, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300' },
];

const statusConfig = {
  pending: { color: 'bg-gray-500/20 text-gray-400', icon: FiClock, label: 'Pending' },
  confirmed: { color: 'bg-purple-500/20 text-purple-400', icon: FiCheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-yellow-500/20 text-yellow-400', icon: FiPackage, label: 'Processing' },
  shipped: { color: 'bg-blue-500/20 text-blue-400', icon: FiTruck, label: 'Shipped' },
  delivered: { color: 'bg-green-500/20 text-green-400', icon: FiCheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-500/20 text-red-400', icon: FiXCircle, label: 'Cancelled' },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(mockWishlist);

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'account', label: 'Account Settings', icon: FiUser },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Demo mode - use mock data
      setUser({ name: 'Guest User', email: 'guest@example.com' });
      setOrders([
        { _id: '1', createdAt: '2024-01-15', status: 'delivered', pricingINR: { total: 18599 }, items: [{ name: 'Matte Lipstick Collection' }] },
        { _id: '2', createdAt: '2024-01-10', status: 'shipped', pricingINR: { total: 4500 }, items: [{ name: 'Foundation' }] },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile
      const userRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // Fetch user orders
      const ordersRes = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Demo mode
      setUser({ name: 'Sarah Johnson', email: 'sarah@example.com' });
      setOrders([
        { _id: 'ORD-001', createdAt: new Date().toISOString(), status: 'delivered', pricingINR: { total: 18599 }, items: [{ name: 'Matte Lipstick Collection' }] },
        { _id: 'ORD-002', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'shipped', pricingINR: { total: 4500 }, items: [{ name: 'Foundation' }] },
      ]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${config.color}`}>
        <config.icon size={14} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-rose-gradient flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'G'}
                </span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-display font-bold text-white mb-2">{user?.name || 'Guest User'}</h1>
                <p className="text-white/60 mb-4">{user?.email || 'guest@example.com'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="px-4 py-1 rounded-full bg-accent/20 text-accent text-sm">
                    {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                  </span>
                  <span className="px-4 py-1 rounded-full bg-white/10 text-white/60 text-sm">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}
                  </span>
                </div>
              </div>
              <div className="md:ml-auto flex gap-3">
                <Button variant="outline" icon={FiEdit2}>Edit Profile</Button>
                <Button variant="ghost" icon={FiLogOut} onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'bg-primary-light text-white/60 hover:text-white hover:bg-primary-light/80'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">My Orders</h2>
                <Button variant="ghost" size="sm" onClick={fetchUserData}>
                  Refresh
                </Button>
              </div>
              
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="glass-card p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-white/40 text-sm">Order ID</p>
                        <p className="text-white font-medium">ORD-{order._id?.slice(-6) || order._id}</p>
                      </div>
                      <div className="flex items-center gap-8 flex-wrap">
                        <div>
                          <p className="text-white/40 text-sm">Date</p>
                          <p className="text-white">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', month: 'short', day: 'numeric' 
                            }) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/40 text-sm">Items</p>
                          <p className="text-white">{order.items?.length || 1} items</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-sm">Total</p>
                          <p className="text-accent font-semibold">
                            {formatINR(order.pricingINR?.total || order.total || 0)}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    
                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10 overflow-x-auto">
                      {order.items?.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex-shrink-0">
                          <p className="text-white/60 text-sm truncate max-w-[200px]">
                            {item.productName || item.name || item.product?.name || 'Product'}
                            {item.shade && ` - ${item.shade}`}
                          </p>
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <p className="text-white/40 text-sm flex-shrink-0">
                          +{order.items.length - 4} more items
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                      <p className="text-white/60 text-sm">
                        Payment: {order.paymentMethod || 'COD'}
                      </p>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FiShoppingBag size={48} className="text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 mb-4">No orders yet</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/products'}>
                    Start Shopping
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">My Wishlist</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="glass-card p-4">
                    <div className="aspect-square overflow-hidden rounded-xl mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs text-accent uppercase tracking-wider">{item.brand}</p>
                    <h3 className="font-display text-lg text-white mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{formatINR(item.price * 83.5)}</span>
                      <Button size="sm">Add to Cart</Button>
                    </div>
                  </div>
                ))}
              </div>

              {wishlist.length === 0 && (
                <div className="text-center py-12">
                  <FiHeart size={48} className="text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">Your wishlist is empty</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-3 bg-primary-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''}
                      className="w-full px-4 py-3 bg-primary-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={user?.phone || ''}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-primary-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-primary-light border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-display font-semibold text-white mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Order Updates', desc: 'Get notified about order status changes' },
                      { label: 'New Arrivals', desc: 'Be the first to know about new products' },
                      { label: 'Promotions', desc: 'Receive exclusive offers and discounts' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-primary-light/50 rounded-xl">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-white/40 text-sm">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={idx < 2} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

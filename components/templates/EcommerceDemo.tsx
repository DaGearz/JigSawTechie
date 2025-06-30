'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Heart, Search, User, Menu, Truck, Shield, RotateCcw } from 'lucide-react';

export default function EcommerceDemo() {
  const [cartItems, setCartItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'];
  
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 234,
      image: '🎧',
      category: 'Electronics',
      badge: 'Sale'
    },
    {
      id: 2,
      name: 'Premium Cotton T-Shirt',
      price: 24.99,
      rating: 4.8,
      reviews: 156,
      image: '👕',
      category: 'Fashion',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Smart Home Security Camera',
      price: 149.99,
      rating: 4.6,
      reviews: 89,
      image: '📷',
      category: 'Electronics',
      badge: 'Popular'
    },
    {
      id: 4,
      name: 'Organic Plant Fertilizer',
      price: 19.99,
      rating: 4.7,
      reviews: 67,
      image: '🌱',
      category: 'Home & Garden',
      badge: ''
    },
    {
      id: 5,
      name: 'Yoga Mat Premium',
      price: 39.99,
      rating: 4.9,
      reviews: 203,
      image: '🧘',
      category: 'Sports',
      badge: 'Bestseller'
    },
    {
      id: 6,
      name: 'Business Strategy Book',
      price: 16.99,
      rating: 4.4,
      reviews: 145,
      image: '📚',
      category: 'Books',
      badge: ''
    }
  ];

  const addToCart = () => {
    setCartItems(cartItems + 1);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Shop Supreme</span>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-green-600">
                <User className="w-6 h-6" />
              </button>
              <button className="text-gray-700 hover:text-green-600">
                <Heart className="w-6 h-6" />
              </button>
              <button className="text-gray-700 hover:text-green-600 relative">
                <ShoppingCart className="w-6 h-6" />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Shop Supreme Quality Products</h1>
              <p className="text-xl mb-8">
                Discover amazing deals on premium products. Fast shipping, secure payments, 
                and exceptional customer service guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50">
                  Shop Now
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800">
                  View Deals
                </button>
              </div>
            </div>
            <div className="bg-green-700 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold">50%</div>
                  <div className="text-green-200">Off Selected Items</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">Free</div>
                  <div className="text-green-200">Shipping Over $50</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-green-200">Customer Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">30-Day</div>
                  <div className="text-green-200">Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.toLowerCase()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Discover our best-selling items</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {product.badge && (
                  <div className="relative">
                    <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-semibold rounded-full z-10 ${
                      product.badge === 'Sale' ? 'bg-red-100 text-red-600' :
                      product.badge === 'New' ? 'bg-blue-100 text-blue-600' :
                      product.badge === 'Popular' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}
                
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-6xl">{product.image}</span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">({product.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={addToCart}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders over $50. Fast and reliable shipping nationwide.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is encrypted and secure with SSL protection.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy. Not satisfied? Return it for a full refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">Get the latest deals and product updates delivered to your inbox</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Shop Supreme</span>
              </div>
              <p className="text-gray-300">Your trusted online shopping destination for quality products at great prices.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400">About Us</a></li>
                <li><a href="#" className="hover:text-green-400">Contact</a></li>
                <li><a href="#" className="hover:text-green-400">Shipping Info</a></li>
                <li><a href="#" className="hover:text-green-400">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400">Electronics</a></li>
                <li><a href="#" className="hover:text-green-400">Fashion</a></li>
                <li><a href="#" className="hover:text-green-400">Home & Garden</a></li>
                <li><a href="#" className="hover:text-green-400">Sports</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>📧 support@shopsupreme.com</li>
                <li>📞 (555) 456-7890</li>
                <li>💬 Live Chat Available</li>
                <li>🕒 24/7 Customer Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Shop Supreme. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

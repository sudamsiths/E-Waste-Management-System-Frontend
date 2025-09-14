import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import { ShoppingCart, Filter, Search, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  image: string;
  rating: number;
  inStock: boolean;
  isNew?: boolean;
  isEcoFriendly?: boolean;
  location?: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<{productId: number, quantity: number}[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 1000 },
    onlyInStock: false,
    onlyEcoFriendly: false,
    onlyNew: false,
  });
  const [sortBy, setSortBy] = useState('featured');
  const [showCart, setShowCart] = useState(false);

  // Fetch products from API endpoint
  useEffect(() => {
    const fetchGarbageItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8085/garbage/getAll');
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map the API response to match our Product interface
        const mappedProducts: Product[] = data.map((item: any, index: number) => ({
          id: item.id || index + 1,
          name: item.title || "Unknown Item",
          category: item.category || "Other",
          price: item.weight ? item.weight * 5 : 10.00, // Using weight to determine price
          description: item.description || "No description available",
          image: item.image ? `http://localhost:8085/uploads/${item.image}` : "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          rating: 4.0,
          inStock: true,
          isEcoFriendly: true,
          location: item.location || "Unknown"
        }));
        
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching garbage data:', error);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchGarbageItems();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        item => item.name.toLowerCase().includes(lowerCaseSearch) || 
                item.description.toLowerCase().includes(lowerCaseSearch) ||
                item.category.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply category filter
    if (activeFilters.categories.length > 0) {
      result = result.filter(item => activeFilters.categories.includes(item.category));
    }
    
    // Apply price filter
    result = result.filter(item => {
      const price = item.discountPrice || item.price;
      return price >= activeFilters.priceRange.min && price <= activeFilters.priceRange.max;
    });
    
    // Apply stock filter
    if (activeFilters.onlyInStock) {
      result = result.filter(item => item.inStock);
    }
    
    // Apply eco-friendly filter
    if (activeFilters.onlyEcoFriendly) {
      result = result.filter(item => item.isEcoFriendly);
    }
    
    // Apply new items filter
    if (activeFilters.onlyNew) {
      result = result.filter(item => item.isNew);
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'priceLowToHigh':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'priceHighToLow':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // featured
        // Keep original order
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, activeFilters, sortBy]);

  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  // Handle adding item to cart
  const addToCart = (productId: number) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if item already in cart
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // Add new item with quantity 1
      setCartItems([...cartItems, { productId, quantity: 1 }]);
    }
    
    // Show cart popup briefly
    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000);
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    if (activeFilters.categories.includes(category)) {
      setActiveFilters({
        ...activeFilters,
        categories: activeFilters.categories.filter(c => c !== category)
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        categories: [...activeFilters.categories, category]
      });
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    if (product) {
      const price = product.discountPrice || product.price;
      return total + (price * cartItem.quantity);
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8" style={{ paddingTop: '85px' }}>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Eco-Friendly Products
              </h1>
              <p className="text-green-100 mb-6">
                Shop our collection of sustainable products and recycling solutions to support
                the circular economy and reduce e-waste.
              </p>
              <div className="bg-white bg-opacity-20 p-2 rounded-lg flex items-center">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-green-100 text-sm"
                />
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="md:w-1/2 bg-green-700 min-h-[200px] md:min-h-0">
              <img 
                src="https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Eco-friendly products" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button 
                  onClick={() => setActiveFilters({
                    categories: [],
                    priceRange: { min: 0, max: 1000 },
                    onlyInStock: false,
                    onlyEcoFriendly: false,
                    onlyNew: false
                  })}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Reset
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                        checked={activeFilters.categories.includes(category)}
                        onChange={() => toggleCategoryFilter(category)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="flex items-center space-x-4">
                  <input 
                    type="number"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => setActiveFilters({
                      ...activeFilters,
                      priceRange: { ...activeFilters.priceRange, min: Number(e.target.value) }
                    })}
                    min="0"
                    max={activeFilters.priceRange.max}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input 
                    type="number"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => setActiveFilters({
                      ...activeFilters,
                      priceRange: { ...activeFilters.priceRange, max: Number(e.target.value) }
                    })}
                    min={activeFilters.priceRange.min}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              {/* Additional Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                      checked={activeFilters.onlyInStock}
                      onChange={() => setActiveFilters({
                        ...activeFilters,
                        onlyInStock: !activeFilters.onlyInStock
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                      checked={activeFilters.onlyEcoFriendly}
                      onChange={() => setActiveFilters({
                        ...activeFilters,
                        onlyEcoFriendly: !activeFilters.onlyEcoFriendly
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Eco-Friendly</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                      checked={activeFilters.onlyNew}
                      onChange={() => setActiveFilters({
                        ...activeFilters,
                        onlyNew: !activeFilters.onlyNew
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-700">New Arrivals</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Controls - Mobile Filter Button & Sort */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              <div className="relative z-10">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="md:hidden bg-white rounded-lg shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                          checked={activeFilters.categories.includes(category)}
                          onChange={() => toggleCategoryFilter(category)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Additional Filters */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Filters</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                        checked={activeFilters.onlyInStock}
                        onChange={() => setActiveFilters({
                          ...activeFilters,
                          onlyInStock: !activeFilters.onlyInStock
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                        checked={activeFilters.onlyEcoFriendly}
                        onChange={() => setActiveFilters({
                          ...activeFilters,
                          onlyEcoFriendly: !activeFilters.onlyEcoFriendly
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-700">Eco-Friendly</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                        checked={activeFilters.onlyNew}
                        onChange={() => setActiveFilters({
                          ...activeFilters,
                          onlyNew: !activeFilters.onlyNew
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-700">New Arrivals</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={() => setActiveFilters({
                      categories: [],
                      priceRange: { min: 0, max: 1000 },
                      onlyInStock: false,
                      onlyEcoFriendly: false,
                      onlyNew: false
                    })}
                    className="text-sm text-gray-600"
                  >
                    Reset All
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Error loading products</p>
                <p className="text-sm">{error}</p>
                <button className="mt-2 text-sm font-medium hover:underline" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            )}
            
            {/* Empty Results */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 p-8 rounded-lg text-center">
                <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search term</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilters({
                      categories: [],
                      priceRange: { min: 0, max: 1000 },
                      onlyInStock: false,
                      onlyEcoFriendly: false,
                      onlyNew: false
                    });
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {/* Product Grid */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Badge overlays */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">New</span>
                          )}
                          {product.isEcoFriendly && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Eco-Friendly</span>
                          )}
                          {!product.inStock && (
                            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-medium text-gray-500">{product.category}</span>
                            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                          </div>
                          <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                            <span className="text-sm font-bold text-green-700">{product.rating}</span>
                            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                        {product.location && (
                          <div className="flex items-center mt-1 mb-2">
                            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs text-gray-600">{product.location}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2 h-10 mb-3">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            {product.discountPrice ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-green-600">${product.discountPrice.toFixed(2)}</span>
                                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                            )}
                          </div>
                          <button 
                            onClick={() => addToCart(product.id)}
                            disabled={!product.inStock}
                            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1
                              ${product.inStock ? 
                                'bg-green-600 text-white hover:bg-green-700' : 
                                'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Results Count */}
                <div className="mt-8 text-sm text-gray-600 text-center">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Cart Popup */}
      <div className={`fixed bottom-8 right-8 bg-white rounded-lg shadow-lg border border-green-200 transition-all duration-300 transform z-50 ${showCart ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="p-4 max-w-xs w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">Your Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h3>
            <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {cartItems.length > 0 ? (
            <>
              <div className="max-h-40 overflow-y-auto mb-3">
                {cartItems.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × ${(product.discountPrice || product.price).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium">
                  View Cart & Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <ShoppingCart className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating Cart Button */}
      <button 
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>
    </div>
  );
};

export default Shop;

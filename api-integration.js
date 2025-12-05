/**
 * API Integration for Soofi Attars Frontend
 * 
 * This file provides functions to interact with the backend API.
 * Replace the localStorage-based functions in app.js with these API calls.
 */

// ========== CONFIGURATION ==========
const API_CONFIG = {
    // Change this to your Vercel deployment URL
    BASE_URL: 'http://localhost:3000/api', // For local development
    // BASE_URL: 'https://your-app.vercel.app/api', // For production
};

// ========== AUTH HELPERS ==========
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function clearAuthToken() {
    localStorage.removeItem('authToken');
}

function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// ========== API FUNCTIONS ==========

// Authentication
async function apiLogin(username, password) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        setAuthToken(data.token);
        return data.user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function apiLogout() {
    clearAuthToken();
    // No API call needed for logout with JWT
}

// Inventory Management
async function apiGetInventory() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/inventory`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch inventory');
        }

        return await response.json();
    } catch (error) {
        console.error('Get inventory error:', error);
        throw error;
    }
}

async function apiAddInventoryItem(item) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/inventory`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(item)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add item');
        }

        return data;
    } catch (error) {
        console.error('Add inventory error:', error);
        throw error;
    }
}

async function apiUpdateInventoryItem(id, updates) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/inventory/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update item');
        }

        return data;
    } catch (error) {
        console.error('Update inventory error:', error);
        throw error;
    }
}

async function apiAdjustStock(id, delta) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/inventory/${id}/stock`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ delta })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to adjust stock');
        }

        return data;
    } catch (error) {
        console.error('Adjust stock error:', error);
        throw error;
    }
}

async function apiDeleteInventoryItem(id) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/inventory/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete item');
        }

        return data;
    } catch (error) {
        console.error('Delete inventory error:', error);
        throw error;
    }
}

// Sales Management
async function apiGetSales(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const url = `${API_CONFIG.BASE_URL}/sales?${params}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sales');
        }

        return await response.json();
    } catch (error) {
        console.error('Get sales error:', error);
        throw error;
    }
}

async function apiCreateSale(saleData) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/sales`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(saleData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create sale');
        }

        return data;
    } catch (error) {
        console.error('Create sale error:', error);
        throw error;
    }
}

async function apiGetNextInvoiceNumber() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/sales/invoice-number`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to get invoice number');
        }

        const data = await response.json();
        return data.invoiceNumber;
    } catch (error) {
        console.error('Get invoice number error:', error);
        throw error;
    }
}

async function apiIncrementInvoice() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/sales/increment-invoice`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to increment invoice');
        }

        return await response.json();
    } catch (error) {
        console.error('Increment invoice error:', error);
        throw error;
    }
}

async function apiGetSalesSummary(date) {
    try {
        const params = date ? `?date=${date}` : '';
        const response = await fetch(`${API_CONFIG.BASE_URL}/sales/summary${params}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to get sales summary');
        }

        return await response.json();
    } catch (error) {
        console.error('Get sales summary error:', error);
        throw error;
    }
}

// ========== MIGRATION HELPERS ==========

/**
 * Migrate data from localStorage to MongoDB
 * Run this once to transfer existing data
 */
async function migrateLocalStorageToAPI() {
    try {
        console.log('Starting migration...');

        // Migrate inventory
        const localInventory = JSON.parse(localStorage.getItem('attar_inventory_v1') || '[]');
        console.log(`Found ${localInventory.length} inventory items`);

        for (const item of localInventory) {
            try {
                await apiAddInventoryItem({
                    name: item.name,
                    type: item.type,
                    price: item.price,
                    stock: item.stock
                });
                console.log(`Migrated: ${item.name}`);
            } catch (error) {
                console.error(`Failed to migrate ${item.name}:`, error.message);
            }
        }

        // Note: Sales migration would need to map local item IDs to MongoDB IDs
        // This is more complex and should be done carefully

        console.log('Migration complete!');
        return true;
    } catch (error) {
        console.error('Migration error:', error);
        return false;
    }
}

// ========== EXPORT ==========
// If using modules, export these functions
// export { ... }

// For global scope (current app.js style), attach to window
if (typeof window !== 'undefined') {
    window.API = {
        // Auth
        login: apiLogin,
        logout: apiLogout,

        // Inventory
        getInventory: apiGetInventory,
        addInventoryItem: apiAddInventoryItem,
        updateInventoryItem: apiUpdateInventoryItem,
        adjustStock: apiAdjustStock,
        deleteInventoryItem: apiDeleteInventoryItem,

        // Sales
        getSales: apiGetSales,
        createSale: apiCreateSale,
        getNextInvoiceNumber: apiGetNextInvoiceNumber,
        incrementInvoice: apiIncrementInvoice,
        getSalesSummary: apiGetSalesSummary,

        // Migration
        migrateLocalStorageToAPI
    };
}

// ========== USAGE EXAMPLES ==========

/*

// Example 1: Login
async function handleLogin() {
  try {
    const user = await API.login('admin', 'admin123');
    console.log('Logged in as:', user.displayName);
    setCurrentUser(user);
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

// Example 2: Load Inventory
async function loadInventoryFromAPI() {
  try {
    const items = await API.getInventory();
    inventory = items;
    renderInventory();
  } catch (error) {
    console.error('Failed to load inventory:', error);
    notifyError('Failed to load inventory');
  }
}

// Example 3: Add Inventory Item
async function addInventoryItem(name, type, price, stock) {
  try {
    const newItem = await API.addInventoryItem({ name, type, price, stock });
    inventory.push(newItem);
    renderInventory();
    notifySuccess('Item added successfully');
  } catch (error) {
    notifyError('Failed to add item: ' + error.message);
  }
}

// Example 4: Create Sale
async function confirmSale() {
  try {
    const saleData = {
      invoiceNumber: document.getElementById('invoiceNumber').value,
      invoiceDate: document.getElementById('invoiceDate').value,
      customerName: document.getElementById('customerName').value,
      customerMobile: document.getElementById('customerMobile').value,
      items: currentBill.map(item => ({
        itemId: item.itemId,
        name: item.name,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount
      })),
      ...calculateTotals()
    };

    const sale = await API.createSale(saleData);
    await API.incrementInvoice();
    
    notifySuccess('Sale confirmed! Stock updated.');
    clearBill();
    await loadInventoryFromAPI(); // Refresh inventory
  } catch (error) {
    notifyError('Failed to confirm sale: ' + error.message);
  }
}

// Example 5: Get Sales for a Date
async function loadSalesForDate(date) {
  try {
    const sales = await API.getSales({ date });
    renderSales(sales);
  } catch (error) {
    notifyError('Failed to load sales');
  }
}

*/

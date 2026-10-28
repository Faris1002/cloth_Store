import api from './api.js';

export const productService = {
  /**
   * Fetch products catalog with filtering, sorting, and pagination
   */
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data?.data;
  },

  /**
   * Fetch single product details by ID
   */
  async getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data?.data?.product;
  },

  /**
   * Create a new product (authenticated)
   */
  async createProduct(productData) {
    const res = await api.post('/products', productData);
    return res.data?.data?.product;
  },

  /**
   * Update an existing product (authenticated)
   */
  async updateProduct(id, productData) {
    const res = await api.patch(`/products/${id}`, productData);
    return res.data?.data?.product;
  },

  /**
   * Delete product by ID (authenticated)
   */
  async deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data?.data;
  },
};

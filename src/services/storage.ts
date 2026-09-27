import { CartItem, User } from '../types';

const KEYS = {
  user: 'shopapp_user',
  cart: 'shopapp_cart',
  products: 'shopapp_products'
};

export const storage = {
  getUser(): User | null {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user: User) {
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(KEYS.user);
  },
  getCart(): CartItem[] {
    const raw = localStorage.getItem(KEYS.cart);
    return raw ? JSON.parse(raw) : [];
  },
  setCart(cart: CartItem[]) {
    localStorage.setItem(KEYS.cart, JSON.stringify(cart));
  },
  getProducts(): any[] {
    const raw = localStorage.getItem(KEYS.products);
    return raw ? JSON.parse(raw) : [];
  },
  setProducts(products: any[]) {
    localStorage.setItem(KEYS.products, JSON.stringify(products));
  }
};
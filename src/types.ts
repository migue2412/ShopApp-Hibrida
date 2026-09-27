export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
}

export interface User {
  email: string;
  name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
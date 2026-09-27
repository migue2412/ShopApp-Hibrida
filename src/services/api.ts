import { Product } from '../types';

const API_URL = 'https://dummyjson.com';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?limit=30`);
  if (!response.ok) throw new Error('No fue posible consultar la API.');
  const data = await response.json();
  return data.products;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const response = await fetch(`${API_URL}/products/add`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error('No fue posible crear el producto.');
  return response.json();
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error('No fue posible actualizar el producto.');
  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('No fue posible eliminar el producto.');
}
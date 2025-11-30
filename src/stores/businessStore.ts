import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  category: string;
  hpp: number; // Cost of goods sold
  sellingPrice: number;
  stock: number;
  image?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'xlsx' | 'jpg' | 'png' | 'doc';
  size?: number;
  parentId: string | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  logo?: string;
  ownerId: string;
  products: Product[];
  files: FileItem[];
  transactions: Transaction[];
  createdAt: string;
}

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  addBusiness: (business: Omit<Business, 'id' | 'createdAt' | 'products' | 'files' | 'transactions'>) => void;
  updateBusiness: (id: string, data: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  addProduct: (businessId: string, product: Omit<Product, 'id'>) => void;
  updateProduct: (businessId: string, productId: string, data: Partial<Product>) => void;
  deleteProduct: (businessId: string, productId: string) => void;
  addFile: (businessId: string, file: Omit<FileItem, 'id' | 'createdAt'>) => void;
  deleteFile: (businessId: string, fileId: string) => void;
  addTransaction: (businessId: string, transaction: Omit<Transaction, 'id'>) => void;
}

// Mock data for demo
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Kopi Nusantara',
    category: 'Food & Beverage',
    logo: '☕',
    ownerId: '2',
    createdAt: '2024-03-20',
    products: [
      { id: '1', name: 'Espresso', category: 'Coffee', hpp: 8000, sellingPrice: 18000, stock: 150 },
      { id: '2', name: 'Cappuccino', category: 'Coffee', hpp: 12000, sellingPrice: 25000, stock: 120 },
      { id: '3', name: 'Latte', category: 'Coffee', hpp: 13000, sellingPrice: 28000, stock: 100 },
      { id: '4', name: 'Americano', category: 'Coffee', hpp: 9000, sellingPrice: 20000, stock: 80 },
      { id: '5', name: 'Croissant', category: 'Pastry', hpp: 15000, sellingPrice: 35000, stock: 25 },
      { id: '6', name: 'Cheese Cake', category: 'Pastry', hpp: 22000, sellingPrice: 45000, stock: 8 },
      { id: '7', name: 'Matcha Latte', category: 'Tea', hpp: 14000, sellingPrice: 30000, stock: 60 },
      { id: '8', name: 'Earl Grey', category: 'Tea', hpp: 6000, sellingPrice: 15000, stock: 45 },
    ],
    files: [
      { id: '1', name: 'Financial Reports', type: 'folder', parentId: null, createdAt: '2024-03-20' },
      { id: '2', name: 'Receipts', type: 'folder', parentId: null, createdAt: '2024-03-21' },
      { id: '3', name: 'Q1 Report.pdf', type: 'pdf', size: 2450000, parentId: '1', createdAt: '2024-04-01' },
      { id: '4', name: 'Inventory.xlsx', type: 'xlsx', size: 156000, parentId: '1', createdAt: '2024-04-05' },
      { id: '5', name: 'Supplier Invoice.pdf', type: 'pdf', size: 890000, parentId: '2', createdAt: '2024-04-10' },
    ],
    transactions: [
      { id: '1', type: 'sale', description: 'Daily Sales', amount: 2450000, date: '2024-04-15' },
      { id: '2', type: 'purchase', description: 'Coffee Beans Supply', amount: -850000, date: '2024-04-14' },
      { id: '3', type: 'sale', description: 'Daily Sales', amount: 1980000, date: '2024-04-14' },
      { id: '4', type: 'expense', description: 'Utility Bills', amount: -450000, date: '2024-04-13' },
      { id: '5', type: 'sale', description: 'Daily Sales', amount: 3120000, date: '2024-04-13' },
    ],
  },
  {
    id: '2',
    name: 'Urban Threads',
    category: 'Fashion & Apparel',
    logo: '👕',
    ownerId: '2',
    createdAt: '2024-02-10',
    products: [
      { id: '1', name: 'Basic T-Shirt', category: 'Tops', hpp: 45000, sellingPrice: 120000, stock: 85 },
      { id: '2', name: 'Denim Jeans', category: 'Bottoms', hpp: 120000, sellingPrice: 350000, stock: 45 },
      { id: '3', name: 'Hoodie', category: 'Outerwear', hpp: 95000, sellingPrice: 280000, stock: 30 },
      { id: '4', name: 'Polo Shirt', category: 'Tops', hpp: 55000, sellingPrice: 150000, stock: 60 },
      { id: '5', name: 'Cargo Pants', category: 'Bottoms', hpp: 85000, sellingPrice: 250000, stock: 5 },
      { id: '6', name: 'Summer Dress', category: 'Dresses', hpp: 110000, sellingPrice: 320000, stock: 20 },
    ],
    files: [
      { id: '1', name: 'Designs', type: 'folder', parentId: null, createdAt: '2024-02-10' },
      { id: '2', name: 'Logo.png', type: 'png', size: 450000, parentId: '1', createdAt: '2024-02-12' },
      { id: '3', name: 'Catalog.pdf', type: 'pdf', size: 5600000, parentId: null, createdAt: '2024-03-01' },
    ],
    transactions: [
      { id: '1', type: 'sale', description: 'Online Orders', amount: 4850000, date: '2024-04-15' },
      { id: '2', type: 'purchase', description: 'Fabric Supply', amount: -2200000, date: '2024-04-12' },
      { id: '3', type: 'sale', description: 'Store Sales', amount: 3200000, date: '2024-04-11' },
    ],
  },
];

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      businesses: mockBusinesses,
      currentBusiness: null,
      setCurrentBusiness: (business) => set({ currentBusiness: business }),
      addBusiness: (businessData) => {
        const newBusiness: Business = {
          ...businessData,
          id: Date.now().toString(),
          products: [],
          files: [],
          transactions: [],
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ businesses: [...state.businesses, newBusiness] }));
      },
      updateBusiness: (id, data) => {
        set((state) => ({
          businesses: state.businesses.map((b) => (b.id === id ? { ...b, ...data } : b)),
          currentBusiness: state.currentBusiness?.id === id ? { ...state.currentBusiness, ...data } : state.currentBusiness,
        }));
      },
      deleteBusiness: (id) => {
        set((state) => ({
          businesses: state.businesses.filter((b) => b.id !== id),
          currentBusiness: state.currentBusiness?.id === id ? null : state.currentBusiness,
        }));
      },
      addProduct: (businessId, product) => {
        const newProduct: Product = { ...product, id: Date.now().toString() };
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId ? { ...b, products: [...b.products, newProduct] } : b
          ),
          currentBusiness:
            state.currentBusiness?.id === businessId
              ? { ...state.currentBusiness, products: [...state.currentBusiness.products, newProduct] }
              : state.currentBusiness,
        }));
      },
      updateProduct: (businessId, productId, data) => {
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId
              ? { ...b, products: b.products.map((p) => (p.id === productId ? { ...p, ...data } : p)) }
              : b
          ),
          currentBusiness:
            state.currentBusiness?.id === businessId
              ? {
                  ...state.currentBusiness,
                  products: state.currentBusiness.products.map((p) => (p.id === productId ? { ...p, ...data } : p)),
                }
              : state.currentBusiness,
        }));
      },
      deleteProduct: (businessId, productId) => {
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId ? { ...b, products: b.products.filter((p) => p.id !== productId) } : b
          ),
          currentBusiness:
            state.currentBusiness?.id === businessId
              ? { ...state.currentBusiness, products: state.currentBusiness.products.filter((p) => p.id !== productId) }
              : state.currentBusiness,
        }));
      },
      addFile: (businessId, file) => {
        const newFile: FileItem = { ...file, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId ? { ...b, files: [...b.files, newFile] } : b
          ),
          currentBusiness:
            state.currentBusiness?.id === businessId
              ? { ...state.currentBusiness, files: [...state.currentBusiness.files, newFile] }
              : state.currentBusiness,
        }));
      },
      deleteFile: (businessId, fileId) => {
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId ? { ...b, files: b.files.filter((f) => f.id !== fileId) } : b
          ),
          currentBusiness:
            state.currentBusiness?.id === businessId
              ? { ...state.currentBusiness, files: state.currentBusiness.files.filter((f) => f.id !== fileId) }
              : state.currentBusiness,
        }));
      },
      addTransaction: (businessId, transaction) => {
        const newTransaction: Transaction = { ...transaction, id: Date.now().toString() };
        set((state) => ({
          businesses: state.businesses.map((b) =>
            b.id === businessId ? { ...b, transactions: [newTransaction, ...b.transactions] } : b
          ),
          currentBusiness:
            state.currentBusiness?.id === businessId
              ? { ...state.currentBusiness, transactions: [newTransaction, ...state.currentBusiness.transactions] }
              : state.currentBusiness,
        }));
      },
    }),
    {
      name: 'bizness-businesses',
    }
  )
);

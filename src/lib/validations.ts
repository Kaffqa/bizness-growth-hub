import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Product name is required')
    .max(255, 'Product name must be less than 255 characters'),
  category: z.string()
    .trim()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters'),
  hpp: z.number()
    .finite('HPP must be a valid number')
    .nonnegative('HPP cannot be negative')
    .max(999999999999, 'HPP value is too large'),
  selling_price: z.number()
    .finite('Selling price must be a valid number')
    .nonnegative('Selling price cannot be negative')
    .max(999999999999, 'Selling price value is too large'),
  stock: z.number()
    .int('Stock must be a whole number')
    .nonnegative('Stock cannot be negative')
    .max(999999999, 'Stock value is too large'),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Validate product form data from string inputs
export const validateProductForm = (data: {
  name: string;
  category: string;
  hpp: string;
  selling_price: string;
  stock: string;
}) => {
  const parsed = {
    name: data.name,
    category: data.category,
    hpp: parseFloat(data.hpp) || 0,
    selling_price: parseFloat(data.selling_price) || 0,
    stock: parseInt(data.stock) || 0,
  };
  
  return productSchema.safeParse(parsed);
};

// OCR item validation schema
export const ocrItemSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Item name is required')
    .max(255, 'Item name must be less than 255 characters'),
  price: z.number()
    .finite('Price must be a valid number')
    .nonnegative('Price cannot be negative')
    .max(999999999999, 'Price value is too large'),
});

export const ocrDataSchema = z.object({
  id: z.string(),
  date: z.string()
    .max(50, 'Date too long'),
  vendor: z.string()
    .trim()
    .max(255, 'Vendor name too long')
    .default('Unknown Vendor'),
  items: z.array(ocrItemSchema).default([]),
  total: z.number()
    .finite('Total must be a valid number')
    .nonnegative('Total cannot be negative')
    .max(999999999999, 'Total value is too large'),
});

export type OCRItem = z.infer<typeof ocrItemSchema>;
export type OCRData = z.infer<typeof ocrDataSchema>;

// Validate and sanitize OCR data from AI response
export const validateOCRData = (data: unknown): OCRData => {
  const defaultData: OCRData = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    vendor: 'Unknown Vendor',
    items: [],
    total: 0,
  };

  if (!data || typeof data !== 'object') {
    return defaultData;
  }

  try {
    const result = ocrDataSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }
    // If validation fails, return default with any valid fields
    return defaultData;
  } catch {
    return defaultData;
  }
};

// Calculator material validation
export const materialSchema = z.object({
  id: z.number(),
  name: z.string().max(255, 'Material name too long'),
  unit: z.string().max(50, 'Unit too long'),
  price: z.string(),
});

// Safely parse numeric value with bounds checking
export const safeParseNumber = (
  value: string | number,
  options?: {
    min?: number;
    max?: number;
    allowNegative?: boolean;
    isInteger?: boolean;
  }
): number => {
  const { min = 0, max = 999999999999, allowNegative = false, isInteger = false } = options || {};
  
  let num: number;
  if (typeof value === 'string') {
    num = isInteger ? parseInt(value, 10) : parseFloat(value);
  } else {
    num = value;
  }

  // Handle invalid numbers
  if (!Number.isFinite(num)) {
    return 0;
  }

  // Apply constraints
  if (!allowNegative && num < 0) {
    num = 0;
  }
  
  if (num < min) {
    num = min;
  }
  
  if (num > max) {
    num = max;
  }

  if (isInteger) {
    num = Math.floor(num);
  }

  return num;
};

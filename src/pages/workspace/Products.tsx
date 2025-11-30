import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBusinessStore, Product } from '@/stores/businessStore';
import { toast } from '@/hooks/use-toast';

const Products = () => {
  const { currentBusiness, addProduct, updateProduct, deleteProduct } = useBusinessStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    hpp: '',
    sellingPrice: '',
    stock: '',
  });

  if (!currentBusiness) return null;

  const filteredProducts = currentBusiness.products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        hpp: product.hpp.toString(),
        sellingPrice: product.sellingPrice.toString(),
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', hpp: '', sellingPrice: '', stock: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.hpp || !formData.sellingPrice || !formData.stock) {
      toast({ title: 'Error', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      hpp: parseFloat(formData.hpp),
      sellingPrice: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stock),
    };

    if (editingProduct) {
      updateProduct(currentBusiness.id, editingProduct.id, productData);
      toast({ title: 'Success', description: 'Product updated successfully!' });
    } else {
      addProduct(currentBusiness.id, productData);
      toast({ title: 'Success', description: 'Product added successfully!' });
    }

    setIsDialogOpen(false);
    setFormData({ name: '', category: '', hpp: '', sellingPrice: '', stock: '' });
  };

  const handleDelete = (productId: string) => {
    deleteProduct(currentBusiness.id, productId);
    toast({ title: 'Deleted', description: 'Product removed successfully.' });
  };

  const calculateMargin = (hpp: number, sellingPrice: number) => {
    return (((sellingPrice - hpp) / sellingPrice) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Products & Inventory</h1>
          <p className="text-muted-foreground">Manage your product catalog and stock levels.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Product Name</label>
                <Input
                  placeholder="e.g., Espresso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Input
                  placeholder="e.g., Coffee"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">HPP (Cost)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.hpp}
                    onChange={(e) => setFormData({ ...formData, hpp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Selling Price</label>
                  <Input
                    type="number"
                    placeholder="e.g., 25000"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Stock Quantity</label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              {formData.hpp && formData.sellingPrice && (
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm text-success">
                    Calculated Margin: {calculateMargin(parseFloat(formData.hpp), parseFloat(formData.sellingPrice))}%
                  </p>
                </div>
              )}
              <Button onClick={handleSubmit} className="w-full" variant="hero">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Product List ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">HPP</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className={product.stock < 10 ? 'bg-destructive/5' : ''}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {product.name}
                          {product.stock < 10 && (
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-secondary text-xs">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">Rp {product.hpp.toLocaleString()}</TableCell>
                      <TableCell className="text-right">Rp {product.sellingPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={product.stock < 10 ? 'text-destructive font-semibold' : ''}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-success font-medium">
                          {calculateMargin(product.hpp, product.sellingPrice)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Products;

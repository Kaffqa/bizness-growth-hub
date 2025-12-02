import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Building2, LogOut, ChevronRight, Store, TrendingUp, Package } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { toast } from '@/hooks/use-toast';

const businessCategories = [
  'Food & Beverage',
  'Fashion & Apparel',
  'Electronics',
  'Health & Beauty',
  'Home & Garden',
  'Services',
  'Other',
];

const businessEmojis = ['☕', '👕', '💻', '💄', '🏠', '🛠️', '📦', '🍕', '🎨', '📚'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const { businesses, fetchBusinesses, addBusiness, setCurrentBusiness, isLoading } = useBusinessStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessCategory, setNewBusinessCategory] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📦');

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleCreateBusiness = async () => {
    if (!newBusinessName || !newBusinessCategory) {
      toast({ title: 'Error', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }

    const newBusiness = await addBusiness({
      name: newBusinessName,
      category: newBusinessCategory,
      logo: selectedEmoji,
      owner_id: user.id,
    });

    if (newBusiness) {
      toast({ title: 'Success', description: 'Business created successfully!' });
      setIsDialogOpen(false);
      setNewBusinessName('');
      setNewBusinessCategory('');
      setSelectedEmoji('📦');
    }
  };

  const handleSelectBusiness = (business: typeof businesses[0]) => {
    setCurrentBusiness(business);
    navigate(`/workspace/${business.id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const totalRevenue = businesses.reduce((acc, b) => {
    const revenue = (b.transactions || []).filter((t) => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
    return acc + revenue;
  }, 0);

  const totalProducts = businesses.reduce((acc, b) => acc + (b.products?.length || 0), 0);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Bizness</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <p className="font-medium">{displayName}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Manage your businesses and track performance from one place.</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Businesses</p>
                    <p className="text-3xl font-bold">{businesses.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">Rp {(totalRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="stat">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                    <p className="text-3xl font-bold">{totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Business List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Businesses</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                New Business
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Business</DialogTitle>
                <DialogDescription>Add a new business to your portfolio.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Logo</label>
                  <div className="flex gap-2 flex-wrap">
                    {businessEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          selectedEmoji === emoji
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Name</label>
                  <Input
                    placeholder="e.g., My Coffee Shop"
                    value={newBusinessName}
                    onChange={(e) => setNewBusinessName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={newBusinessCategory} onValueChange={setNewBusinessCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateBusiness} className="w-full" variant="hero">
                  Create Business
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <Card variant="glass" className="p-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading businesses...</div>
          </Card>
        ) : businesses.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No businesses yet</h3>
            <p className="text-muted-foreground mb-4">Create your first business to get started.</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create Business
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant="interactive"
                  className="group"
                  onClick={() => handleSelectBusiness(business)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                        {business.logo}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-1">{business.name}</CardTitle>
                    <CardDescription className="mb-4">{business.category}</CardDescription>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Products:</span>{' '}
                        <span className="font-medium">{business.products?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Files:</span>{' '}
                        <span className="font-medium">{business.files?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessStore } from '@/stores/businessStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(222, 76%, 33%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

const Overview = () => {
  const { currentBusiness } = useBusinessStore();

  if (!currentBusiness) return null;

  const totalRevenue = currentBusiness.transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentBusiness.transactions
    .filter((t) => t.type !== 'sale')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const grossProfit = totalRevenue - totalExpenses;

  const lowStockItems = currentBusiness.products.filter((p) => p.stock < 10);

  // Generate chart data from transactions
  const chartData = [
    { name: 'Week 1', revenue: 8500000 },
    { name: 'Week 2', revenue: 12000000 },
    { name: 'Week 3', revenue: 9800000 },
    { name: 'Week 4', revenue: 15600000 },
  ];

  // Category distribution for pie chart
  const categoryMap = new Map<string, number>();
  currentBusiness.products.forEach((p) => {
    const current = categoryMap.get(p.category) || 0;
    categoryMap.set(p.category, current + 1);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  const stats = [
    {
      title: 'Monthly Revenue',
      value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Gross Profit',
      value: `Rp ${(grossProfit / 1000000).toFixed(1)}M`,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Low Stock Alert',
      value: lowStockItems.length,
      change: lowStockItems.length > 0 ? 'Needs attention' : 'All good',
      trend: lowStockItems.length > 0 ? 'down' : 'up',
      icon: AlertTriangle,
      color: lowStockItems.length > 0 ? 'text-warning' : 'text-success',
      bgColor: lowStockItems.length > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
    {
      title: 'Total Products',
      value: currentBusiness.products.length,
      change: 'Active items',
      trend: 'up',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
        <p className="text-muted-foreground">Track your business performance at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="stat">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg">Product Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {categoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentBusiness.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'sale' ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    {transaction.type === 'sale' ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {transaction.date}
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'sale' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'sale' ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Overview;

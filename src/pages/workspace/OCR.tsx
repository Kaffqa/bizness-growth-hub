import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanText, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  History, 
  FileText, 
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area'; // Pastikan ada atau ganti div biasa dengan overflow-y-auto
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Types ---
interface OCRItem {
  name: string;
  price: number;
}

interface OCRData {
  id: string;
  date: string;
  vendor: string;
  items: OCRItem[];
  total: number;
}

// --- Mock Data Generator ---
const generateMockData = (): OCRData => {
  const vendors = ['PT. Supply Wholesale', 'Berkah Jaya', 'Indogrosir', 'Mitra Pangan'];
  const itemsList = [
    { name: 'Coffee Beans (1kg)', price: 150000 },
    { name: 'Milk (5L)', price: 75000 },
    { name: 'Sugar (2kg)', price: 28000 },
    { name: 'Paper Cups (100pcs)', price: 45000 },
    { name: 'Vanilla Syrup', price: 90000 },
  ];

  // Randomize items
  const selectedItems = itemsList.sort(() => 0.5 - Math.random()).slice(0, 3);
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    items: selectedItems,
    total: total,
  };
};

const OCRPage = () => {
  // --- State ---
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentResult, setCurrentResult] = useState<OCRData | null>(null);
  
  // Dummy History Data
  const [history, setHistory] = useState<OCRData[]>([
    {
      id: '123',
      date: '2025-11-20',
      vendor: 'Mitra Pangan',
      items: [{ name: 'Flour (10kg)', price: 120000 }],
      total: 120000
    }
  ]);

  // --- Handlers ---
  const handleScan = async () => {
    setIsScanning(true);
    setCurrentResult(null);
    
    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newData = generateMockData();
    setCurrentResult(newData);
    setHistory((prev) => [newData, ...prev]); // Add to history
    
    setIsScanning(false);
    toast({ title: 'Scan Complete', description: 'Receipt data extracted successfully!' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleScan();
  };

  const handleSelectHistory = (data: OCRData) => {
    setCurrentResult(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <ScanText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">OCR Scanner</h1>
          <p className="text-muted-foreground">Digitize your physical receipts and invoices instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scanner & Results (Takes up 2/3 space) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Upload Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Upload Receipt</CardTitle>
                <CardDescription>Drag and drop image or click to scan</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer h-64 flex flex-col items-center justify-center",
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  )}
                >
                  {isScanning ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="font-medium text-lg">Scanning...</p>
                        <p className="text-sm text-muted-foreground">Extracting text from image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4" onClick={handleScan}>
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto shadow-sm">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Drop receipt here</p>
                        <p className="text-sm text-muted-foreground">Supports JPG, PNG, PDF</p>
                      </div>
                      <Button variant="hero" className="mt-2">
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Result Display */}
          <AnimatePresence mode="wait">
            {currentResult && (
              <motion.div
                key={currentResult.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" className="border-primary/20 bg-primary/5">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <CardTitle className="text-lg">Extracted Data</CardTitle>
                      </div>
                      <span className="text-xs font-mono bg-background/50 px-2 py-1 rounded text-muted-foreground">
                        ID: {currentResult.id}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                           <Calendar className="w-3 h-3" /> Date
                        </label>
                        <Input value={currentResult.date} readOnly className="bg-background/50 font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Vendor
                        </label>
                        <Input value={currentResult.vendor} readOnly className="bg-background/50 font-medium" />
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Items Found</label>
                      <div className="rounded-lg border border-border overflow-hidden bg-background/40">
                        {currentResult.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-background/60 transition-colors">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm font-bold text-muted-foreground">Rp {item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/10">
                      <span className="font-semibold text-muted-foreground">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">Rp {currentResult.total.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-3">
                       <Button variant="outline" className="flex-1" onClick={() => setCurrentResult(null)}>Cancel</Button>
                       <Button variant="hero" className="flex-1">Save to Inventory</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History (Takes up 1/3 space) */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="h-full max-h-[calc(100vh-120px)] flex flex-col">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="w-4 h-4" />
                Scan History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
               <div className="h-full overflow-y-auto p-4 space-y-3">
                  {history.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      No scan history yet.
                    </div>
                  ) : (
                    history.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleSelectHistory(item)}
                        className={cn(
                          "group p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                          currentResult?.id === item.id 
                            ? "bg-primary/10 border-primary shadow-sm" 
                            : "bg-card hover:bg-secondary border-border"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                           <div>
                             <p className="font-semibold text-sm truncate max-w-[120px]">{item.vendor}</p>
                             <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                               <Calendar className="w-3 h-3" /> {item.date}
                             </p>
                           </div>
                           <div className="bg-secondary p-1.5 rounded-md group-hover:bg-background transition-colors">
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                           <span className="text-xs text-muted-foreground">{item.items.length} Items</span>
                           <span className="text-sm font-bold text-primary">Rp {(item.total/1000).toFixed(0)}k</span>
                        </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default OCRPage;
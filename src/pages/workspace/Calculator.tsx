import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  Sparkles, 
  Package, 
  Users, 
  Zap, 
  Trash2, 
  Plus, 
  RefreshCcw,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Utility Functions
const formatRp = (value: number) => {
  const n = Number.isFinite(value) ? value : Number(value) || 0;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
};

const safeNumber = (v: string | number) => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : 0;
};

const CalculatorPage = () => {
  // --- State Management ---
  const [productName, setProductName] = useState("");
  const [materials, setMaterials] = useState([{ id: 1, name: "", unit: "", price: "" }]);
  const [laborCost, setLaborCost] = useState("");
  const [overheadCost, setOverheadCost] = useState("");
  const [quantity, setQuantity] = useState("1"); // Default 1 unit
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [targetMargin, setTargetMargin] = useState([30]);
  
  // UX States
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // --- Logic ---
  const addMaterial = () => {
    setMaterials([...materials, { id: Date.now(), name: "", unit: "", price: "" }]);
  };

  const removeMaterial = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((m) => m.id !== id));
    } else {
      toast({ title: "Warning", description: "Minimal satu bahan baku diperlukan.", variant: "destructive" });
    }
  };

  const updateMaterial = (id: number, field: string, value: string) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const calculateTotalMaterials = () =>
    materials.reduce((total, material) => total + (safeNumber(material.price) || 0), 0);

  const calculateHPP = () => {
    const materialsCost = calculateTotalMaterials();
    const labor = safeNumber(laborCost);
    const overhead = safeNumber(overheadCost);
    const qty = safeNumber(quantity) || 1;
    // Asumsi: Input biaya adalah total untuk produksi 'qty' unit
    return (materialsCost + labor + overhead) / qty;
  };

  const calculateSellingPrice = (hpp: number, margin: number) => {
    if (margin >= 100) return 0;
    // Formula Margin Pricing: Harga Jual = HPP / (1 - %Margin)
    return hpp / (1 - margin / 100);
  };

  // Derived Values
  const totalMaterialsCost = calculateTotalMaterials();
  const hppPerUnit = calculateHPP();
  const sellingPrice = calculateSellingPrice(hppPerUnit, targetMargin[0]);
  const profitPerUnit = sellingPrice - hppPerUnit;
  const totalProductionCost = totalMaterialsCost + safeNumber(laborCost) + safeNumber(overheadCost);

  const handleCalculate = async () => {
    if (!productName) {
        toast({ title: "Error", description: "Mohon isi nama produk terlebih dahulu.", variant: "destructive" });
        return;
    }
    
    setIsCalculating(true);
    // Simulate AI Processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    setShowResult(true);
    setIsCalculating(false);
    toast({ title: "Success", description: "Kalkulasi dan rekomendasi harga berhasil dibuat." });
  };

  const handleReset = () => {
    setProductName("");
    setMaterials([{ id: Date.now(), name: "", unit: "", price: "" }]);
    setLaborCost("");
    setOverheadCost("");
    setQuantity("1");
    setAdditionalNotes("");
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            HPP Calculator
          </h1>
          <p className="text-muted-foreground">Calculate Cost of Goods Sold and get AI pricing recommendations.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="w-fit">
            <RefreshCcw className="w-4 h-4 mr-2" /> Reset Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Inputs (Form) - Takes 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Product & Quantity */}
          <Card variant="glass">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="w-4 h-4 text-primary" /> Detail Produk
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="text-sm font-medium mb-1.5 block">Nama Produk</label>
                        <Input 
                            placeholder="Contoh: Kopi Susu Gula Aren" 
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="bg-background/50"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Jumlah Produksi</label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="pl-3 pr-8 bg-background/50"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Qty</span>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* 2. Materials (Dynamic List) */}
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="w-4 h-4 text-primary" /> Bahan Baku (Raw Materials)
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={addMaterial} className="text-primary hover:text-primary/80 hover:bg-primary/10">
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                <AnimatePresence>
                    {materials.map((material, index) => (
                        <motion.div 
                            key={material.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-end gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 group"
                        >
                            <div className="flex-[2]">
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Nama Bahan</label>
                                <Input 
                                    placeholder="Nama bahan" 
                                    value={material.name}
                                    onChange={(e) => updateMaterial(material.id, "name", e.target.value)}
                                    className="h-8 text-sm bg-background/80"
                                />
                            </div>
                            <div className="flex-[1]">
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Satuan</label>
                                <Input 
                                    placeholder="kg/L" 
                                    value={material.unit}
                                    onChange={(e) => updateMaterial(material.id, "unit", e.target.value)}
                                    className="h-8 text-sm bg-background/80"
                                />
                            </div>
                            <div className="flex-[1.5]">
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Harga (Total)</label>
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={material.price}
                                    onChange={(e) => updateMaterial(material.id, "price", e.target.value)}
                                    className="h-8 text-sm bg-background/80"
                                />
                            </div>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeMaterial(material.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                <div className="flex justify-end pt-2 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">Total Materials: <span className="font-semibold text-foreground">{formatRp(totalMaterialsCost)}</span></p>
                </div>
            </CardContent>
          </Card>

          {/* 3. Operational Costs */}
          <Card variant="glass">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="w-4 h-4 text-primary" /> Biaya Operasional (Operational Costs)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                             <Users className="w-3 h-3" /> Tenaga Kerja (Labor)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                            <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-9 bg-background/50"
                                value={laborCost}
                                onChange={(e) => setLaborCost(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                             <Zap className="w-3 h-3" /> Overhead (Listrik, Air, etc)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                            <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-9 bg-background/50"
                                value={overheadCost}
                                onChange={(e) => setOverheadCost(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* 4. Margin Slider */}
          <Card variant="glass" className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-semibold flex items-center gap-2">
                            Target Margin Keuntungan
                            <span className="text-xs font-normal text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border">
                                Recommended: 30-50%
                            </span>
                        </label>
                        <span className="text-2xl font-bold text-primary">{targetMargin[0]}%</span>
                    </div>
                    <Slider
                        value={targetMargin}
                        onValueChange={setTargetMargin}
                        max={80}
                        min={10}
                        step={5}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>Min (10%)</span>
                        <span>Max (80%)</span>
                    </div>
                </div>
                
                <Button 
                    className="w-full mt-6 h-12 text-base shadow-lg shadow-primary/25" 
                    variant="hero" 
                    onClick={handleCalculate}
                    disabled={isCalculating}
                >
                    {isCalculating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Menganalisis Harga...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" /> Kalkulasi & Rekomendasi AI
                        </>
                    )}
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results (Sticky) - Takes 5 Columns */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
            <AnimatePresence mode="wait">
                {showResult ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        {/* Main Result Card */}
                        <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
                             {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardDescription className="text-primary-foreground/70">Rekomendasi Harga Jual</CardDescription>
                                        <CardTitle className="text-3xl font-bold mt-1">{formatRp(Math.ceil(sellingPrice))}</CardTitle>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <p className="text-xs text-primary-foreground/70 mb-1">Profit / Unit</p>
                                        <p className="font-bold text-lg">+{formatRp(Math.ceil(profitPerUnit))}</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <p className="text-xs text-primary-foreground/70 mb-1">HPP / Unit</p>
                                        <p className="font-bold text-lg">{formatRp(Math.ceil(hppPerUnit))}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Breakdown Details */}
                        <Card variant="glass">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Breakdown Biaya</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Total Material</span>
                                        <span>{formatRp(totalMaterialsCost)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Tenaga Kerja</span>
                                        <span>{formatRp(safeNumber(laborCost))}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Overhead</span>
                                        <span>{formatRp(safeNumber(overheadCost))}</span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>Total Produksi ({quantity} qty)</span>
                                        <span>{formatRp(totalProductionCost)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Insights */}
                        <Card variant="glass" className="border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" /> AI Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {[
                                        `Margin ${targetMargin[0]}% sangat sehat untuk kategori F&B.`,
                                        "Pertimbangkan bundling untuk meningkatkan nilai transaksi rata-rata.",
                                        "Pastikan overhead cost mencakup biaya kemasan."
                                    ].map((insight, i) => (
                                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                            <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                            {insight}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full min-h-[400px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center bg-secondary/20"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-primary/60" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Belum ada kalkulasi</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Isi detail produk dan biaya di sebelah kiri, lalu klik tombol kalkulasi untuk melihat rekomendasi harga AI.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CalculatorPage;
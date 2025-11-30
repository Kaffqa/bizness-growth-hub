import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Sparkles, ArrowRight, Package, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const Calculator = () => {
  const [rawMaterials, setRawMaterials] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [overheadCost, setOverheadCost] = useState('');
  const [targetMargin, setTargetMargin] = useState([30]);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateHPP = () => {
    const materials = parseFloat(rawMaterials) || 0;
    const labor = parseFloat(laborCost) || 0;
    const overhead = parseFloat(overheadCost) || 0;
    return materials + labor + overhead;
  };

  const calculateSellingPrice = (hpp: number, margin: number) => {
    return hpp / (1 - margin / 100);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowResult(true);
    setIsCalculating(false);
  };

  const hpp = calculateHPP();
  const suggestedPrice = calculateSellingPrice(hpp, targetMargin[0]);
  const profitPerUnit = suggestedPrice - hpp;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">HPP Calculator</h1>
        <p className="text-muted-foreground">Calculate your cost of goods sold and get AI-powered pricing suggestions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalcIcon className="w-5 h-5 text-primary" />
                Cost Components
              </CardTitle>
              <CardDescription>Enter your cost breakdown per unit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  Raw Materials Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={rawMaterials}
                    onChange={(e) => setRawMaterials(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Labor Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  Overhead Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={overheadCost}
                    onChange={(e) => setOverheadCost(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total HPP (Cost)</span>
                  <span className="text-xl font-bold text-primary">Rp {hpp.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-4 flex items-center justify-between">
                  <span>Target Profit Margin</span>
                  <span className="text-primary font-semibold">{targetMargin[0]}%</span>
                </label>
                <Slider
                  value={targetMargin}
                  onValueChange={setTargetMargin}
                  max={70}
                  min={10}
                  step={5}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>10%</span>
                  <span>70%</span>
                </div>
              </div>

              <Button
                variant="hero"
                className="w-full"
                size="lg"
                onClick={handleCalculate}
                disabled={hpp === 0 || isCalculating}
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    AI is analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Pricing Suggestion
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {showResult ? (
            <Card variant="glass" className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>AI Pricing Recommendation</CardTitle>
                    <CardDescription>Based on your cost structure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-primary text-primary-foreground">
                  <p className="text-sm opacity-80 mb-1">Suggested Selling Price</p>
                  <p className="text-4xl font-bold mb-2">Rp {Math.round(suggestedPrice).toLocaleString()}</p>
                  <p className="text-sm opacity-80">To achieve {targetMargin[0]}% profit margin</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary">
                    <p className="text-sm text-muted-foreground mb-1">Profit per Unit</p>
                    <p className="text-xl font-bold text-success">+Rp {Math.round(profitPerUnit).toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary">
                    <p className="text-sm text-muted-foreground mb-1">Markup</p>
                    <p className="text-xl font-bold">{((suggestedPrice / hpp - 1) * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">AI Insights</p>
                  <div className="space-y-2">
                    {[
                      'Your cost structure is well-balanced',
                      `A ${targetMargin[0]}% margin is competitive for this category`,
                      'Consider bundling to increase average order value',
                    ].map((insight, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <p className="text-sm text-success font-medium">
                    💡 Selling 100 units would generate Rp {(profitPerUnit * 100).toLocaleString()} profit
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card variant="glass" className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Enter your cost components and let our AI suggest the optimal selling price for maximum profitability.
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Calculator;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, MessageSquare, Upload, Loader2, Send, Bot, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const mockOCRData = {
  date: '2024-04-15',
  items: [
    { name: 'Coffee Beans (1kg)', price: 150000 },
    { name: 'Milk (5L)', price: 75000 },
    { name: 'Sugar (2kg)', price: 28000 },
    { name: 'Paper Cups (100pcs)', price: 45000 },
  ],
  total: 298000,
  vendor: 'PT. Supply Wholesale',
};

const chatResponses: Record<string, string> = {
  profit: `Based on your current data, here are some strategies to increase profit:

1. **Optimize Pricing**: Your coffee products have a healthy margin. Consider a slight price increase on premium items.

2. **Reduce Low-Stock Items**: Products like Cheese Cake and Cargo Pants show low stock - either increase inventory or phase out.

3. **Bundle Products**: Create combo deals to increase average order value.

4. **Focus on High-Margin Items**: Your Tea category has lower costs - promote these more.`,
  sales: `📊 **Sales Analysis Summary**

Your sales performance this month:
- Total Revenue: Rp 15.6M
- Best Performing: Coffee category (45% of sales)
- Growth Rate: +12.5% vs last month

**Recommendations:**
- Peak hours are 8-10 AM - consider morning promotions
- Weekend sales are 30% higher - optimize staffing`,
  default: `I'm Bizness AI, your intelligent business assistant! I can help you with:

• Sales and profit analysis
• Inventory optimization
• Pricing strategies
• Business insights

Just ask me anything about your business!`,
};

const AITools = () => {
  const [activeTab, setActiveTab] = useState('ocr');
  
  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<typeof mockOCRData | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: chatResponses.default },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setScanResult(mockOCRData);
    setIsScanning(false);
    toast({ title: 'Scan Complete', description: 'Receipt data extracted successfully!' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleScan();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerInput = inputValue.toLowerCase();
    let response = chatResponses.default;
    if (lowerInput.includes('profit') || lowerInput.includes('increase')) {
      response = chatResponses.profit;
    } else if (lowerInput.includes('sales') || lowerInput.includes('analyze')) {
      response = chatResponses.sales;
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">AI Tools</h1>
        <p className="text-muted-foreground">Leverage AI to streamline your business operations.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ocr" className="flex items-center gap-2">
            <ScanLine className="w-4 h-4" />
            OCR Scanner
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Bizness AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ocr" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Receipt Scanner</CardTitle>
                  <CardDescription>Upload or drag a receipt image to extract data automatically</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {isScanning ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <div>
                          <p className="font-medium">Scanning Receipt...</p>
                          <p className="text-sm text-muted-foreground">AI is extracting data</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Drop receipt image here</p>
                          <p className="text-sm text-muted-foreground">or click to browse</p>
                        </div>
                        <Button variant="outline" onClick={handleScan}>
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className={scanResult ? 'border-success/20' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {scanResult && <CheckCircle2 className="w-5 h-5 text-success" />}
                    Extracted Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scanResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground">Date</label>
                          <Input value={scanResult.date} readOnly />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Vendor</label>
                          <Input value={scanResult.vendor} readOnly />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Items</label>
                        <div className="space-y-2">
                          {scanResult.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium">Rp {item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total Amount</span>
                          <span className="text-xl font-bold text-primary">Rp {scanResult.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button variant="hero" className="w-full">
                        Save to Records
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ScanLine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Scan a receipt to see extracted data here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card variant="glass" className="h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Bizness AI</CardTitle>
                  <CardDescription>Your intelligent business assistant</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-primary' : 'bg-gradient-primary'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary p-4 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about your business..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="hero" size="icon" disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="flex gap-2 mt-3">
                {['How to increase profit?', 'Analyze my sales'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITools;

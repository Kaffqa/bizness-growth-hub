import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RefreshCcw, 
  Copy, 
  Check,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Opsional, bisa pakai div biasa
import { cn } from '@/lib/utils';

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// --- Predefined Responses (Simulation) ---
const simulateAIResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('profit') || lowerInput.includes('laba')) {
    return "Berdasarkan data bulan ini, margin keuntungan bersih Anda naik sebesar **12%**. \n\nSaran strategi:\n1. Fokus penjualan pada kategori 'Coffee' karena margin tertinggi (65%).\n2. Kurangi diskon pada jam sibuk (08:00 - 10:00).";
  }
  if (lowerInput.includes('stock') || lowerInput.includes('stok')) {
    return "⚠️ **Peringatan Stok Rendah**:\n\n- Susu UHT (Sisa: 4 Liter)\n- Biji Kopi Arabica (Sisa: 2 kg)\n\nSaya sarankan segera melakukan restock sebelum hari Jumat untuk menghindari kehabisan stok saat weekend.";
  }
  if (lowerInput.includes('marketing') || lowerInput.includes('promo')) {
    return "Ide promosi untuk minggu ini:\n\n**'Monday Mood Booster'**\nDiskon 20% untuk semua varian kopi susu setiap hari Senin jam 13:00 - 15:00. Ini dapat meningkatkan traffic di jam sepi.";
  }
  
  return "Saya Bizness AI. Saya bisa membantu menganalisis penjualan, memantau stok, atau memberikan ide strategi bisnis. Coba tanyakan: 'Bagaimana profit bulan ini?'";
};

const ChatBot = () => {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Halo! Saya Bizness AI, asisten cerdas Anda. Ada yang bisa saya bantu terkait bisnis hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref untuk auto-scroll ke bawah
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- Handlers ---
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate Delay & AI Response
    setTimeout(() => {
      const aiResponse = simulateAIResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500); // 1.5s delay
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
            Bizness AI Chat
          </h1>
          <p className="text-muted-foreground">Ask anything about your business performance.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset Chat
        </Button>
      </div>

      {/* Main Chat Card */}
      <Card variant="glass" className="flex-1 flex flex-col overflow-hidden shadow-lg border-primary/10">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex w-full gap-3",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {/* Bot Avatar (Left) */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={cn(
                  "max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-tl-sm"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <span className={cn(
                    "text-[10px] mt-2 block opacity-70",
                    msg.role === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* User Avatar (Right) */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 border border-border mt-1">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-12">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/40 backdrop-blur-md border-t border-border">
          
          {/* Quick Suggestions */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { label: 'Analisa Profit', icon: Lightbulb },
              { label: 'Cek Stok Menipis', icon: Copy },
              { label: 'Ide Marketing', icon: Sparkles }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleSendMessage(item.label)}
                disabled={isTyping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 border border-transparent transition-all text-xs font-medium whitespace-nowrap"
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-end gap-2"
          >
            <Input
              placeholder="Ketik pesan Anda..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              className="min-h-[50px] py-3 px-4 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all shadow-sm resize-none"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || isTyping}
              className="h-[50px] w-[50px] rounded-xl shrink-0 shadow-md bg-gradient-to-br from-primary to-primary/90"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </form>
          
          <p className="text-[10px] text-center text-muted-foreground mt-3">
            Bizness AI dapat membuat kesalahan. Mohon periksa kembali informasi penting.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatBot;
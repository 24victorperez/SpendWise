import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  BarChart3, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Tag, 
  ShoppingBag,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Category = 'Comida' | 'Transporte' | 'Hogar' | 'Ocio' | 'Otros';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  date: string;
}

const CATEGORY_COLORS: Record<Category, string> = {
  Comida: 'bg-orange-500',
  Transporte: 'bg-blue-500',
  Hogar: 'bg-green-500',
  Ocio: 'bg-purple-500',
  Otros: 'bg-slate-500',
};

const CATEGORY_LIGHT_COLORS: Record<Category, string> = {
  Comida: 'bg-orange-50 text-orange-600',
  Transporte: 'bg-blue-50 text-blue-600',
  Hogar: 'bg-green-50 text-green-600',
  Ocio: 'bg-purple-50 text-purple-600',
  Otros: 'bg-slate-50 text-slate-600',
};

// --- Main App Component ---

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Comida');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spendwise_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse expenses', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<Category, number> = {
      Comida: 0,
      Transporte: 0,
      Hogar: 0,
      Ocio: 0,
      Otros: 0,
    };
    expenses.forEach((exp) => {
      totals[exp.category] += exp.amount;
    });
    return totals;
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || isNaN(Number(amount))) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name,
      amount: parseFloat(amount),
      category,
      date,
    };

    setExpenses([newExpense, ...expenses]);
    setName('');
    setAmount('');
    // Reset date to today
    setDate(new Date().toISOString().split('T')[0]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">SpendWise</h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl shadow-blue-100 flex items-center space-x-6"
          >
            <span className="text-blue-100 text-sm font-medium uppercase tracking-widest">Gasto Total</span>
            <span className="text-3xl font-bold">{formatCurrency(totalSpent)}</span>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <section className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-8 flex items-center text-slate-900">
                <Plus className="h-6 w-6 mr-3 text-blue-600" />
                Añadir Nuevo Gasto
              </h2>
              
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Gasto</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Supermercado, Gasolina..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Monto ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3.5 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Categoría</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50 appearance-none cursor-pointer"
                      >
                        <option value="Comida">Comida</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Hogar">Hogar</option>
                        <option value="Ocio">Ocio</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Añadir Gasto</span>
                </button>
              </form>
            </div>
          </section>

          {/* Right Column: Summary */}
          <section className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-full">
              <h2 className="text-xl font-bold mb-8 flex items-center text-slate-900">
                <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
                Resumen de Gastos
              </h2>
              
              <div className="space-y-8">
                {expenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-medium">No hay datos para mostrar todavía.</p>
                    <p className="text-sm">Añade un gasto para ver el desglose por categoría.</p>
                  </div>
                ) : (
                  Object.entries(categoryTotals).map(([cat, amount]) => {
                    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                    if (amount === 0) return null;
                    
                    return (
                      <div key={cat} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat as Category]}`} />
                            <span className="font-bold text-slate-700">{cat}</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-slate-900">{formatCurrency(amount)}</span>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`${CATEGORY_COLORS[cat as Category]} h-full rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Transaction History */}
        <section className="mt-12">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900">Historial de Transacciones</h2>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-widest">
                {expenses.length} Transacciones
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-5">Fecha</th>
                    <th className="px-8 py-5">Nombre del Gasto</th>
                    <th className="px-8 py-5">Categoría</th>
                    <th className="px-8 py-5 text-right">Monto</th>
                    <th className="px-8 py-5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {expenses.length === 0 ? (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <td colSpan={5} className="py-20 text-slate-400">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                            <p className="font-medium">Tus transacciones recientes aparecerán aquí.</p>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      expenses.map((exp) => (
                        <motion.tr 
                          key={exp.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                            {new Date(exp.date).toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-900">
                            {exp.name}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center ${CATEGORY_LIGHT_COLORS[exp.category]}`}>
                              {exp.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-right text-slate-900">
                            {formatCurrency(exp.amount)}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <button 
                              onClick={() => deleteExpense(exp.id)}
                              className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Eliminar gasto"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 text-sm font-medium space-y-2">
        <p>© {new Date().getFullYear()} SpendWise • Tu gestor de finanzas personales</p>
        <div className="flex flex-col items-center space-y-1">
          <p className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold inline-block">
            Proyecto Escolar • Club de Programación
          </p>
          <p className="text-xs opacity-75">
            Este es un proyecto desarrollado exclusivamente con fines educativos.
          </p>
        </div>
      </footer>
    </div>
  );
}

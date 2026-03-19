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
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Category = 'Comida' | 'Transporte' | 'Hogar' | 'Ocio' | 'Otros' | 'Ropa' | 'Productividad';

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
  Ropa: 'bg-pink-500',
  Productividad: 'bg-indigo-500',
};

const CATEGORY_LIGHT_COLORS: Record<Category, string> = {
  Comida: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  Transporte: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  Hogar: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  Ocio: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  Otros: 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
  Ropa: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400',
  Productividad: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
};

// --- Main App Component ---

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Comida');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('spendwise_expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error('Failed to parse expenses', e);
      }
    }

    const savedTheme = localStorage.getItem('spendwise_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save theme to localStorage and update document class
  useEffect(() => {
    localStorage.setItem('spendwise_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
      Ropa: 0,
      Productividad: 0,
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SpendWise</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transform active:scale-95"
              aria-label="Cambiar tema"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-blue-900/20 flex items-center space-x-6"
            >
              <span className="text-blue-100 text-sm font-medium uppercase tracking-widest">Gasto Total</span>
              <span className="text-3xl font-bold">{formatCurrency(totalSpent)}</span>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <section className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-8 flex items-center text-slate-900 dark:text-white">
                <Plus className="h-6 w-6 mr-3 text-blue-600" />
                Añadir Nuevo Gasto
              </h2>
              
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre del Gasto</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Supermercado, Gasolina..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monto ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3.5 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Categoría</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white appearance-none cursor-pointer"
                      >
                        <option value="Comida">Comida</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Hogar">Hogar</option>
                        <option value="Ocio">Ocio</option>
                        <option value="Ropa">Ropa</option>
                        <option value="Productividad">Productividad</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fecha</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Añadir Gasto</span>
                </button>
              </form>
            </div>
          </section>

          {/* Right Column: Summary */}
          <section className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-full">
              <h2 className="text-xl font-bold mb-8 flex items-center text-slate-900 dark:text-white">
                <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
                Resumen de Gastos
              </h2>
              
              <div className="space-y-8">
                {expenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-medium">No hay datos para mostrar todavía.</p>
                    <p className="text-sm">Añade un gasto para ver el desglose por categoría.</p>
                  </div>
                ) : (
                  (Object.entries(categoryTotals) as [Category, number][]).map(([cat, amount]) => {
                    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                    if (amount === 0) return null;
                    
                    return (
                      <div key={cat} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat]}`} />
                            <span className="font-bold text-slate-700 dark:text-slate-300">{cat}</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-slate-900 dark:text-white">{formatCurrency(amount)}</span>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`${CATEGORY_COLORS[cat]} h-full rounded-full`}
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Historial de Transacciones</h2>
              <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full uppercase tracking-widest">
                {expenses.length} Transacciones
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-5">Fecha</th>
                    <th className="px-8 py-5">Nombre del Gasto</th>
                    <th className="px-8 py-5">Categoría</th>
                    <th className="px-8 py-5 text-right">Monto</th>
                    <th className="px-8 py-5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group"
                        >
                          <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {new Date(exp.date).toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white">
                            {exp.name}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center ${CATEGORY_LIGHT_COLORS[exp.category]}`}>
                              {exp.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-right text-slate-900 dark:text-white">
                            {formatCurrency(exp.amount)}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <button 
                              onClick={() => deleteExpense(exp.id)}
                              className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
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
      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium space-y-2">
        <p>© {new Date().getFullYear()} SpendWise • Tu gestor de finanzas personales</p>
        <div className="flex flex-col items-center space-y-1">
          <p className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
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

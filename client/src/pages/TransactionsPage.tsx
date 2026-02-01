import { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';
import type { Transaction, Category, TransactionFilters } from '../types';
import './TransactionsPage.css';

interface TransactionsPageProps {
  categories: Category[];
}

export default function TransactionsPage({ categories }: TransactionsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll(filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category_id) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        date: formData.date,
        description: formData.description || undefined
      };

      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, transactionData);
      } else {
        await transactionService.create(transactionData);
      }

      await loadTransactions();
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save transaction');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) {
      return;
    }

    try {
      await transactionService.delete(id);
      await loadTransactions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category_id: transaction.category_id.toString(),
        date: transaction.date,
        description: transaction.description || ''
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="transactions-page"><div className="loading">Carregando...</div></div>;
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>📝 Transações</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          + Nova Transação
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* Filtros */}
      <div className="filters">
        <select 
          value={filters.type || ''}
          onChange={(e) => setFilters({ ...filters, type: e.target.value as any || undefined })}
        >
          <option value="">Todos os tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>

        <select
          value={filters.category_id || ''}
          onChange={(e) => setFilters({ ...filters, category_id: e.target.value ? parseInt(e.target.value) : undefined })}
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="date"
          placeholder="Data inicial"
          value={filters.startDate || ''}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
        />

        <input
          type="date"
          placeholder="Data final"
          value={filters.endDate || ''}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
        />

        <button className="btn-secondary" onClick={() => setFilters({})}>
          Limpar Filtros
        </button>
      </div>

      {/* Tabela */}
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  Nenhuma transação encontrada
                </td>
              </tr>
            ) : (
              transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <span className={`badge badge-${transaction.type}`}>
                      {transaction.type === 'income' ? '💰 Receita' : '💸 Despesa'}
                    </span>
                  </td>
                  <td>{transaction.category_name}</td>
                  <td>{transaction.description || '-'}</td>
                  <td className={`amount amount-${transaction.type}`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => openModal(transaction)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(transaction.id)}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? 'Editar Transação' : 'Nova Transação'}</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    />
                    💰 Receita
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    />
                    💸 Despesa
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Data *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Compras no supermercado"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingTransaction ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

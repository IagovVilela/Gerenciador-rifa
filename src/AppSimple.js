import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Download, RotateCcw, Users, Hash, DollarSign, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

const RifaManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado principal da aplicação
  const [rifaConfig, setRifaConfig] = useState({
    totalNumbers: 300,
    rifaTitle: 'Grande Rifa Beneficente',
    prizeDescription: 'Prêmio Principal: R$ 5.000,00',
    numberPrice: 5.00
  });
  
  const [reservations, setReservations] = useState({});
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [showReservationNames, setShowReservationNames] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    notes: '',
    status: 'paid'
  });

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedReservations = localStorage.getItem('rifaReservations');
    const savedConfig = localStorage.getItem('rifaConfig');
    
    if (savedReservations) {
      try {
        setReservations(JSON.parse(savedReservations));
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
      }
    }
    
    if (savedConfig) {
      try {
        setRifaConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('rifaReservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('rifaConfig', JSON.stringify(rifaConfig));
  }, [rifaConfig]);

  // Autenticação simples
  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  // Gerar números da rifa
  const generateNumbers = () => {
    return Array.from({ length: rifaConfig.totalNumbers }, (_, i) => i + 1);
  };

  // Selecionar/deselecionar número
  const toggleNumberSelection = (number) => {
    if (reservations[number]) return; // Já reservado
    
    setSelectedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // Abrir modal para nova reserva
  const openReservationModal = () => {
    if (selectedNumbers.length === 0) {
      alert('Selecione pelo menos um número!');
      return;
    }
    setShowModal(true);
    setEditingReservation(null);
    setFormData({ name: '', contact: '', notes: '', status: 'paid' });
  };

  // Editar reserva existente
  const editReservation = (number) => {
    const reservation = reservations[number];
    setEditingReservation(number);
    setFormData(reservation);
    setSelectedNumbers([number]);
    setShowModal(true);
  };

  // Salvar reserva
  const saveReservation = () => {
    if (!formData.name.trim()) {
      alert('Nome é obrigatório!');
      return;
    }

    const newReservations = { ...reservations };
    const timestamp = new Date().toISOString();
    
    selectedNumbers.forEach(number => {
      newReservations[number] = {
        ...formData,
        number,
        createdAt: editingReservation ? reservations[number].createdAt : timestamp,
        updatedAt: timestamp
      };
    });

    setReservations(newReservations);
    setSelectedNumbers([]);
    setShowModal(false);
    setFormData({ name: '', contact: '', notes: '', status: 'paid' });
  };

  // Deletar reserva
  const deleteReservation = (number) => {
    if (window.confirm(`Confirma a exclusão da reserva do número ${number}?`)) {
      const newReservations = { ...reservations };
      delete newReservations[number];
      setReservations(newReservations);
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    }
  };

  // Reset da cartela
  const resetRifa = () => {
    if (window.confirm('Confirma o reset completo da cartela? Esta ação não pode ser desfeita!')) {
      setReservations({});
      setSelectedNumbers([]);
      setShowModal(false);
      setEditingReservation(null);
      setFormData({ name: '', contact: '', notes: '', status: 'paid' });
    }
  };

  // Exportar dados CSV
  const exportToCSV = () => {
    const csvData = Object.values(reservations).map(res => ({
      numero: res.number,
      nome: res.name,
      contato: res.contact || '',
      observacoes: res.notes || '',
      status: res.status,
      data_reserva: new Date(res.createdAt).toLocaleDateString('pt-BR')
    }));

    const headers = ['Número', 'Nome', 'Contato', 'Observações', 'Status', 'Data da Reserva'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rifa_${rifaConfig.rifaTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estatísticas
  const stats = {
    sold: Object.keys(reservations).length,
    available: rifaConfig.totalNumbers - Object.keys(reservations).length,
    pending: Object.values(reservations).filter(r => r.status === 'pending').length,
    paid: Object.values(reservations).filter(r => r.status === 'paid').length,
    cancelled: Object.values(reservations).filter(r => r.status === 'cancelled').length,
    totalRevenue: Object.keys(reservations).length * (rifaConfig.numberPrice || 5.00),
    paidRevenue: Object.values(reservations).filter(r => r.status === 'paid').length * (rifaConfig.numberPrice || 5.00),
    pendingRevenue: Object.values(reservations).filter(r => r.status === 'pending').length * (rifaConfig.numberPrice || 5.00)
  };

  // Filtrar reservas
  const getFilteredReservations = () => {
    let filtered = Object.values(reservations);
    
    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.number.toString().includes(searchTerm)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(res => res.status === filterStatus);
    }
    
    return filtered.sort((a, b) => a.number - b.number);
  };

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Lock className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Acesso Administrativo</h2>
            <p className="text-gray-600 mt-2">Digite a senha para acessar o sistema</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Senha de administrador"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Entrar
            </button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Senha padrão: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{rifaConfig.rifaTitle}</h1>
              <p className="text-gray-600">{rifaConfig.prizeDescription}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              <Unlock className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Hash className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{rifaConfig.totalNumbers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Arrecadado</p>
                <p className="text-lg font-bold text-gray-900">R$ {stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Disponíveis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pagos</p>
                <p className="text-lg font-bold text-gray-900">R$ {stats.paidRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">({stats.paid} números)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-lg font-bold text-gray-900">R$ {stats.pendingRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">({stats.pending} números)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">✕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cancelados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={openReservationModal}
                disabled={selectedNumbers.length === 0}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <Plus className="h-4 w-4" />
                Reservar ({selectedNumbers.length})
              </button>
              
              <button
                onClick={() => setShowReservationNames(!showReservationNames)}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                {showReservationNames ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showReservationNames ? 'Ocultar Nomes' : 'Mostrar Nomes'}
              </button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
              
              <button
                onClick={resetRifa}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {selectedNumbers.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedNumbers.length} selecionado(s): {selectedNumbers.sort((a, b) => a - b).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Números */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Cartela da Rifa (R$ {(rifaConfig.numberPrice || 5.00).toFixed(2)} cada número)</h3>
            <div className="text-sm text-gray-600">
              <span className="inline-block w-4 h-4 bg-green-100 border border-green-300 rounded mr-1"></span> Pago
              <span className="inline-block w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-1 ml-3"></span> Pendente
              <span className="inline-block w-4 h-4 bg-red-100 border border-red-300 rounded mr-1 ml-3"></span> Cancelado
              <span className="inline-block w-4 h-4 bg-blue-200 border border-blue-400 rounded mr-1 ml-3"></span> Selecionado
            </div>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 xl:grid-cols-25 gap-1">
            {generateNumbers().map(number => {
              const isReserved = reservations[number];
              const isSelected = selectedNumbers.includes(number);
              const reservation = reservations[number];
              
              let bgColor = 'bg-gray-100 hover:bg-gray-200 border-gray-300';
              
              if (isSelected) {
                bgColor = 'bg-blue-200 border-blue-400';
              } else if (isReserved) {
                switch (reservation?.status) {
                  case 'paid':
                    bgColor = 'bg-green-100 border-green-300';
                    break;
                  case 'pending':
                    bgColor = 'bg-yellow-100 border-yellow-300';
                    break;
                  case 'cancelled':
                    bgColor = 'bg-red-100 border-red-300';
                    break;
                  default:
                    bgColor = 'bg-gray-200 border-gray-400';
                }
              }
              
              return (
                <div
                  key={number}
                  className={`
                    relative aspect-square border-2 rounded-lg font-semibold text-xs transition duration-200
                    ${bgColor}
                    flex flex-col items-center justify-center p-1
                  `}
                  title={isReserved ? `${reservation.name}${reservation.contact ? ` - ${reservation.contact}` : ''}` : `Número ${number}`}
                >
                  <button
                    onClick={() => !isReserved && toggleNumberSelection(number)}
                    disabled={isReserved}
                    className={`
                      w-full h-full flex flex-col items-center justify-center
                      ${isReserved ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <span className="font-bold">{number}</span>
                    {isReserved && showReservationNames && (
                      <span className="text-xs text-gray-600 truncate w-full text-center">
                        {reservation.name.split(' ')[0]}
                      </span>
                    )}
                  </button>
                  
                  {isReserved && (
                    <div className="absolute -top-1 -right-1 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          editReservation(number);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition duration-200"
                        title="Editar"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteReservation(number);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition duration-200"
                        title="Excluir"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de Reservas */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Lista de Reservas</h3>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="paid">Pagos</option>
                <option value="pending">Pendentes</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Número</th>
                  <th className="text-left py-2 px-3">Nome</th>
                  <th className="text-left py-2 px-3">Contato</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Data</th>
                  <th className="text-left py-2 px-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredReservations().map(reservation => (
                  <tr key={reservation.number} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 font-semibold">{reservation.number}</td>
                    <td className="py-2 px-3">{reservation.name}</td>
                    <td className="py-2 px-3">{reservation.contact || '-'}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        reservation.status === 'paid' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status === 'paid' ? 'Pago' :
                         reservation.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => editReservation(reservation.number)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition duration-200"
                          title="Editar"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteReservation(reservation.number)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition duration-200"
                          title="Excluir"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {getFilteredReservations().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma reserva encontrada.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingReservation ? 'Editar Reserva' : 'Nova Reserva'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Números selecionados
                  </label>
                  <div className="bg-gray-100 p-2 rounded border text-sm">
                    {selectedNumbers.sort((a, b) => a - b).join(', ')}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do comprador *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contato
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Telefone, e-mail, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="paid">Pago</option>
                    <option value="pending">Pendente</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais..."
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedNumbers([]);
                    setEditingReservation(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveReservation}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RifaManager;

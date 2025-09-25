import React, { useState, useEffect } from 'react';

function App() {
  const [reservations, setReservations] = useState({});
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    status: 'paid'
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rifaReservations');
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('rifaReservations', JSON.stringify(reservations));
  }, [reservations]);

  // Gerar números da rifa (1 a 300)
  const generateNumbers = () => {
    return Array.from({ length: 300 }, (_, i) => i + 1);
  };

  // Selecionar número
  const toggleNumber = (number) => {
    if (reservations[number]) return; // Já reservado
    
    setSelectedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // Abrir modal
  const openModal = () => {
    if (selectedNumbers.length === 0) {
      alert('Selecione pelo menos um número!');
      return;
    }
    setShowModal(true);
  };

  // Salvar reserva
  const saveReservation = () => {
    if (!formData.name.trim()) {
      alert('Nome é obrigatório!');
      return;
    }

    const newReservations = { ...reservations };
    selectedNumbers.forEach(number => {
      newReservations[number] = {
        ...formData,
        number,
        createdAt: new Date().toISOString()
      };
    });

    setReservations(newReservations);
    setSelectedNumbers([]);
    setShowModal(false);
    setFormData({ name: '', contact: '', status: 'paid' });
  };

  // Deletar reserva
  const deleteReservation = (number) => {
    if (window.confirm(`Confirma a exclusão da reserva do número ${number}?`)) {
      const newReservations = { ...reservations };
      delete newReservations[number];
      setReservations(newReservations);
    }
  };

  // Reset
  const resetRifa = () => {
    if (window.confirm('Confirma o reset completo da cartela?')) {
      setReservations({});
      setSelectedNumbers([]);
    }
  };

  // Estatísticas
  const stats = {
    sold: Object.keys(reservations).length,
    available: 300 - Object.keys(reservations).length,
    paid: Object.values(reservations).filter(r => r.status === 'paid').length,
    pending: Object.values(reservations).filter(r => r.status === 'pending').length
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Gerenciador de Rifa</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Prêmio Principal: R$ 5.000,00</p>
      </div>

      {/* Estatísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Total</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>300</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Vendidos</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats.sold}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Disponíveis</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{stats.available}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Pagos</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats.paid}</p>
        </div>
      </div>

      {/* Controles */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={openModal}
            disabled={selectedNumbers.length === 0}
            style={{
              backgroundColor: selectedNumbers.length === 0 ? '#ccc' : '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: selectedNumbers.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Reservar ({selectedNumbers.length})
          </button>
          
          <button
            onClick={resetRifa}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reset
          </button>
          
          {selectedNumbers.length > 0 && (
            <span style={{ color: '#2563eb', fontSize: '14px' }}>
              Selecionados: {selectedNumbers.sort((a, b) => a - b).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Grid de Números */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Cartela da Rifa (R$ 5,00 cada número)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '5px' }}>
          {generateNumbers().map(number => {
            const isReserved = reservations[number];
            const isSelected = selectedNumbers.includes(number);
            const reservation = reservations[number];
            
            let backgroundColor = '#f3f4f6';
            let borderColor = '#d1d5db';
            let color = '#374151';
            
            if (isSelected) {
              backgroundColor = '#dbeafe';
              borderColor = '#3b82f6';
            } else if (isReserved) {
              if (reservation?.status === 'paid') {
                backgroundColor = '#dcfce7';
                borderColor = '#16a34a';
              } else if (reservation?.status === 'pending') {
                backgroundColor = '#fef3c7';
                borderColor = '#d97706';
              } else {
                backgroundColor = '#fee2e2';
                borderColor = '#dc2626';
              }
            }
            
            return (
              <div
                key={number}
                style={{
                  aspectRatio: '1',
                  border: `2px solid ${borderColor}`,
                  borderRadius: '5px',
                  backgroundColor,
                  color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: isReserved ? 'default' : 'pointer',
                  position: 'relative',
                  padding: '2px'
                }}
                onClick={() => !isReserved && toggleNumber(number)}
                title={isReserved ? `${reservation.name}${reservation.contact ? ` - ${reservation.contact}` : ''}` : `Número ${number}`}
              >
                <span>{number}</span>
                {isReserved && (
                  <span style={{ fontSize: '8px', color: '#6b7280', textAlign: 'center' }}>
                    {reservation.name.split(' ')[0]}
                  </span>
                )}
                
                {isReserved && (
                  <div style={{ position: 'absolute', top: '2px', right: '2px', display: 'flex', gap: '2px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReservation(number);
                      }}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Excluir"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Reservas */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Lista de Reservas</h3>
        {Object.keys(reservations).length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>Nenhuma reserva ainda.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#374151' }}>Número</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#374151' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#374151' }}>Contato</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#374151' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '10px', color: '#374151' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(reservations)
                  .sort((a, b) => a.number - b.number)
                  .map(reservation => (
                    <tr key={reservation.number} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{reservation.number}</td>
                      <td style={{ padding: '10px' }}>{reservation.name}</td>
                      <td style={{ padding: '10px' }}>{reservation.contact || '-'}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: reservation.status === 'paid' ? '#dcfce7' : '#fef3c7',
                          color: reservation.status === 'paid' ? '#16a34a' : '#d97706'
                        }}>
                          {reservation.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontSize: '12px', color: '#6b7280' }}>
                        {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Nova Reserva</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: 'bold' }}>
                Números selecionados
              </label>
              <div style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>
                {selectedNumbers.sort((a, b) => a - b).join(', ')}
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: 'bold' }}>
                Nome do comprador *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Nome completo"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: 'bold' }}>
                Contato
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Telefone, e-mail, etc."
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: 'bold' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedNumbers([]);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={saveReservation}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

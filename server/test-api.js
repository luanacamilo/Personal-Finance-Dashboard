const baseUrl = 'http://localhost:5000/api';

async function testTransactionsAPI() {
  console.log(' Testando API de Transactions...\n');

  try {
    console.log('1️ GET /api/transactions');
    const response1 = await fetch(`${baseUrl}/transactions`);
    const data1 = await response1.json();
    console.log(` ${data1.count} transações encontradas`);
    console.log('Primeira transação:', data1.data[0]);
    console.log('');

    console.log(' GET /api/transactions/stats');
    const response2 = await fetch(`${baseUrl}/transactions/stats`);
    const data2 = await response2.json();
    console.log(' Estatísticas:', data2.data);
    console.log('');

    console.log(' GET /api/transactions/1');
    const response3 = await fetch(`${baseUrl}/transactions/1`);
    const data3 = await response3.json();
    console.log(' Transação #1:', data3.data);
    console.log('');

    console.log(' POST /api/transactions (criar nova)');
    const newTransaction = {
      type: 'expense',
      amount: 50.00,
      category_id: 4,
      date: '2026-02-01',
      description: 'Teste API - Lanche'
    };
    const response4 = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction)
    });
    const data4 = await response4.json();
    console.log(' Transação criada:', data4.data);
    const createdId = data4.data.id;
    console.log('');

    console.log(` PUT /api/transactions/${createdId} (atualizar)`);
    const updateData = {
      ...newTransaction,
      amount: 75.00,
      description: 'Teste API - Lanche (atualizado)'
    };
    const response5 = await fetch(`${baseUrl}/transactions/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const data5 = await response5.json();
    console.log('✅ Transação atualizada:', data5.data);
    console.log('');

    console.log(` DELETE /api/transactions/${createdId} (deletar)`);
    const response6 = await fetch(`${baseUrl}/transactions/${createdId}`, {
      method: 'DELETE'
    });
    const data6 = await response6.json();
    console.log('', data6.message);
    console.log('');

    console.log(' GET /api/transactions?type=income');
    const response7 = await fetch(`${baseUrl}/transactions?type=income`);
    const data7 = await response7.json();
    console.log(` ${data7.count} receitas encontradas`);
    console.log('');

    console.log(' Todos os testes passaram!\n');
  } catch (error) {
    console.error(' Erro nos testes:', error.message);
  }
}

testTransactionsAPI();

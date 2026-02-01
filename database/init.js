const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Criar banco de dados
const dbPath = path.join(__dirname, 'finance.db');
const db = new Database(dbPath);

console.log('📦 Recriando banco de dados com schema completo...\n');

try {
  // Ler o arquivo schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Executar o schema
  db.exec(schema);
  
  console.log('✅ Banco de dados criado com sucesso!');
  console.log('📍 Localização:', dbPath);
  console.log('\n📊 Estrutura criada:');
  console.log('   ✓ Tabela: categories (10 categorias padrão)');
  console.log('   ✓ Tabela: transactions (6 transações de exemplo)');
  console.log('   ✓ Tabela: budgets (5 orçamentos de exemplo)');
  console.log('   ✓ Views: v_current_balance, v_expenses_by_category, v_budget_status');
  console.log('\n💡 Abra o arquivo no Beekeeper Studio para visualizar!');
  
  // Mostrar alguns dados
  const balance = db.prepare('SELECT * FROM v_current_balance').get();
  console.log('\n💰 Balanço Atual:');
  console.log(`   Receitas: R$ ${balance.total_income.toFixed(2)}`);
  console.log(`   Despesas: R$ ${balance.total_expense.toFixed(2)}`);
  console.log(`   Saldo: R$ ${balance.balance.toFixed(2)}`);
  
} catch (error) {
  console.error('❌ Erro ao criar banco de dados:', error.message);
  process.exit(1);
}

db.close();

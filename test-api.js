// Teste da API do Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qixtamnvrexfjmfuejfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeHRhbW52cmV4ZmptZnVlamZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njc0NDIsImV4cCI6MjA3NDM0MzQ0Mn0.Ts1HHnXLOGjTKXxNDIpN0a77wh55bMeF17cHYCnA3MU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    // Testar inserção de dados
    const testData = {
      type: 'test',
      data: { message: 'Teste de conexão', timestamp: new Date().toISOString() }
    };
    
    const { data, error } = await supabase
      .from('rifa_data')
      .insert(testData);
    
    if (error) {
      console.error('❌ Erro:', error);
    } else {
      console.log('✅ Dados inseridos com sucesso!');
    }
    
    // Testar leitura de dados
    const { data: readData, error: readError } = await supabase
      .from('rifa_data')
      .select('*');
    
    if (readError) {
      console.error('❌ Erro na leitura:', readError);
    } else {
      console.log('✅ Dados lidos com sucesso:', readData);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testSupabase();

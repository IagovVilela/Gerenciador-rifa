// API alternativa usando Supabase (gratuito)
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (você precisa criar uma conta gratuita)
const supabaseUrl = process.env.SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-publica';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Buscar dados do Supabase
      const { data: reservationsData } = await supabase
        .from('rifa_data')
        .select('*')
        .eq('type', 'reservations')
        .single();

      const { data: configData } = await supabase
        .from('rifa_data')
        .select('*')
        .eq('type', 'config')
        .single();

      const reservations = reservationsData?.data || {};
      const config = configData?.data || {
        totalNumbers: 300,
        rifaTitle: 'Grande Rifa Beneficente',
        prizeDescription: 'Prêmio Principal: R$ 5.000,00',
        numberPrice: 5.00
      };

      res.status(200).json({ reservations, config });
    } else if (req.method === 'POST') {
      // Salvar dados no Supabase
      const { reservations, config } = req.body;
      
      if (reservations) {
        await supabase
          .from('rifa_data')
          .upsert({ type: 'reservations', data: reservations });
      }
      
      if (config) {
        await supabase
          .from('rifa_data')
          .upsert({ type: 'config', data: config });
      }
      
      res.status(200).json({ success: true });
    } else if (req.method === 'DELETE') {
      // Reset dados no Supabase
      await supabase
        .from('rifa_data')
        .delete()
        .eq('type', 'reservations');
      
      await supabase
        .from('rifa_data')
        .delete()
        .eq('type', 'config');
      
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

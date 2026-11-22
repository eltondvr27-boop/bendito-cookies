import { supabase } from './supabase';

export async function uploadMediaToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('midia-loja')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert(`Erro no upload para o Supabase: ${uploadError.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('midia-loja')
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      alert('Erro ao obter URL pública do Supabase.');
      return null;
    }

    return publicUrlData.publicUrl;
  } catch (err: any) {
    alert(`Erro ao enviar arquivo: ${err.message || err}`);
    return null;
  }
}

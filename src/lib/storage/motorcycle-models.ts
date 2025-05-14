
import { MotorcycleModel } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getMotorcycleModels(): Promise<MotorcycleModel[]> {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Erro ao buscar modelos:', error);
      return [];
    }
    
    console.log('Modelos obtidos do banco:', data);
    
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand || ""
    }));
  } catch (error) {
    console.error('Erro ao acessar tabela de modelos:', error);
    return [];
  }
}

export async function addMotorcycleModel(model: Omit<MotorcycleModel, "id">): Promise<MotorcycleModel[]> {
  if (!model.name) {
    throw new Error("Nome do modelo é obrigatório");
  }
  
  try {
    console.log('Adicionando modelo:', model);
    
    const { error } = await supabase
      .from('motorcycle_models')
      .insert([{
        name: model.name,
        brand: model.brand || ""
      }]);

    if (error) {
      console.error('Erro ao adicionar modelo:', error);
      throw error;
    }

    return getMotorcycleModels();
  } catch (error) {
    console.error('Erro em addMotorcycleModel:', error);
    throw error;
  }
}

export async function updateMotorcycleModel(model: MotorcycleModel): Promise<MotorcycleModel[]> {
  if (!model.name) {
    throw new Error("Nome do modelo é obrigatório");
  }
  
  try {
    console.log('Atualizando modelo:', model);
    
    const { error } = await supabase
      .from('motorcycle_models')
      .update({
        name: model.name,
        brand: model.brand || ""
      })
      .eq('id', model.id);

    if (error) {
      console.error('Erro ao atualizar modelo:', error);
      throw error;
    }

    return getMotorcycleModels();
  } catch (error) {
    console.error('Erro em updateMotorcycleModel:', error);
    throw error;
  }
}

export async function deleteMotorcycleModel(id: string): Promise<MotorcycleModel[]> {
  try {
    console.log('Excluindo modelo com ID:', id);
    
    const { error } = await supabase
      .from('motorcycle_models')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir modelo:', error);
      throw error;
    }

    return getMotorcycleModels();
  } catch (error) {
    console.error('Erro em deleteMotorcycleModel:', error);
    throw error;
  }
}

// New function to populate the database with motorcycle models
export async function populateModelsIfEmpty(): Promise<boolean> {
  try {
    // Check if the table has any entries
    const { count, error } = await supabase
      .from('motorcycle_models')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Erro ao verificar modelos existentes:', error);
      return false;
    }
    
    // If there are already models, don't populate
    if (count && count > 0) {
      console.log('Tabela já possui modelos, pulando importação');
      return true;
    }
    
    // Import from motorcycle-models-data.ts
    const { populateMotorcycleModels } = await import('../motorcycle-models-data');
    return await populateMotorcycleModels();
  } catch (error) {
    console.error('Erro ao verificar e importar modelos:', error);
    return false;
  }
}

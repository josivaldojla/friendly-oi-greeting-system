
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

// Nova função para buscar um modelo específico pelo ID
export async function getMotorcycleModelById(id: string): Promise<MotorcycleModel | null> {
  try {
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Erro ao buscar modelo por ID:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      brand: data.brand || ""
    };
  } catch (error) {
    console.error('Erro ao acessar modelo específico:', error);
    return null;
  }
}

export async function addMotorcycleModel(model: Omit<MotorcycleModel, "id">): Promise<MotorcycleModel[]> {
  if (!model.name) {
    throw new Error("Nome do modelo é obrigatório");
  }
  
  try {
    console.log('Adicionando modelo:', model);
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const { error } = await supabase
      .from('motorcycle_models')
      .insert([{
        name: model.name,
        brand: model.brand || "",
        created_by: user.id
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

// Nova função para excluir todos os modelos de uma marca
export async function deleteModelsByBrand(brand: string): Promise<MotorcycleModel[]> {
  try {
    console.log('Excluindo todos os modelos da marca:', brand);
    
    const { error } = await supabase
      .from('motorcycle_models')
      .delete()
      .eq('brand', brand);

    if (error) {
      console.error('Erro ao excluir modelos da marca:', error);
      throw error;
    }

    return getMotorcycleModels();
  } catch (error) {
    console.error('Erro em deleteModelsByBrand:', error);
    throw error;
  }
}

// Nova função para remover modelos duplicados
export async function removeDuplicateModels(): Promise<MotorcycleModel[]> {
  try {
    console.log('Removendo modelos duplicados...');
    
    // Buscar todos os modelos
    const allModels = await getMotorcycleModels();
    
    // Agrupar por nome e marca (case insensitive)
    const modelGroups = new Map<string, MotorcycleModel[]>();
    
    allModels.forEach(model => {
      const key = `${model.name.toLowerCase().trim()}-${(model.brand || '').toLowerCase().trim()}`;
      if (!modelGroups.has(key)) {
        modelGroups.set(key, []);
      }
      modelGroups.get(key)!.push(model);
    });
    
    // Identificar duplicatas e manter apenas o primeiro de cada grupo
    const duplicatesToDelete: string[] = [];
    
    modelGroups.forEach((models, key) => {
      if (models.length > 1) {
        // Ordenar por data de criação (id mais antigo primeiro) e manter o primeiro
        models.sort((a, b) => a.id.localeCompare(b.id));
        // Adicionar os demais à lista de exclusão
        duplicatesToDelete.push(...models.slice(1).map(m => m.id));
      }
    });
    
    if (duplicatesToDelete.length === 0) {
      console.log('Nenhum modelo duplicado encontrado');
      return allModels;
    }
    
    console.log(`Encontrados ${duplicatesToDelete.length} modelos duplicados para excluir`);
    
    // Excluir os duplicados
    const { error } = await supabase
      .from('motorcycle_models')
      .delete()
      .in('id', duplicatesToDelete);

    if (error) {
      console.error('Erro ao excluir modelos duplicados:', error);
      throw error;
    }

    console.log(`${duplicatesToDelete.length} modelos duplicados removidos com sucesso`);
    return getMotorcycleModels();
  } catch (error) {
    console.error('Erro em removeDuplicateModels:', error);
    throw error;
  }
}

// Function to manually populate models - only when explicitly requested
export async function populateModelsManually(): Promise<boolean> {
  try {
    console.log('Populando modelos manualmente...');
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Usuário não autenticado, não é possível popular modelos');
      return false;
    }
    
    // Import and run the populate function
    const { populateMotorcycleModels } = await import('../motorcycle-models-data');
    return await populateMotorcycleModels();
  } catch (error) {
    console.error('Erro ao popular modelos manualmente:', error);
    return false;
  }
}

// Removed the automatic population function - models will only be added when explicitly requested

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

// Função melhorada para remover modelos duplicados
export async function removeDuplicateModels(): Promise<MotorcycleModel[]> {
  try {
    console.log('Iniciando remoção de modelos duplicados...');
    
    // Buscar todos os modelos diretamente do banco
    const { data: allModels, error } = await supabase
      .from('motorcycle_models')
      .select('*')
      .order('created_at'); // Ordenar por data de criação para manter o mais antigo
    
    if (error) {
      console.error('Erro ao buscar modelos:', error);
      throw error;
    }
    
    if (!allModels || allModels.length === 0) {
      console.log('Nenhum modelo encontrado');
      return [];
    }
    
    console.log(`Total de modelos encontrados: ${allModels.length}`);
    
    // Agrupar modelos por nome + marca (case insensitive e normalizado)
    const modelMap = new Map<string, any[]>();
    
    allModels.forEach(model => {
      const normalizedName = (model.name || '').toLowerCase().trim();
      const normalizedBrand = (model.brand || '').toLowerCase().trim();
      const key = `${normalizedName}|||${normalizedBrand}`; // Usar ||| como separador único
      
      if (!modelMap.has(key)) {
        modelMap.set(key, []);
      }
      modelMap.get(key)!.push(model);
    });
    
    // Identificar duplicatas (grupos com mais de 1 modelo)
    const duplicatesToDelete: string[] = [];
    let duplicateGroupsCount = 0;
    
    modelMap.forEach((models, key) => {
      if (models.length > 1) {
        duplicateGroupsCount++;
        console.log(`Grupo duplicado encontrado para "${key}": ${models.length} modelos`);
        console.log('Modelos:', models.map(m => `${m.name} (${m.brand}) - ID: ${m.id}`));
        
        // Ordenar por created_at e manter apenas o primeiro (mais antigo)
        models.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
        // Adicionar todos exceto o primeiro à lista de exclusão
        const toDelete = models.slice(1);
        duplicatesToDelete.push(...toDelete.map(m => m.id));
        
        console.log(`Mantendo: ${models[0].name} (${models[0].brand}) - ID: ${models[0].id}`);
        console.log(`Excluindo: ${toDelete.map(m => `${m.name} (${m.brand}) - ID: ${m.id}`).join(', ')}`);
      }
    });
    
    if (duplicatesToDelete.length === 0) {
      console.log('Nenhum modelo duplicado encontrado');
      return getMotorcycleModels();
    }
    
    console.log(`Encontrados ${duplicateGroupsCount} grupos de duplicatas com total de ${duplicatesToDelete.length} modelos para excluir`);
    console.log('IDs a serem excluídos:', duplicatesToDelete);
    
    // Excluir os duplicados em lotes para evitar problemas de limite de query
    const batchSize = 50;
    for (let i = 0; i < duplicatesToDelete.length; i += batchSize) {
      const batch = duplicatesToDelete.slice(i, i + batchSize);
      console.log(`Excluindo lote ${Math.floor(i/batchSize) + 1}: ${batch.length} modelos`);
      
      const { error: deleteError } = await supabase
        .from('motorcycle_models')
        .delete()
        .in('id', batch);

      if (deleteError) {
        console.error('Erro ao excluir lote de modelos duplicados:', deleteError);
        throw deleteError;
      }
    }

    console.log(`${duplicatesToDelete.length} modelos duplicados removidos com sucesso!`);
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

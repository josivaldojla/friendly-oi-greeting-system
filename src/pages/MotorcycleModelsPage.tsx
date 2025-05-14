
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMotorcycleModels, addMotorcycleModel, updateMotorcycleModel, deleteMotorcycleModel } from "@/lib/storage";
import { MotorcycleModel } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MotorcycleModelForm } from "@/components/motorcycle-models/MotorcycleModelForm";
import { MotorcycleModelsTable } from "@/components/motorcycle-models/MotorcycleModelsTable";
import { DeleteModelDialog } from "@/components/motorcycle-models/DeleteModelDialog";
import { EmptyModelsPlaceholder } from "@/components/motorcycle-models/EmptyModelsPlaceholder";
import { BrandFilterButtons } from "@/components/motorcycle-models/BrandFilterButtons";

const MotorcycleModelsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<MotorcycleModel | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Consulta para buscar todos os modelos
  const { data: motorcycleModels = [], isLoading } = useQuery({
    queryKey: ['motorcycleModels'],
    queryFn: getMotorcycleModels
  });
  
  // Filtra os modelos pela marca selecionada (se houver)
  const filteredModels = selectedBrand
    ? motorcycleModels.filter(model => model.brand?.toLowerCase() === selectedBrand.toLowerCase())
    : motorcycleModels;
  
  // Extrai as marcas únicas para os botões de filtro
  const uniqueBrands = Array.from(
    new Set(motorcycleModels.map(model => model.brand).filter(Boolean) as string[])
  ).sort();
  
  // Mutação para adicionar um modelo
  const addModelMutation = useMutation({
    mutationFn: addMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast.success("Modelo adicionado com sucesso");
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar modelo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Mutação para atualizar um modelo
  const updateModelMutation = useMutation({
    mutationFn: updateMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast.success("Modelo atualizado com sucesso");
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar modelo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Mutação para excluir um modelo
  const deleteModelMutation = useMutation({
    mutationFn: deleteMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast.success("Modelo excluído com sucesso");
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir modelo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Handlers
  const handleAddModel = (model: Omit<MotorcycleModel, "id">) => {
    addModelMutation.mutate(model);
  };
  
  const handleUpdateModel = (model: MotorcycleModel) => {
    updateModelMutation.mutate(model);
  };
  
  const handleDeleteModel = () => {
    if (!currentModel) return;
    deleteModelMutation.mutate(currentModel.id);
  };
  
  const openEditDialog = (model: MotorcycleModel) => {
    setCurrentModel(model);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (model: MotorcycleModel) => {
    setCurrentModel(model);
    setIsDeleteDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setCurrentModel(null);
    setIsAddDialogOpen(true);
  };
  
  const handleBrandFilter = (brand: string | null) => {
    setSelectedBrand(brand);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Modelos de Motos</h2>
          <Button onClick={openAddDialog}>Adicionar Modelo</Button>
        </div>
        
        {/* Filtro de Marcas */}
        <BrandFilterButtons 
          brands={uniqueBrands} 
          selectedBrand={selectedBrand} 
          onSelectBrand={handleBrandFilter} 
        />
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="text-lg">Carregando...</div>
          </div>
        ) : filteredModels.length === 0 ? (
          <EmptyModelsPlaceholder onAddClick={openAddDialog} />
        ) : (
          <MotorcycleModelsTable 
            models={filteredModels}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}
      </div>
      
      {/* Formulário para adicionar modelo */}
      <MotorcycleModelForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddModel}
        isLoading={addModelMutation.isPending}
        mode="add"
      />
      
      {/* Formulário para editar modelo */}
      <MotorcycleModelForm
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateModel}
        currentModel={currentModel}
        isLoading={updateModelMutation.isPending}
        mode="edit"
      />
      
      {/* Diálogo para confirmar exclusão */}
      <DeleteModelDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteModel}
        model={currentModel}
        isLoading={deleteModelMutation.isPending}
      />
    </Layout>
  );
};

export default MotorcycleModelsPage;

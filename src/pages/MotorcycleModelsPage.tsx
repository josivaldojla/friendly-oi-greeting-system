import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMotorcycleModels, addMotorcycleModel, updateMotorcycleModel, deleteMotorcycleModel, deleteModelsByBrand, populateModelsManually } from "@/lib/storage";
import { MotorcycleModel } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MotorcycleModelForm } from "@/components/motorcycle-models/MotorcycleModelForm";
import { MotorcycleModelsTable } from "@/components/motorcycle-models/MotorcycleModelsTable";
import { DeleteModelDialog } from "@/components/motorcycle-models/DeleteModelDialog";
import { DeleteBrandDialog } from "@/components/motorcycle-models/DeleteBrandDialog";
import { EmptyModelsPlaceholder } from "@/components/motorcycle-models/EmptyModelsPlaceholder";
import { BrandFilterButtons } from "@/components/motorcycle-models/BrandFilterButtons";
import { BackupActions } from "@/components/motorcycle-models/BackupActions";
import { Package } from "lucide-react";

const MotorcycleModelsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteBrandDialogOpen, setIsDeleteBrandDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<MotorcycleModel | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Query to fetch all models
  const { data: motorcycleModels = [], isLoading } = useQuery({
    queryKey: ['motorcycleModels'],
    queryFn: getMotorcycleModels
  });
  
  // Filter models by selected brand (if any)
  const filteredModels = selectedBrand
    ? motorcycleModels.filter(model => 
        model.brand && model.brand.trim().toLowerCase() === selectedBrand.trim().toLowerCase()
      )
    : motorcycleModels;
  
  // Extract unique brands - improved logic
  const uniqueBrands = Array.from(
    new Set(
      motorcycleModels
        .filter(model => model.brand && typeof model.brand === 'string' && model.brand.trim() !== '')
        .map(model => model.brand.trim())
        .filter(brand => brand.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
  
  console.log('MotorcycleModelsPage - Total models:', motorcycleModels.length);
  console.log('MotorcycleModelsPage - Models data:', motorcycleModels);
  console.log('MotorcycleModelsPage - Unique brands found:', uniqueBrands);
  console.log('MotorcycleModelsPage - Currently selected brand:', selectedBrand);
  console.log('MotorcycleModelsPage - Filtered models count:', filteredModels.length);
  
  // Mutations
  const addModelMutation = useMutation({
    mutationFn: addMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast({
        title: "Sucesso",
        description: "Modelo adicionado com sucesso",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao adicionar modelo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  });
  
  const updateModelMutation = useMutation({
    mutationFn: updateMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast({
        title: "Sucesso",
        description: "Modelo atualizado com sucesso",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao atualizar modelo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteModelMutation = useMutation({
    mutationFn: deleteMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast({
        title: "Sucesso",
        description: "Modelo excluído com sucesso",
      });
      setIsDeleteDialogOpen(false);
      
      if (selectedBrand && 
        !motorcycleModels.some(model => 
          model.brand?.toLowerCase() === selectedBrand.toLowerCase() && 
          model.id !== currentModel?.id
        )
      ) {
        setSelectedBrand(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao excluir modelo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteBrandMutation = useMutation({
    mutationFn: deleteModelsByBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast({
        title: "Sucesso",
        description: `Marca "${brandToDelete}" e todos os seus modelos foram excluídos`,
      });
      setIsDeleteBrandDialogOpen(false);
      setBrandToDelete(null);
      
      if (selectedBrand === brandToDelete) {
        setSelectedBrand(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao excluir marca: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  });

  const populateModelsMutation = useMutation({
    mutationFn: populateModelsManually,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
        toast({
          title: "Sucesso",
          description: "Modelos padrão adicionados com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao adicionar modelos padrão",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Erro ao adicionar modelos padrão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
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

  const handleDeleteBrand = (brand: string) => {
    setBrandToDelete(brand);
    setIsDeleteBrandDialogOpen(true);
  };

  const confirmDeleteBrand = () => {
    if (!brandToDelete) return;
    deleteBrandMutation.mutate(brandToDelete);
  };

  const getModelCountForBrand = (brand: string) => {
    return motorcycleModels.filter(model => model.brand?.toLowerCase() === brand.toLowerCase()).length;
  };

  const handlePopulateModels = () => {
    populateModelsMutation.mutate();
  };

  return (
    <Layout>
      <div className="space-y-4 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Modelos de Motos</h2>
            <Button 
              onClick={openAddDialog}
              className="w-full sm:w-auto"
              size="sm"
            >
              Adicionar Modelo
            </Button>
          </div>
          
          {/* Backup Actions */}
          <div className="w-full">
            <BackupActions />
          </div>
        </div>
        
        {/* Brand Filter Section */}
        {!isLoading && motorcycleModels.length > 0 && uniqueBrands.length > 0 && (
          <BrandFilterButtons 
            brands={uniqueBrands} 
            selectedBrand={selectedBrand} 
            onSelectBrand={handleBrandFilter}
            onDeleteBrand={handleDeleteBrand}
            motorcycleModels={motorcycleModels}
          />
        )}
        
        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="text-lg">Carregando...</div>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="space-y-4">
            <EmptyModelsPlaceholder onAddClick={openAddDialog} />
            {motorcycleModels.length === 0 && (
              <div className="flex justify-center">
                <Button 
                  onClick={handlePopulateModels}
                  disabled={populateModelsMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Package className="h-4 w-4" />
                  {populateModelsMutation.isPending ? 'Adicionando...' : 'Adicionar Modelos Padrão'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <MotorcycleModelsTable 
              models={filteredModels}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          </div>
        )}
      </div>
      
      <MotorcycleModelForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddModel}
        isLoading={addModelMutation.isPending}
        mode="add"
      />
      
      <MotorcycleModelForm
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateModel}
        currentModel={currentModel}
        isLoading={updateModelMutation.isPending}
        mode="edit"
      />
      
      <DeleteModelDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteModel}
        model={currentModel}
        isLoading={deleteModelMutation.isPending}
      />
      
      <DeleteBrandDialog
        isOpen={isDeleteBrandDialogOpen}
        onOpenChange={setIsDeleteBrandDialogOpen}
        onConfirm={confirmDeleteBrand}
        brand={brandToDelete}
        modelCount={brandToDelete ? getModelCountForBrand(brandToDelete) : 0}
        isLoading={deleteBrandMutation.isPending}
      />
    </Layout>
  );
};

export default MotorcycleModelsPage;

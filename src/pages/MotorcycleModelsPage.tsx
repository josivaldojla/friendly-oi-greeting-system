
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMotorcycleModels, addMotorcycleModel, updateMotorcycleModel, deleteMotorcycleModel, deleteModelsByBrand, removeDuplicateModels } from "@/lib/storage";
import { addModelsFromImages } from "@/lib/motorcycle-models-data";
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
import { SuspensionOilDialog } from "@/components/motorcycle-models/SuspensionOilDialog";
import { AlertTriangle, Trash2 } from "lucide-react";

const MotorcycleModelsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteBrandDialogOpen, setIsDeleteBrandDialogOpen] = useState(false);
  const [isOilDialogOpen, setIsOilDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<MotorcycleModel | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [hasAutoPopulated, setHasAutoPopulated] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Query to fetch all models
  const { data: motorcycleModels = [], isLoading } = useQuery({
    queryKey: ['motorcycleModels'],
    queryFn: getMotorcycleModels
  });

  // Auto-populate models from images when component loads
  useEffect(() => {
    const autoPopulateModels = async () => {
      if (!hasAutoPopulated && !isLoading && motorcycleModels.length >= 0) {
        console.log('Auto-populating models from images...');
        try {
          const success = await addModelsFromImages();
          if (success) {
            console.log('Models from images added successfully');
            queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
            toast({
              title: "Modelos Adicionados",
              description: "Novos modelos das imagens foram adicionados automaticamente",
            });
          }
        } catch (error) {
          console.error('Error auto-populating models:', error);
        }
        setHasAutoPopulated(true);
      }
    };

    autoPopulateModels();
  }, [motorcycleModels, isLoading, hasAutoPopulated, queryClient, toast]);
  
  console.log('=== MotorcycleModelsPage: Data Analysis ===');
  console.log('Total models loaded:', motorcycleModels.length);
  console.log('Models data:', JSON.stringify(motorcycleModels, null, 2));
  
  // Filter models by selected brand (if any)
  const filteredModels = selectedBrand
    ? motorcycleModels.filter(model => {
        const modelBrand = model.brand?.trim();
        const filterBrand = selectedBrand.trim();
        const matches = modelBrand && modelBrand.toLowerCase() === filterBrand.toLowerCase();
        console.log(`Filtering model "${model.name}": brand="${modelBrand}" vs filter="${filterBrand}" = ${matches}`);
        return matches;
      })
    : motorcycleModels;
  
  console.log('Selected brand for filtering:', selectedBrand);
  console.log('Filtered models count:', filteredModels.length);
  console.log('=== End MotorcycleModelsPage: Data Analysis ===');
  
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

  const removeDuplicatesMutation = useMutation({
    mutationFn: removeDuplicateModels,
    onSuccess: (updatedModels) => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      const originalCount = motorcycleModels.length;
      const newCount = updatedModels.length;
      const removedCount = originalCount - newCount;
      
      if (removedCount > 0) {
        toast({
          title: "Duplicatas Removidas!",
          description: `${removedCount} modelos duplicados foram removidos com sucesso. Total restante: ${newCount} modelos.`,
        });
      } else {
        toast({
          title: "Nenhuma Duplicata",
          description: "Não foram encontrados modelos duplicados para remover.",
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao remover duplicatas:', error);
      toast({
        title: "Erro",
        description: `Erro ao remover duplicatas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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

  const openOilDialog = (model: MotorcycleModel) => {
    setCurrentModel(model);
    setIsOilDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setCurrentModel(null);
    setIsAddDialogOpen(true);
  };
  
  const handleBrandFilter = (brand: string | null) => {
    console.log('Brand filter changed to:', brand);
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

  const handleRemoveDuplicates = () => {
    const duplicateCount = getDuplicateCount();
    if (duplicateCount === 0) {
      toast({
        title: "Nenhuma Duplicata",
        description: "Não foram encontrados modelos duplicados.",
      });
      return;
    }
    
    console.log(`Iniciando remoção de aproximadamente ${duplicateCount} duplicatas...`);
    removeDuplicatesMutation.mutate();
  };

  // Função para contar duplicatas aproximadas
  const getDuplicateCount = () => {
    const seen = new Set<string>();
    let duplicates = 0;
    
    motorcycleModels.forEach(model => {
      const key = `${model.name.toLowerCase().trim()}|||${(model.brand || '').toLowerCase().trim()}`;
      if (seen.has(key)) {
        duplicates++;
      } else {
        seen.add(key);
      }
    });
    
    return duplicates;
  };

  const duplicateCount = getDuplicateCount();

  return (
    <Layout>
      <div className="space-y-4 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Modelos de Motos</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              {duplicateCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  {duplicateCount} duplicata{duplicateCount > 1 ? 's' : ''} encontrada{duplicateCount > 1 ? 's' : ''}
                </div>
              )}
              <Button 
                onClick={handleRemoveDuplicates}
                disabled={removeDuplicatesMutation.isPending || duplicateCount === 0}
                variant={duplicateCount > 0 ? "destructive" : "outline"}
                className="flex items-center gap-2"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
                {removeDuplicatesMutation.isPending 
                  ? 'Removendo...' 
                  : duplicateCount > 0 
                    ? `Remover ${duplicateCount} Duplicata${duplicateCount > 1 ? 's' : ''}` 
                    : 'Sem Duplicatas'
                }
              </Button>
              <Button 
                onClick={openAddDialog}
                className="w-full sm:w-auto"
                size="sm"
              >
                Adicionar Modelo
              </Button>
            </div>
          </div>
          
          {/* Backup Actions */}
          <div className="w-full">
            <BackupActions />
          </div>
        </div>
        
        {/* Brand Filter Section - Always show if we have models */}
        {!isLoading && motorcycleModels.length > 0 && (
          <BrandFilterButtons 
            brands={[]} // We don't use this prop anymore, brands are extracted inside the component
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
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <MotorcycleModelsTable 
              models={filteredModels}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onViewOilData={openOilDialog}
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

      <SuspensionOilDialog
        isOpen={isOilDialogOpen}
        onOpenChange={setIsOilDialogOpen}
        model={currentModel}
      />
    </Layout>
  );
};

export default MotorcycleModelsPage;

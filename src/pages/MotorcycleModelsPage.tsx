
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMotorcycleModels, addMotorcycleModel, updateMotorcycleModel, deleteMotorcycleModel, deleteModelsByBrand } from "@/lib/storage";
import { addModelsFromImages } from "@/lib/motorcycle-models-data";
import { MotorcycleModel } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { MotorcycleModelsHeader } from "@/components/motorcycle-models/MotorcycleModelsHeader";
import { MotorcycleModelsSearchAndFilter } from "@/components/motorcycle-models/MotorcycleModelsSearchAndFilter";
import { MotorcycleModelsContent } from "@/components/motorcycle-models/MotorcycleModelsContent";
import { MotorcycleModelsDialogs } from "@/components/motorcycle-models/MotorcycleModelsDialogs";

const MotorcycleModelsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteBrandDialogOpen, setIsDeleteBrandDialogOpen] = useState(false);
  const [isOilDialogOpen, setIsOilDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<MotorcycleModel | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  
  // Filter models by search term and selected brand
  const filteredModels = motorcycleModels.filter(model => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.brand && model.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by selected brand
    const matchesBrand = !selectedBrand || 
      (model.brand && model.brand.toLowerCase() === selectedBrand.toLowerCase());
    
    return matchesSearch && matchesBrand;
  });
  
  console.log('Search term:', searchTerm);
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

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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
        <MotorcycleModelsHeader
          duplicateCount={duplicateCount}
          motorcycleModels={motorcycleModels}
          onAddClick={openAddDialog}
        />
        
        {!isLoading && (
          <MotorcycleModelsSearchAndFilter
            motorcycleModels={motorcycleModels}
            searchTerm={searchTerm}
            selectedBrand={selectedBrand}
            filteredModels={filteredModels}
            onSearchChange={handleSearchChange}
            onBrandFilter={handleBrandFilter}
            onDeleteBrand={handleDeleteBrand}
            onClearSearch={handleClearSearch}
          />
        )}
        
        <MotorcycleModelsContent
          isLoading={isLoading}
          filteredModels={filteredModels}
          searchTerm={searchTerm}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onViewOilData={openOilDialog}
          onAddClick={openAddDialog}
        />
      </div>
      
      <MotorcycleModelsDialogs
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isDeleteBrandDialogOpen={isDeleteBrandDialogOpen}
        isOilDialogOpen={isOilDialogOpen}
        currentModel={currentModel}
        brandToDelete={brandToDelete}
        addLoading={addModelMutation.isPending}
        updateLoading={updateModelMutation.isPending}
        deleteLoading={deleteModelMutation.isPending}
        deleteBrandLoading={deleteBrandMutation.isPending}
        onAddDialogChange={setIsAddDialogOpen}
        onEditDialogChange={setIsEditDialogOpen}
        onDeleteDialogChange={setIsDeleteDialogOpen}
        onDeleteBrandDialogChange={setIsDeleteBrandDialogOpen}
        onOilDialogChange={setIsOilDialogOpen}
        onAddModel={handleAddModel}
        onUpdateModel={handleUpdateModel}
        onDeleteModel={handleDeleteModel}
        onConfirmDeleteBrand={confirmDeleteBrand}
        getModelCountForBrand={getModelCountForBrand}
      />
    </Layout>
  );
};

export default MotorcycleModelsPage;

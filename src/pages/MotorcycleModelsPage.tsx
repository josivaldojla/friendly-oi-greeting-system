
import { useState, useEffect } from "react";
import { MotorcycleModel } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMotorcycleModels, addMotorcycleModel, updateMotorcycleModel, deleteMotorcycleModel } from "@/lib/storage";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";

const MotorcycleModelsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<MotorcycleModel | null>(null);
  const [modelName, setModelName] = useState("");
  const [brandName, setBrandName] = useState("");
  
  const queryClient = useQueryClient();
  
  // Consulta para buscar todos os modelos
  const { data: motorcycleModels = [], isLoading } = useQuery({
    queryKey: ['motorcycleModels'],
    queryFn: getMotorcycleModels
  });
  
  // Mutação para adicionar um modelo
  const addModelMutation = useMutation({
    mutationFn: addMotorcycleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      toast.success("Modelo adicionado com sucesso");
      setIsAddDialogOpen(false);
      resetForm();
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
      resetForm();
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
  
  // Função para resetar o formulário
  const resetForm = () => {
    setModelName("");
    setBrandName("");
    setCurrentModel(null);
  };
  
  // Manipuladores de eventos
  const handleAddModel = () => {
    if (!modelName.trim()) {
      toast.error("Nome do modelo é obrigatório");
      return;
    }
    
    addModelMutation.mutate({ 
      name: modelName.trim(),
      brand: brandName.trim()
    });
  };
  
  const handleUpdateModel = () => {
    if (!currentModel || !modelName.trim()) {
      toast.error("Nome do modelo é obrigatório");
      return;
    }
    
    updateModelMutation.mutate({ 
      id: currentModel.id,
      name: modelName.trim(),
      brand: brandName.trim()
    });
  };
  
  const handleDeleteModel = () => {
    if (!currentModel) return;
    
    deleteModelMutation.mutate(currentModel.id);
  };
  
  const openEditDialog = (model: MotorcycleModel) => {
    setCurrentModel(model);
    setModelName(model.name);
    setBrandName(model.brand || "");
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (model: MotorcycleModel) => {
    setCurrentModel(model);
    setIsDeleteDialogOpen(true);
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Modelos de Motos</h2>
          <Button onClick={openAddDialog}>Adicionar Modelo</Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="text-lg">Carregando...</div>
          </div>
        ) : motorcycleModels.length === 0 ? (
          <div className="bg-muted/50 rounded-md p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium mb-2">Nenhum modelo cadastrado</h3>
            <p className="text-muted-foreground mb-4">Adicione seu primeiro modelo de moto.</p>
            <Button onClick={openAddDialog}>Adicionar Modelo</Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motorcycleModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.brand || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openDeleteDialog(model)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Modal para adicionar modelo */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Modelo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Nome do Modelo</Label>
              <Input 
                id="model-name" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Ex: CG 160"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-name">Marca (Opcional)</Label>
              <Input 
                id="brand-name" 
                value={brandName} 
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ex: Honda"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddModel}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para editar modelo */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Modelo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-model-name">Nome do Modelo</Label>
              <Input 
                id="edit-model-name" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Ex: CG 160"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand-name">Marca (Opcional)</Label>
              <Input 
                id="edit-brand-name" 
                value={brandName} 
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ex: Honda"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateModel}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir o modelo "{currentModel?.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteModel}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MotorcycleModelsPage;

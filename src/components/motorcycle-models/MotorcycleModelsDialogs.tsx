
import { MotorcycleModel } from "@/lib/types";
import { MotorcycleModelForm } from "@/components/motorcycle-models/MotorcycleModelForm";
import { DeleteModelDialog } from "@/components/motorcycle-models/DeleteModelDialog";
import { DeleteBrandDialog } from "@/components/motorcycle-models/DeleteBrandDialog";
import { SuspensionOilDialog } from "@/components/motorcycle-models/SuspensionOilDialog";

interface MotorcycleModelsDialogsProps {
  // Add dialog states
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isDeleteBrandDialogOpen: boolean;
  isOilDialogOpen: boolean;
  
  // Models and data
  currentModel: MotorcycleModel | null;
  brandToDelete: string | null;
  
  // Loading states
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  deleteBrandLoading: boolean;
  
  // Handlers
  onAddDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onDeleteBrandDialogChange: (open: boolean) => void;
  onOilDialogChange: (open: boolean) => void;
  
  onAddModel: (model: Omit<MotorcycleModel, "id">) => void;
  onUpdateModel: (model: MotorcycleModel) => void;
  onDeleteModel: () => void;
  onConfirmDeleteBrand: () => void;
  
  getModelCountForBrand: (brand: string) => number;
}

export const MotorcycleModelsDialogs = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isDeleteBrandDialogOpen,
  isOilDialogOpen,
  currentModel,
  brandToDelete,
  addLoading,
  updateLoading,
  deleteLoading,
  deleteBrandLoading,
  onAddDialogChange,
  onEditDialogChange,
  onDeleteDialogChange,
  onDeleteBrandDialogChange,
  onOilDialogChange,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
  onConfirmDeleteBrand,
  getModelCountForBrand
}: MotorcycleModelsDialogsProps) => {
  return (
    <>
      <MotorcycleModelForm
        isOpen={isAddDialogOpen}
        onOpenChange={onAddDialogChange}
        onSave={onAddModel}
        isLoading={addLoading}
        mode="add"
      />
      
      <MotorcycleModelForm
        isOpen={isEditDialogOpen}
        onOpenChange={onEditDialogChange}
        onSave={onUpdateModel}
        currentModel={currentModel}
        isLoading={updateLoading}
        mode="edit"
      />
      
      <DeleteModelDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        onConfirm={onDeleteModel}
        model={currentModel}
        isLoading={deleteLoading}
      />
      
      <DeleteBrandDialog
        isOpen={isDeleteBrandDialogOpen}
        onOpenChange={onDeleteBrandDialogChange}
        onConfirm={onConfirmDeleteBrand}
        brand={brandToDelete}
        modelCount={brandToDelete ? getModelCountForBrand(brandToDelete) : 0}
        isLoading={deleteBrandLoading}
      />

      <SuspensionOilDialog
        isOpen={isOilDialogOpen}
        onOpenChange={onOilDialogChange}
        model={currentModel}
      />
    </>
  );
};

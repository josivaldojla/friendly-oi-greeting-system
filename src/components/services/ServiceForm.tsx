import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fileToBase64 } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageIcon, X } from "lucide-react";

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: Service) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceForm = ({ service, onSubmit, open, onOpenChange }: ServiceFormProps) => {
  const isEditing = !!service;
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<Service>({
    defaultValues: service || {
      id: "",
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (service?.imageUrl) {
      setPreviewImage(service.imageUrl);
    } else {
      setPreviewImage(undefined);
    }
  }, [service, open]);

  useEffect(() => {
    if (open && service) {
      reset(service);
    } else if (!open) {
      reset({
        id: "",
        name: "",
        price: 0,
        description: "",
        imageUrl: "",
      });
      setPreviewImage(undefined);
    }
  }, [open, service, reset]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPreviewImage(base64);
        setValue("imageUrl", base64);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };

  const removeImage = () => {
    setPreviewImage(undefined);
    setValue("imageUrl", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmitForm = (data: Service) => {
    if (!isEditing) {
      data.id = crypto.randomUUID();
    } else {
      data.id = service.id;
    }
    
    if (!data.imageUrl && service?.imageUrl) {
      data.imageUrl = service.imageUrl;
    }
    
    onSubmit(data);
    reset();
    setPreviewImage(undefined);
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    setPreviewImage(service?.imageUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Serviço" : "Cadastrar Novo Serviço"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome*</Label>
            <Input
              id="name"
              {...register("name", { required: "Nome é obrigatório" })}
              placeholder="Nome do serviço"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Valor*</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { 
                required: "Valor é obrigatório",
                valueAsNumber: true,
                min: { value: 0, message: "Valor deve ser maior que zero" }
              })}
              placeholder="Valor do serviço"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Imagem (opcional)</Label>
            <div className="flex flex-col items-center">
              {previewImage ? (
                <div className="relative w-full h-40 mb-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer bg-muted/50 mb-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar uma imagem</p>
                </div>
              )}
              <Input
                id="image"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? "Alterar Imagem" : "Selecionar Imagem"}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descrição detalhada do serviço"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;

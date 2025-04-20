
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mechanic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface MechanicFormProps {
  mechanic?: Mechanic;
  onSubmit: (data: Mechanic) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MechanicForm = ({ mechanic, onSubmit, open, onOpenChange }: MechanicFormProps) => {
  const isEditing = !!mechanic;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Mechanic>({
    defaultValues: mechanic || {
      id: "",
      name: "",
      specialization: "",
      phone: "",
    },
  });

  const onSubmitForm = (data: Mechanic) => {
    if (!isEditing) {
      // Apenas gera um novo ID para novos mecânicos
      data.id = crypto.randomUUID();
    } else {
      // Garante que mantemos o mesmo ID ao editar
      data.id = mechanic.id;
    }
    
    // Envia os dados para o componente pai
    onSubmit(data);
    
    // Reseta o formulário e fecha o modal
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Mecânico" : "Cadastrar Novo Mecânico"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome*</Label>
            <Input
              id="name"
              {...register("name", { required: "Nome é obrigatório" })}
              placeholder="Nome do mecânico"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Input
              id="specialization"
              {...register("specialization")}
              placeholder="Especialização (opcional)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Telefone (opcional)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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

export default MechanicForm;

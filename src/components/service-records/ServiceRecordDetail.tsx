
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ServiceRecordForm } from "./ServiceRecordForm";
import { ServiceRecord } from "@/lib/types";
import { getServiceRecordById, deleteServiceRecord } from "@/lib/storage";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ServiceRecordDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [serviceRecord, setServiceRecord] = useState<ServiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    if (id) {
      loadServiceRecord(id);
    }
  }, [id]);
  
  const loadServiceRecord = async (recordId: string) => {
    setLoading(true);
    try {
      const record = await getServiceRecordById(recordId);
      if (record) {
        setServiceRecord(record);
      } else {
        toast.error('Registro não encontrado');
        navigate('/service-records');
      }
    } catch (error) {
      console.error('Error loading service record:', error);
      toast.error('Erro ao carregar registro');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      const success = await deleteServiceRecord(id);
      if (success) {
        toast.success('Registro excluído com sucesso');
        navigate('/service-records');
      } else {
        toast.error('Erro ao excluir registro');
      }
    } catch (error) {
      console.error('Error deleting service record:', error);
      toast.error('Erro ao excluir registro');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  if (!serviceRecord) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Registro não encontrado</p>
        <Button
          variant="link"
          onClick={() => navigate('/service-records')}
          className="mt-4"
        >
          Voltar para Lista de Registros
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate('/service-records')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Lista
        </Button>
        
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Registro
        </Button>
      </div>
      
      <ServiceRecordForm serviceRecord={serviceRecord} />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Registro de Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita
              e todas as fotos associadas também serão excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Excluindo...' : 'Sim, excluir registro'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

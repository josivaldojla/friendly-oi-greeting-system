
import { useState, useEffect } from "react";
import { ServiceHistory, getServiceHistory, deleteServiceHistory, updateServiceHistoryTitle, updateFullServiceHistory } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { HistoryItem } from "./history/HistoryItem";
import { EmptyHistory } from "./history/EmptyHistory";
import { EditHistoryDialog } from "./history/EditHistoryDialog";
import { Service } from "@/lib/types";

interface ServiceHistoryListProps {
  onSelect?: (history: ServiceHistory) => void;
}

const ServiceHistoryList = ({ onSelect }: ServiceHistoryListProps) => {
  const [history, setHistory] = useState<ServiceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ServiceHistory | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getServiceHistory();
      setHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast.error("Não foi possível carregar o histórico");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceHistory(id);
      toast.success("Histórico removido com sucesso");
      loadHistory();
    } catch (error) {
      console.error("Erro ao excluir histórico:", error);
      toast.error("Não foi possível excluir o histórico");
    }
  };

  const handleEdit = (item: ServiceHistory) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (
    id: string, 
    title: string, 
    serviceData: Service[], 
    receivedAmount: number
  ) => {
    try {
      await updateFullServiceHistory(id, title, serviceData, receivedAmount);
      toast.success("Histórico atualizado com sucesso");
      loadHistory();
    } catch (error) {
      console.error("Erro ao atualizar histórico:", error);
      toast.error("Não foi possível atualizar o histórico");
      throw error; // Propagar erro para manipulação no EditHistoryDialog
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">Carregando histórico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                expandedItem={expandedItem}
                formatPrice={formatPrice}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSelect={onSelect}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        )}
      </CardContent>

      <EditHistoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        historyItem={editingItem}
        onSave={handleSaveEdit}
      />
    </Card>
  );
};

export default ServiceHistoryList;


import { useState, useEffect } from "react";
import { Mechanic } from "@/lib/types";
import { getMechanics, addMechanic, updateMechanic, deleteMechanic } from "@/lib/storage";
import MechanicList from "@/components/mechanics/MechanicList";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const MechanicsPage = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    setLoading(true);
    try {
      const data = await getMechanics();
      setMechanics(data);
    } catch (error) {
      console.error('Erro ao carregar mecânicos:', error);
      toast.error('Erro ao carregar mecânicos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMechanic = async (mechanic: Mechanic) => {
    try {
      const updatedMechanics = await addMechanic(mechanic);
      setMechanics(updatedMechanics);
      toast.success('Mecânico adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar mecânico:', error);
      toast.error('Erro ao adicionar mecânico');
    }
  };

  const handleUpdateMechanic = async (mechanic: Mechanic) => {
    try {
      const updatedMechanics = await updateMechanic(mechanic);
      setMechanics(updatedMechanics);
      toast.success('Mecânico atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar mecânico:', error);
      toast.error('Erro ao atualizar mecânico');
    }
  };

  const handleDeleteMechanic = async (id: string) => {
    try {
      const updatedMechanics = await deleteMechanic(id);
      setMechanics(updatedMechanics);
      toast.success('Mecânico removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover mecânico:', error);
      toast.error('Erro ao remover mecânico');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MechanicList
        mechanics={mechanics}
        onAddMechanic={handleAddMechanic}
        onUpdateMechanic={handleUpdateMechanic}
        onDeleteMechanic={handleDeleteMechanic}
      />
    </Layout>
  );
};

export default MechanicsPage;

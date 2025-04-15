
import { useState, useEffect } from "react";
import { Mechanic } from "@/lib/types";
import { getMechanics, addMechanic, updateMechanic, deleteMechanic } from "@/lib/storage";
import MechanicList from "@/components/mechanics/MechanicList";
import Layout from "@/components/layout/Layout";

const MechanicsPage = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    setLoading(true);
    const data = await getMechanics();
    setMechanics(data);
    setLoading(false);
  };

  const handleAddMechanic = async (mechanic: Mechanic) => {
    await addMechanic(mechanic);
    loadMechanics();
  };

  const handleUpdateMechanic = async (mechanic: Mechanic) => {
    await updateMechanic(mechanic);
    loadMechanics();
  };

  const handleDeleteMechanic = async (id: string) => {
    await deleteMechanic(id);
    loadMechanics();
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

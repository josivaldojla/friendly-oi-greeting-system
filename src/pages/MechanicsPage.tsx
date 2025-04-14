
import { useState, useEffect } from "react";
import { Mechanic } from "@/lib/types";
import { getMechanics, addMechanic, updateMechanic, deleteMechanic } from "@/lib/storage";
import MechanicList from "@/components/mechanics/MechanicList";
import Layout from "@/components/layout/Layout";

const MechanicsPage = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    setMechanics(getMechanics());
  }, []);

  const handleAddMechanic = (mechanic: Mechanic) => {
    setMechanics(addMechanic(mechanic));
  };

  const handleUpdateMechanic = (mechanic: Mechanic) => {
    setMechanics(updateMechanic(mechanic));
  };

  const handleDeleteMechanic = (id: string) => {
    setMechanics(deleteMechanic(id));
  };

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

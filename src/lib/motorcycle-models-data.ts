
import { MotorcycleModel } from "./types";
import { addMotorcycleModel } from "./storage";

// Lista de modelos de motos comuns no Brasil
const defaultMotorcycleModels = [
  { name: "CG 160", brand: "Honda" },
  { name: "Biz 125", brand: "Honda" },
  { name: "XRE 300", brand: "Honda" },
  { name: "CB 500", brand: "Honda" },
  { name: "CB 1000R", brand: "Honda" },
  { name: "PCX 150", brand: "Honda" },
  { name: "POP 110i", brand: "Honda" },
  { name: "Lead 110", brand: "Honda" },
  { name: "Factor 150", brand: "Yamaha" },
  { name: "Fazer 250", brand: "Yamaha" },
  { name: "MT-03", brand: "Yamaha" },
  { name: "MT-07", brand: "Yamaha" },
  { name: "MT-09", brand: "Yamaha" },
  { name: "XTZ 150", brand: "Yamaha" },
  { name: "NMax 160", brand: "Yamaha" },
  { name: "R3", brand: "Yamaha" },
  { name: "GSX-S750", brand: "Suzuki" },
  { name: "V-Strom 650", brand: "Suzuki" },
  { name: "Hayabusa", brand: "Suzuki" },
  { name: "Burgman 125", brand: "Suzuki" },
  { name: "Ninja 300", brand: "Kawasaki" },
  { name: "Ninja 400", brand: "Kawasaki" },
  { name: "Ninja ZX-10R", brand: "Kawasaki" },
  { name: "Z400", brand: "Kawasaki" },
  { name: "Z900", brand: "Kawasaki" },
  { name: "Duke 390", brand: "KTM" },
  { name: "Duke 200", brand: "KTM" },
  { name: "Adventure 390", brand: "KTM" },
  { name: "Scrambler", brand: "Ducati" },
  { name: "Panigale V4", brand: "Ducati" },
  { name: "Monster", brand: "Ducati" },
  { name: "G 310 R", brand: "BMW" },
  { name: "G 310 GS", brand: "BMW" },
  { name: "F 850 GS", brand: "BMW" },
  { name: "R 1250 GS", brand: "BMW" },
  { name: "S 1000 RR", brand: "BMW" },
  { name: "Meteor 350", brand: "Royal Enfield" },
  { name: "Himalayan", brand: "Royal Enfield" },
  { name: "Classic 350", brand: "Royal Enfield" }
];

// Função para preencher o banco de dados com os modelos de motos
export const populateMotorcycleModels = async () => {
  try {
    console.log("Iniciando a importação de modelos de motos");
    
    for (const model of defaultMotorcycleModels) {
      await addMotorcycleModel(model);
    }
    
    console.log("Modelos de motos importados com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao importar modelos de motos:", error);
    return false;
  }
};

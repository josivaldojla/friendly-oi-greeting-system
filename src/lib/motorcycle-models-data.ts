import { MotorcycleModel } from "./types";
import { addMotorcycleModel, getMotorcycleModels } from "./storage";

// Lista de modelos de motos comuns no Brasil
const defaultMotorcycleModels = [
  // Honda - Expandida
  { name: "CG 160", brand: "Honda" },
  { name: "CG 150", brand: "Honda" },
  { name: "CG 125", brand: "Honda" },
  { name: "Biz 125", brand: "Honda" },
  { name: "Biz 110i", brand: "Honda" },
  { name: "XRE 300", brand: "Honda" },
  { name: "XRE 190", brand: "Honda" },
  { name: "CB 500", brand: "Honda" },
  { name: "CB 600F Hornet", brand: "Honda" },
  { name: "CB 650F", brand: "Honda" },
  { name: "CB 1000R", brand: "Honda" },
  { name: "CBR 600RR", brand: "Honda" },
  { name: "CBR 1000RR", brand: "Honda" },
  { name: "PCX 150", brand: "Honda" },
  { name: "PCX 160", brand: "Honda" },
  { name: "POP 110i", brand: "Honda" },
  { name: "Lead 110", brand: "Honda" },
  { name: "Elite 125", brand: "Honda" },
  { name: "SH 150i", brand: "Honda" },
  { name: "SH 300i", brand: "Honda" },
  { name: "NC 750X", brand: "Honda" },
  { name: "Bros 160", brand: "Honda" },
  { name: "Titan 160", brand: "Honda" },
  { name: "Titan 150", brand: "Honda" },
  { name: "CB Twister 250", brand: "Honda" },
  { name: "XR 250 Tornado", brand: "Honda" },
  { name: "Africa Twin", brand: "Honda" },
  { name: "ADV 150", brand: "Honda" },
  
  // Yamaha - Expandida
  { name: "Factor 150", brand: "Yamaha" },
  { name: "Factor 125", brand: "Yamaha" },
  { name: "Fazer 250", brand: "Yamaha" },
  { name: "Fazer 150", brand: "Yamaha" },
  { name: "MT-03", brand: "Yamaha" },
  { name: "MT-07", brand: "Yamaha" },
  { name: "MT-09", brand: "Yamaha" },
  { name: "MT-10", brand: "Yamaha" },
  { name: "XTZ 150", brand: "Yamaha" },
  { name: "XTZ 250", brand: "Yamaha" },
  { name: "NMax 160", brand: "Yamaha" },
  { name: "NMax 155", brand: "Yamaha" },
  { name: "R3", brand: "Yamaha" },
  { name: "R6", brand: "Yamaha" },
  { name: "R1", brand: "Yamaha" },
  { name: "YBR 125", brand: "Yamaha" },
  { name: "YBR 150", brand: "Yamaha" },
  { name: "Crypton 115", brand: "Yamaha" },
  { name: "Neo 125", brand: "Yamaha" },
  { name: "Neo 115", brand: "Yamaha" },
  { name: "XJ6", brand: "Yamaha" },
  { name: "XJ6 N", brand: "Yamaha" },
  { name: "Tenere 250", brand: "Yamaha" },
  { name: "Tenere 660", brand: "Yamaha" },
  { name: "FZ25", brand: "Yamaha" },
  { name: "Crosser 150", brand: "Yamaha" },
  { name: "Lander 250", brand: "Yamaha" },
  { name: "Tracer 900", brand: "Yamaha" },
  { name: "V-Max", brand: "Yamaha" },
  
  // Outras marcas mantidas
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
  { name: "Classic 350", brand: "Royal Enfield" },
  
  // Modelos Shineray - Combinando ambas as listas
  { name: "Jet 50", brand: "Shineray" },
  { name: "XY 50 Q", brand: "Shineray" },
  { name: "Worker 125", brand: "Shineray" },
  { name: "SHI 175", brand: "Shineray" },
  { name: "SHI 200", brand: "Shineray" },
  { name: "Explorer 150", brand: "Shineray" },
  { name: "Phoenix S", brand: "Shineray" },
  { name: "Phoenix Gold", brand: "Shineray" },
  { name: "Jet 125", brand: "Shineray" },
  { name: "Urban 150", brand: "Shineray" },
  { name: "Urban 200", brand: "Shineray" },
  { name: "Phoenix 50", brand: "Shineray" },
  { name: "Phoenix 150", brand: "Shineray" },
  { name: "Phoenix 250", brand: "Shineray" },
  { name: "XY 150", brand: "Shineray" },
  { name: "XY 200", brand: "Shineray" },
  { name: "XY 250", brand: "Shineray" },
  { name: "Super Smart 50", brand: "Shineray" },
  { name: "Super Smart 125", brand: "Shineray" },
  { name: "Naked 150", brand: "Shineray" },
  { name: "Naked 250", brand: "Shineray" },
  { name: "Retro 125", brand: "Shineray" },
  { name: "Retro 150", brand: "Shineray" },
  { name: "Adventure 250", brand: "Shineray" },
  { name: "Street 150", brand: "Shineray" },
  { name: "Sport 200", brand: "Shineray" },
  { name: "Cruiser 250", brand: "Shineray" }
];

// Função para preencher o banco de dados com os modelos de motos
export const populateMotorcycleModels = async () => {
  try {
    console.log("Iniciando a importação de modelos de motos");
    
    // Buscar modelos existentes
    const existingModels = await getMotorcycleModels();
    const existingKeys = existingModels.map(model => 
      `${model.name.toLowerCase()}-${(model.brand || '').toLowerCase()}`
    );
    
    // Filtrar apenas os modelos que ainda não existem
    const modelsToAdd = defaultMotorcycleModels.filter(model => {
      const modelKey = `${model.name.toLowerCase()}-${model.brand.toLowerCase()}`;
      return !existingKeys.includes(modelKey);
    });
    
    console.log(`Encontrados ${modelsToAdd.length} modelos para adicionar`);
    
    for (const model of modelsToAdd) {
      await addMotorcycleModel(model);
      console.log(`Adicionado: ${model.name} (${model.brand})`);
    }
    
    console.log("Modelos de motos importados com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao importar modelos de motos:", error);
    return false;
  }
};

// Função para adicionar apenas os modelos da Shineray (mantida para compatibilidade)
export const addShinerayModels = async () => {
  // Agora chama a função principal que já verifica todos os modelos
  return await populateMotorcycleModels();
};


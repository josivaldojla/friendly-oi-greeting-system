
import { MotorcycleModel } from "./types";
import { addMotorcycleModel, getMotorcycleModels } from "./storage";

// Modelos extraídos das imagens fornecidas pelo usuário
const modelsFromImages = [
  // Yamaha (das imagens)
  { name: "DT180", brand: "Yamaha" },
  { name: "DT180 N 82/83", brand: "Yamaha" },
  { name: "FZ 6 Fazer 2007", brand: "Yamaha" },
  { name: "MT03 660", brand: "Yamaha" },
  { name: "RD 125", brand: "Yamaha" },
  { name: "RD 135", brand: "Yamaha" },
  { name: "RD 350 C", brand: "Yamaha" },
  { name: "RDR 350", brand: "Yamaha" },
  { name: "RDZ 125", brand: "Yamaha" },
  { name: "RDZ 135", brand: "Yamaha" },
  { name: "RX 125 Ceriani", brand: "Yamaha" },
  { name: "TT 125 Ceriani", brand: "Yamaha" },
  { name: "RX 125", brand: "Yamaha" },
  { name: "TT 125", brand: "Yamaha" },
  { name: "RX 180 Custom/Avant", brand: "Yamaha" },
  { name: "TDM 850", brand: "Yamaha" },
  { name: "TDM 900", brand: "Yamaha" },
  { name: "VMAX 1200", brand: "Yamaha" },
  { name: "XT 225", brand: "Yamaha" },
  { name: "XT 600 E", brand: "Yamaha" },
  { name: "XT 600 Teneré 88 ED", brand: "Yamaha" },
  { name: "XT 660", brand: "Yamaha" },
  { name: "XTZ 125", brand: "Yamaha" },
  { name: "XTZ 750 Super Teneré", brand: "Yamaha" },
  { name: "XV 250 Virago", brand: "Yamaha" },
  { name: "XV 535 Virago", brand: "Yamaha" },
  { name: "XVS 650 Dragstar", brand: "Yamaha" },
  { name: "YZF R 1 1998", brand: "Yamaha" },
  { name: "YZF R 1 2004", brand: "Yamaha" },
  { name: "YZF R 1 2005 A 2006", brand: "Yamaha" },
  { name: "YZF R 1 2007 W e WC", brand: "Yamaha" },
  { name: "YZF R 1 2009 Y", brand: "Yamaha" },
  { name: "YZF R 6 1999 a 2002", brand: "Yamaha" },
  { name: "YZF R 6 2006/2007", brand: "Yamaha" },

  // Suzuki (das imagens)
  { name: "Bandit 1200", brand: "Suzuki" },
  { name: "Bandit 1250", brand: "Suzuki" },
  { name: "Bandit 1250 S", brand: "Suzuki" },
  { name: "Bandit 600", brand: "Suzuki" },
  { name: "Bandit 650", brand: "Suzuki" },
  { name: "Bandit 650 S", brand: "Suzuki" },
  { name: "Boulevard 800", brand: "Suzuki" },
  { name: "Burgman 400", brand: "Suzuki" },
  { name: "Burgman 650", brand: "Suzuki" },
  { name: "DR 350 SE", brand: "Suzuki" },
  { name: "DR 400", brand: "Suzuki" },
  { name: "DR 650 R", brand: "Suzuki" },
  { name: "DR 650 S", brand: "Suzuki" },
  { name: "DR 650 SE", brand: "Suzuki" },
  { name: "DR 800 S", brand: "Suzuki" },
  { name: "GS 500E", brand: "Suzuki" },
  { name: "GSX 1000 R 2003 a 2004", brand: "Suzuki" },
  { name: "GSX 1000 R 2005", brand: "Suzuki" },
  { name: "GSX 1000 R 2007", brand: "Suzuki" },
  { name: "GSX 1000 R 2009", brand: "Suzuki" },
  { name: "GSX 1100 R", brand: "Suzuki" },
  { name: "GSX 1300 R Hayabusa", brand: "Suzuki" },
  { name: "GSX 1300 R Hayabusa 2008", brand: "Suzuki" },
  { name: "GSX 750 F", brand: "Suzuki" },
  { name: "GSX R 750 SRAD 2007", brand: "Suzuki" },
  { name: "GSX R 750 T", brand: "Suzuki" },
  { name: "GSX R 750 W", brand: "Suzuki" },
  { name: "Intruder 125", brand: "Suzuki" },
  { name: "Intruder 250", brand: "Suzuki" },
  { name: "Intruder VS 1400 GLP", brand: "Suzuki" },
  { name: "Intruder VS 800 GL", brand: "Suzuki" },
  { name: "Katana 125", brand: "Suzuki" },
  { name: "Marauder 800", brand: "Suzuki" },
  { name: "RF 600 R", brand: "Suzuki" },
  { name: "RF 900 R", brand: "Suzuki" },
  { name: "Savage LS 650", brand: "Suzuki" },
  { name: "TL 1000 S", brand: "Suzuki" },
  { name: "V-Strom DL 1000", brand: "Suzuki" },
  { name: "V-Strom DL 650", brand: "Suzuki" },
  { name: "VX 800 E", brand: "Suzuki" },
  { name: "YES 125", brand: "Suzuki" },

  // Honda (das imagens)
  { name: "Lead 100", brand: "Honda" },
  { name: "Magna 750", brand: "Honda" },
  { name: "NX 200", brand: "Honda" },
  { name: "NX 350 Sahara", brand: "Honda" },
  { name: "NX 400 Falcon", brand: "Honda" },
  { name: "NXR 125 Bros", brand: "Honda" },
  { name: "NXR 150 Bros", brand: "Honda" },
  { name: "Shadow VT 600", brand: "Honda" },
  { name: "Varadero XLV 1000", brand: "Honda" },
  { name: "VTX 1800", brand: "Honda" },
  { name: "XL 125", brand: "Honda" },
  { name: "XL 125 85/96", brand: "Honda" },
  { name: "XL 125 Duty", brand: "Honda" },
  { name: "XL 250 R 82/83/84", brand: "Honda" },
  { name: "XL 250/350 85/91", brand: "Honda" },
  { name: "XLR 125", brand: "Honda" },
  { name: "XLR 125 ES", brand: "Honda" },
  { name: "XLX 350 86 ED", brand: "Honda" },
  { name: "XR 200 R", brand: "Honda" },
  { name: "Biz 100", brand: "Honda" },
  { name: "CB 300", brand: "Honda" },
  { name: "CB 400 I", brand: "Honda" },
  { name: "CB 400 II", brand: "Honda" },
  { name: "CB 450 Custom/Sport", brand: "Honda" },
  { name: "CBR 1000 F", brand: "Honda" },
  { name: "CBR 1000 RR 2004", brand: "Honda" },
  { name: "CBR 1000 RR 2008", brand: "Honda" },
  { name: "CBR 1000 XX 97 A 98", brand: "Honda" },
  { name: "CBR 1100 XX 98", brand: "Honda" },
  { name: "CBR 1100 XX 99 a 02", brand: "Honda" },
  { name: "CBR 600 F3 95 A 98", brand: "Honda" },
  { name: "CBR 600 RR 2006", brand: "Honda" },
  { name: "CBR 600 RR 2007 A 2008", brand: "Honda" },
  { name: "CBR 600F", brand: "Honda" },
  { name: "CBR 900 RR 96 A 97", brand: "Honda" },
  { name: "CBR 900 RR 98", brand: "Honda" },
  { name: "CBR 929 RR", brand: "Honda" },
  { name: "CBX 150 - Aero 89/92", brand: "Honda" },
  { name: "CBX 200 Strada", brand: "Honda" },
  { name: "CBX 250 Twister", brand: "Honda" },
  { name: "CBX 750 86", brand: "Honda" },
  { name: "CBX 750 87 ED", brand: "Honda" },
  { name: "CG 125 Cargo", brand: "Honda" },
  { name: "CG 125 Titan", brand: "Honda" },
  { name: "CG/ML 125 76/78", brand: "Honda" },
  { name: "CG/ML 125/Turuna 79/85", brand: "Honda" },
  { name: "CRF 230", brand: "Honda" },
  { name: "Dream 100", brand: "Honda" },
  { name: "Hornet CB 600 2005 A 2007", brand: "Honda" },
  { name: "Hornet CB 600 2008", brand: "Honda" },

  // Kasinski (das imagens)
  { name: "Comet 250", brand: "Kasinski" },
  { name: "Comet 650 GTR", brand: "Kasinski" },
  { name: "GF 125", brand: "Kasinski" },
  { name: "Mirage 250", brand: "Kasinski" },

  // Kawasaki (das imagens)
  { name: "ER 6 F", brand: "Kawasaki" },
  { name: "Ninja 250", brand: "Kawasaki" },
  { name: "Ninja 650 R", brand: "Kawasaki" },
  { name: "Ninja ZX 11 1993 A 2001", brand: "Kawasaki" },
  { name: "Ninja ZX 12 R", brand: "Kawasaki" },
  { name: "Versys", brand: "Kawasaki" },
  { name: "Vulcan 750", brand: "Kawasaki" },
  { name: "Vulcan 900 Classic", brand: "Kawasaki" },
  { name: "Z 750 Naked", brand: "Kawasaki" },

  // Sundown (das imagens)
  { name: "Future", brand: "Sundown" },
  { name: "Hunter", brand: "Sundown" },
  { name: "Max SE/SED", brand: "Sundown" },
  { name: "STX 200 Trail e Motard", brand: "Sundown" },
  { name: "VBlade 250", brand: "Sundown" },
  { name: "Web", brand: "Sundown" },
  { name: "New Web", brand: "Sundown" },

  // BMW (das imagens)
  { name: "F 650 GS", brand: "BMW" },
  { name: "K 1100 LT", brand: "BMW" },

  // Dafra (das imagens)
  { name: "Kansas 150", brand: "Dafra" },
  { name: "Kansas 250", brand: "Dafra" },
  { name: "Laser 150", brand: "Dafra" },
  { name: "Speed 150", brand: "Dafra" },
  { name: "Super 100", brand: "Dafra" },
  { name: "Zig 100", brand: "Dafra" }
];

// Função para adicionar apenas os modelos das imagens que não estão cadastrados
export const addModelsFromImages = async () => {
  try {
    console.log("Iniciando a importação de modelos das imagens");
    
    // Buscar modelos existentes
    const existingModels = await getMotorcycleModels();
    const existingKeys = existingModels.map(model => 
      `${model.name.toLowerCase()}-${(model.brand || '').toLowerCase()}`
    );
    
    console.log(`Total de modelos existentes: ${existingModels.length}`);
    
    // Filtrar apenas os modelos das imagens que ainda não existem
    const modelsToAdd = modelsFromImages.filter(model => {
      const modelKey = `${model.name.toLowerCase()}-${model.brand.toLowerCase()}`;
      return !existingKeys.includes(modelKey);
    });
    
    console.log(`Modelos das imagens para adicionar: ${modelsToAdd.length}`);
    console.log('Modelos que serão adicionados:', modelsToAdd.map(m => `${m.name} (${m.brand})`));
    
    if (modelsToAdd.length === 0) {
      console.log("Todos os modelos das imagens já estão cadastrados");
      return true;
    }
    
    for (const model of modelsToAdd) {
      await addMotorcycleModel(model);
      console.log(`Adicionado: ${model.name} (${model.brand})`);
    }
    
    console.log(`${modelsToAdd.length} modelos das imagens foram adicionados com sucesso`);
    return true;
  } catch (error) {
    console.error("Erro ao importar modelos das imagens:", error);
    return false;
  }
};

// Função principal mantida para compatibilidade (agora chama a função das imagens)
export const populateMotorcycleModels = async () => {
  return await addModelsFromImages();
};

// Função para adicionar apenas os modelos da Shineray (mantida para compatibilidade)
export const addShinerayModels = async () => {
  return await addModelsFromImages();
};

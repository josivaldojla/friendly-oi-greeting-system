
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
  { name: "Cruiser 250", brand: "Shineray" },

  // NOVOS MODELOS DAS IMAGENS - Yamaha adicionais
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

  // NOVOS MODELOS DAS IMAGENS - Suzuki
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

  // NOVOS MODELOS DAS IMAGENS - Honda adicionais
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

  // NOVOS MODELOS DAS IMAGENS - Kasinski
  { name: "Comet 250", brand: "Kasinski" },
  { name: "Comet 650 GTR", brand: "Kasinski" },
  { name: "GF 125", brand: "Kasinski" },
  { name: "Mirage 250", brand: "Kasinski" },

  // NOVOS MODELOS DAS IMAGENS - Kawasaki adicionais
  { name: "ER 6 F", brand: "Kawasaki" },
  { name: "Ninja 250", brand: "Kawasaki" },
  { name: "Ninja 650 R", brand: "Kawasaki" },
  { name: "Ninja ZX 11 1993 A 2001", brand: "Kawasaki" },
  { name: "Ninja ZX 12 R", brand: "Kawasaki" },
  { name: "Versys", brand: "Kawasaki" },
  { name: "Vulcan 750", brand: "Kawasaki" },
  { name: "Vulcan 900 Classic", brand: "Kawasaki" },
  { name: "Z 750 Naked", brand: "Kawasaki" },

  // NOVOS MODELOS DAS IMAGENS - Sundown
  { name: "Future", brand: "Sundown" },
  { name: "Hunter", brand: "Sundown" },
  { name: "Max SE/SED", brand: "Sundown" },
  { name: "STX 200 Trail e Motard", brand: "Sundown" },
  { name: "VBlade 250", brand: "Sundown" },
  { name: "Web", brand: "Sundown" },
  { name: "New Web", brand: "Sundown" },

  // NOVOS MODELOS DAS IMAGENS - BMW
  { name: "F 650 GS", brand: "BMW" },
  { name: "K 1100 LT", brand: "BMW" },

  // NOVOS MODELOS DAS IMAGENS - Dafra
  { name: "Kansas 150", brand: "Dafra" },
  { name: "Kansas 250", brand: "Dafra" },
  { name: "Laser 150", brand: "Dafra" },
  { name: "Speed 150", brand: "Dafra" },
  { name: "Super 100", brand: "Dafra" },
  { name: "Zig 100", brand: "Dafra" }
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

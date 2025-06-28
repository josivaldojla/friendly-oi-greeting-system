
// Dados de óleo de suspensão extraídos das tabelas fornecidas
export interface SuspensionOilData {
  brand: string;
  model: string;
  oilQuantityML: string;
}

export const suspensionOilData: SuspensionOilData[] = [
  // Yamaha
  { brand: "YAMAHA", model: "CRYPTON", oilQuantityML: "58,5" },
  { brand: "YAMAHA", model: "DT180/DT180 N 82/83", oilQuantityML: "250" },
  { brand: "YAMAHA", model: "FAZER 250", oilQuantityML: "319" },
  { brand: "YAMAHA", model: "FZ 6 FAZER 2007", oilQuantityML: "467" },
  { brand: "YAMAHA", model: "LANDER 250", oilQuantityML: "541" },
  { brand: "YAMAHA", model: "MT03 660", oilQuantityML: "640" },
  { brand: "YAMAHA", model: "NEO 115", oilQuantityML: "63" },
  { brand: "YAMAHA", model: "RD 125 / RD 135", oilQuantityML: "171,5" },
  { brand: "YAMAHA", model: "RD 350 C / RDR 350", oilQuantityML: "287" },
  { brand: "YAMAHA", model: "RDZ 125 / RDZ 135", oilQuantityML: "162" },
  { brand: "YAMAHA", model: "RX / TT 125 CERIANI", oilQuantityML: "162" },
  { brand: "YAMAHA", model: "RX / TT 125", oilQuantityML: "140" },
  { brand: "YAMAHA", model: "RX 180 CUSTOM/AVANT", oilQuantityML: "171,5" },
  { brand: "YAMAHA", model: "TDM 850", oilQuantityML: "515" },
  { brand: "YAMAHA", model: "TDM 900", oilQuantityML: "507" },
  { brand: "YAMAHA", model: "VMAX 1200", oilQuantityML: "621" },
  { brand: "YAMAHA", model: "XT 225", oilQuantityML: "366" },
  { brand: "YAMAHA", model: "XT 600 E", oilQuantityML: "533" },
  { brand: "YAMAHA", model: "XT 600 TENERÉ 88 ED", oilQuantityML: "533" },
  { brand: "YAMAHA", model: "XT 660", oilQuantityML: "640" },
  { brand: "YAMAHA", model: "XTZ 125", oilQuantityML: "366" },
  { brand: "YAMAHA", model: "XTZ 750 SUPER TENERE", oilQuantityML: "669" },
  { brand: "YAMAHA", model: "XV 250 VIRAGO", oilQuantityML: "245" },
  { brand: "YAMAHA", model: "XV 535 VIRAGO", oilQuantityML: "228" },
  { brand: "YAMAHA", model: "XVS 650 DRAGSTAR", oilQuantityML: "454" },
  { brand: "YAMAHA", model: "YBR 125", oilQuantityML: "154,5" },
  { brand: "YAMAHA", model: "YZF R 1 1998", oilQuantityML: "477" },
  { brand: "YAMAHA", model: "YZF R 1 2004", oilQuantityML: "530" },
  { brand: "YAMAHA", model: "YZF R 1 2005 A 2006", oilQuantityML: "530" },
  { brand: "YAMAHA", model: "YZF R 1 2007 W e WC", oilQuantityML: "513" },
  { brand: "YAMAHA", model: "YZF R 1 2009 Y", oilQuantityML: "528" },
  { brand: "YAMAHA", model: "YZF R 6 1999 a 2002", oilQuantityML: "476" },
  { brand: "YAMAHA", model: "YZF R 6 2006/2007", oilQuantityML: "465" },

  // Suzuki
  { brand: "SUZUKI", model: "BANDIT 1200", oilQuantityML: "516" },
  { brand: "SUZUKI", model: "BANDIT 1250", oilQuantityML: "472" },
  { brand: "SUZUKI", model: "BANDIT 1250 S", oilQuantityML: "471" },
  { brand: "SUZUKI", model: "BANDIT 600", oilQuantityML: "510" },
  { brand: "SUZUKI", model: "BANDIT 650", oilQuantityML: "502" },
  { brand: "SUZUKI", model: "BANDIT 650 S", oilQuantityML: "507" },
  { brand: "SUZUKI", model: "BOULEVARD 800", oilQuantityML: "493" },
  { brand: "SUZUKI", model: "BURGMAN 125", oilQuantityML: "85" },
  { brand: "SUZUKI", model: "BURGMAN 400", oilQuantityML: "284" },
  { brand: "SUZUKI", model: "BURGMAN 650", oilQuantityML: "482" },
  { brand: "SUZUKI", model: "DR 350 SE", oilQuantityML: "586" },
  { brand: "SUZUKI", model: "DR 400", oilQuantityML: "720" },
  { brand: "SUZUKI", model: "DR 650 R 650 S", oilQuantityML: "566" },
  { brand: "SUZUKI", model: "DR 650 SE", oilQuantityML: "563" },
  { brand: "SUZUKI", model: "DR 800 S", oilQuantityML: "467" },
  { brand: "SUZUKI", model: "GS 500E", oilQuantityML: "362" },
  { brand: "SUZUKI", model: "GSX 1000 R 2003 a 2004", oilQuantityML: "509" },
  { brand: "SUZUKI", model: "GSX 1000 R 2005", oilQuantityML: "510" },
  { brand: "SUZUKI", model: "GSX 1000 R 2007", oilQuantityML: "512" },
  { brand: "SUZUKI", model: "GSX 1000 R 2009", oilQuantityML: "476" },
  { brand: "SUZUKI", model: "GSX 1100 R", oilQuantityML: "425" },
  { brand: "SUZUKI", model: "GSX 1300 R HAYABUSA", oilQuantityML: "480" },
  { brand: "SUZUKI", model: "GSX 1300 R HAYABUSA 2008", oilQuantityML: "532" },
  { brand: "SUZUKI", model: "GSX 750 F", oilQuantityML: "513" },
  { brand: "SUZUKI", model: "GSX R 750 SRAD 2007", oilQuantityML: "408" },
  { brand: "SUZUKI", model: "GSX R 750 T", oilQuantityML: "480" },
  { brand: "SUZUKI", model: "GSX R 750 W", oilQuantityML: "454,5" },
  { brand: "SUZUKI", model: "INTRUDER 125", oilQuantityML: "174" },
  { brand: "SUZUKI", model: "INTRUDER 250", oilQuantityML: "216" },
  { brand: "SUZUKI", model: "INTRUDER VS 1400 GLP", oilQuantityML: "354" },
  { brand: "SUZUKI", model: "INTRUDER VS 800 GL", oilQuantityML: "LE 370 LD 350" },
  { brand: "SUZUKI", model: "KATANA 125", oilQuantityML: "136" },
  { brand: "SUZUKI", model: "MARAUDER 800", oilQuantityML: "838" },
  { brand: "SUZUKI", model: "RF 600 R", oilQuantityML: "503" },
  { brand: "SUZUKI", model: "RF 900 R", oilQuantityML: "466" },
  { brand: "SUZUKI", model: "SAVAGE LS 650", oilQuantityML: "441" },
  { brand: "SUZUKI", model: "TL 1000 S", oilQuantityML: "488" },
  { brand: "SUZUKI", model: "V-STROM DL 1000", oilQuantityML: "505" },
  { brand: "SUZUKI", model: "V-STROM DL 650", oilQuantityML: "524" },
  { brand: "SUZUKI", model: "VX 800 E", oilQuantityML: "392" },
  { brand: "SUZUKI", model: "YES 125", oilQuantityML: "150" },

  // Honda
  { brand: "HONDA", model: "BIZ 100", oilQuantityML: "60,5" },
  { brand: "HONDA", model: "CB 300", oilQuantityML: "128" },
  { brand: "HONDA", model: "CB 400 I / II", oilQuantityML: "137 ~143" },
  { brand: "HONDA", model: "CB 450 CUSTOM/SPORT", oilQuantityML: "137 ~143" },
  { brand: "HONDA", model: "CB 500", oilQuantityML: "320" },
  { brand: "HONDA", model: "CBR 1000 F", oilQuantityML: "418" },
  { brand: "HONDA", model: "CBR 1000 RR 2004", oilQuantityML: "466" },
  { brand: "HONDA", model: "CBR 1000 RR 2008", oilQuantityML: "517" },
  { brand: "HONDA", model: "CBR 1000 XX 97 A 98", oilQuantityML: "486" },
  { brand: "HONDA", model: "CBR 1100 XX 98", oilQuantityML: "483" },
  { brand: "HONDA", model: "CBR 1100 XX 99 a 02", oilQuantityML: "483" },
  { brand: "HONDA", model: "CBR 600 F3 95 A 98", oilQuantityML: "463" },
  { brand: "HONDA", model: "CBR 600 RR 2006", oilQuantityML: "531" },
  { brand: "HONDA", model: "CBR 600 RR 2007 A 2008", oilQuantityML: "413" },
  { brand: "HONDA", model: "CBR 600F", oilQuantityML: "462" },
  { brand: "HONDA", model: "CBR 900 RR 96 A 97", oilQuantityML: "561" },
  { brand: "HONDA", model: "CBR 900 RR 98", oilQuantityML: "540" },
  { brand: "HONDA", model: "CBR 929 RR", oilQuantityML: "488" },
  { brand: "HONDA", model: "CBX 150 - AERO 89/92", oilQuantityML: "130" },
  { brand: "HONDA", model: "CBX 200 STRADA", oilQuantityML: "128" },
  { brand: "HONDA", model: "CBX 250 TWISTER", oilQuantityML: "296" },
  { brand: "HONDA", model: "CBX 750 86", oilQuantityML: "LE 400 LD 375" },
  { brand: "HONDA", model: "CBX 750 87 ED", oilQuantityML: "LE 376 LD 366" },
  { brand: "HONDA", model: "CG / ML 125 76/78", oilQuantityML: "140" },
  { brand: "HONDA", model: "CG 125 CARGO", oilQuantityML: "75" },
  { brand: "HONDA", model: "CG 125 TITAN", oilQuantityML: "75" },
  { brand: "HONDA", model: "CG 150", oilQuantityML: "141" },
  { brand: "HONDA", model: "CG/ML 125/TURUNA 79/85", oilQuantityML: "85" },
  { brand: "HONDA", model: "CRF 230", oilQuantityML: "380" },
  { brand: "HONDA", model: "DREAM 100", oilQuantityML: "60,5" },
  { brand: "HONDA", model: "HORNET CB 600 2005 A 2007", oilQuantityML: "486" },
  { brand: "HONDA", model: "HORNET CB 600 2008", oilQuantityML: "494" },
  { brand: "HONDA", model: "LEAD 100", oilQuantityML: "52" },
  { brand: "HONDA", model: "MAGNA 750", oilQuantityML: "521" },
  { brand: "HONDA", model: "NX 200", oilQuantityML: "312" },
  { brand: "HONDA", model: "NX 350 SAHARA", oilQuantityML: "435" },
  { brand: "HONDA", model: "NX 400 FALCON", oilQuantityML: "529" },
  { brand: "HONDA", model: "NXR 125 BROS", oilQuantityML: "171" },
  { brand: "HONDA", model: "NXR 150 BROS", oilQuantityML: "171" },
  { brand: "HONDA", model: "SHADOW VT 600", oilQuantityML: "449" },
  { brand: "HONDA", model: "TITAN 150", oilQuantityML: "141,5" },
  { brand: "HONDA", model: "VARADERO XLV 1000", oilQuantityML: "529" },
  { brand: "HONDA", model: "VTX 1800", oilQuantityML: "LE 770 LD 68" },
  { brand: "HONDA", model: "XL 125", oilQuantityML: "155" },
  { brand: "HONDA", model: "XL 125 85/96", oilQuantityML: "155" },
  { brand: "HONDA", model: "XL 125 DUTY", oilQuantityML: "155" },
  { brand: "HONDA", model: "XL 250 R 82/83/84", oilQuantityML: "300" },
  { brand: "HONDA", model: "XL 250/350 85/91", oilQuantityML: "300" },
  { brand: "HONDA", model: "XLR 125 / 125 ES", oilQuantityML: "170" },
  { brand: "HONDA", model: "XLX 350 86 ED", oilQuantityML: "418" },
  { brand: "HONDA", model: "XR 200 R", oilQuantityML: "371" },
  { brand: "HONDA", model: "XR 250 TORNADO", oilQuantityML: "586" },
  { brand: "HONDA", model: "XRE 300", oilQuantityML: "547" },

  // Kasinski
  { brand: "KASINSKI", model: "COMET 250", oilQuantityML: "400" },
  { brand: "KASINSKI", model: "COMET 650 GTR", oilQuantityML: "380" },
  { brand: "KASINSKI", model: "GF 125", oilQuantityML: "175" },
  { brand: "KASINSKI", model: "MIRAGE 250", oilQuantityML: "250" },

  // Kawasaki
  { brand: "KAWASAKI", model: "ER 6 F", oilQuantityML: "489" },
  { brand: "KAWASAKI", model: "NINJA 250", oilQuantityML: "310" },
  { brand: "KAWASAKI", model: "NINJA 650 R", oilQuantityML: "489" },
  { brand: "KAWASAKI", model: "NINJA ZX 11 1993 A 2001", oilQuantityML: "465" },
  { brand: "KAWASAKI", model: "NINJA ZX 12 R", oilQuantityML: "490" },
  { brand: "KAWASAKI", model: "VERSYS", oilQuantityML: "LE 478 LD 48" },
  { brand: "KAWASAKI", model: "VULCAN 750", oilQuantityML: "373" },
  { brand: "KAWASAKI", model: "VULCAN 900 CLASSIC", oilQuantityML: "417" },
  { brand: "KAWASAKI", model: "Z 750 NAKED", oilQuantityML: "LE 485 LD 40" },

  // Sundown
  { brand: "SUNDOWN", model: "FUTURE", oilQuantityML: "80" },
  { brand: "SUNDOWN", model: "HUNTER / MAX SE/SED", oilQuantityML: "150" },
  { brand: "SUNDOWN", model: "STX 200 TRAIL E MOTARD", oilQuantityML: "330" },
  { brand: "SUNDOWN", model: "VBLADE 250", oilQuantityML: "?" },
  { brand: "SUNDOWN", model: "WEB / NEW WEB", oilQuantityML: "70" },

  // BMW
  { brand: "BMW", model: "F 650 GS", oilQuantityML: "600" },
  { brand: "BMW", model: "K 1100 LT", oilQuantityML: "400" },

  // Dafra
  { brand: "DAFRA", model: "KANSAS 150", oilQuantityML: "160" },
  { brand: "DAFRA", model: "KANSAS 250", oilQuantityML: "150" },
  { brand: "DAFRA", model: "LASER 150", oilQuantityML: "80" },
  { brand: "DAFRA", model: "SPEED 150", oilQuantityML: "160" },
  { brand: "DAFRA", model: "SUPER 100", oilQuantityML: "80" },
  { brand: "DAFRA", model: "ZIG 100", oilQuantityML: "65" }
];

// Função para buscar dados de óleo por marca e modelo
export const getSuspensionOilData = (brand: string, model: string): SuspensionOilData | null => {
  const normalizedBrand = brand.toUpperCase().trim();
  const normalizedModel = model.toUpperCase().trim();
  
  return suspensionOilData.find(data => 
    data.brand.toUpperCase() === normalizedBrand && 
    data.model.toUpperCase().includes(normalizedModel)
  ) || null;
};

// Função para buscar por correspondência parcial do modelo
export const findSuspensionOilByPartialMatch = (brand: string, model: string): SuspensionOilData[] => {
  const normalizedBrand = brand.toUpperCase().trim();
  const normalizedModel = model.toUpperCase().trim();
  
  return suspensionOilData.filter(data => 
    data.brand.toUpperCase() === normalizedBrand && 
    (data.model.toUpperCase().includes(normalizedModel) || 
     normalizedModel.includes(data.model.toUpperCase()))
  );
};

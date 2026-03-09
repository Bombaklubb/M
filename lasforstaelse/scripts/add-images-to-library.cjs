// Script för att lägga till bildstöd till åk 1-2 texter
// Använder tema-baserade illustrationer från Unsplash

const fs = require('fs');
const path = require('path');

// Tema-till-bild mappning (Unsplash bilder med barnvänliga motiv)
const themeImages = {
  // Djur
  'djur': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop', // katt
  'katt': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
  'hund': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
  
  // Natur
  'natur': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', // skog
  'skog': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop',
  'regn': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop',
  'snö': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=400&fit=crop',
  'sol': 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=400&fit=crop',
  
  // Skola
  'skola': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
  'klassrum': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop',
  
  // Familj & Vänskap
  'familj': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
  'vänskap': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
  'hjälpsamhet': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
  
  // Kroppen
  'kroppen': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
  
  // Mat
  'mat': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
  'pannkakor': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop',
  
  // Aktiviteter
  'simning': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop',
  'idrott': 'https://images.unsplash.com/photo-1461896836934- voices-of-a-bright-future?w=600&h=400&fit=crop',
  
  // Konst
  'konst': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
  
  // Bibliotek/Böcker
  'läsning': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
  'böcker': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop',
  
  // Miljö
  'miljö': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop',
  'återvinning': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop',
  
  // Default
  'default': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop'
};

// Specialmappning för specifika texter baserat på titel
const titleImages = {
  'Katten Maja': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
  'Maja är hungrig': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop',
  'Linnéa och hunden': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
  'Hunden på promenaden': 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=400&fit=crop',
  'En tur i skogen': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop',
  'Tanden som lossnade': 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=400&fit=crop',
  'En tand i servetten': 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=400&fit=crop',
  'Pannkaksfredag': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop',
  'Pannkaksdagen': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop',
  'Söndag i simhallen': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop',
  'Regnbågen på papperet': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
  'Regn och pölar': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop',
  'Regnet som slutade': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop',
  'Vad är snö?': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=400&fit=crop',
  'Snögubben som lutade': 'https://images.unsplash.com/photo-1610973625444-9b8c0d1e1a8c?w=600&h=400&fit=crop',
  'Fågeln vid fönstret': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=400&fit=crop',
  'Fågeln på fönsterbrädan': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=400&fit=crop',
  'Boken med stora bilder': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
  'Boken om rävar': 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=600&h=400&fit=crop',
  'Ett frö blir en blomma': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
  'Fröet i fickan': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
  'Masken i jorden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
  'Pulkan i backen': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=400&fit=crop',
  'Bussen till badhuset': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop'
};

function getImageForText(text) {
  // Först, kolla om det finns en specifik bild för titeln
  if (titleImages[text.title]) {
    return titleImages[text.title];
  }
  
  // Annars, försök matcha temat
  const theme = (text.theme || '').toLowerCase();
  for (const [key, url] of Object.entries(themeImages)) {
    if (theme.includes(key)) {
      return url;
    }
  }
  
  // Försök matcha i titeln
  const title = text.title.toLowerCase();
  for (const [key, url] of Object.entries(themeImages)) {
    if (title.includes(key)) {
      return url;
    }
  }
  
  return themeImages.default;
}

// Huvudfunktion
function addImagesToLibrary() {
  const libraryPath = path.join(__dirname, '../public/data/library.json');
  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
  
  let updatedCount = 0;
  
  library.forEach(text => {
    // Endast åk 1-2 får bilder
    if (text.grade <= 2 && !text.imageUrl) {
      text.imageUrl = getImageForText(text);
      updatedCount++;
    }
  });
  
  // Spara tillbaka
  fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2), 'utf8');
  
  console.log(`Lade till bilder till ${updatedCount} texter för åk 1-2`);
}

addImagesToLibrary();

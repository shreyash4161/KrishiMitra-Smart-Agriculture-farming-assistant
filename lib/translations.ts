export type Language = "en" | "hi" | "mr"

export interface Translations {
  // Navigation
  dashboard: string
  fieldMapping: string
  chatbot: string
  settings: string
  smartFarm: string

  // Dashboard
  farmDashboard: string
  liveReadings: string
  lastUpdated: string
  refresh: string
  temperature: string
  phLevel: string
  humidity: string
  salinity: string
  trend: string
  alert: string

  // Alerts
  highTemperature: string
  lowTemperature: string
  phTooAcidic: string
  phTooAlkaline: string
  highHumidity: string
  lowHumidity: string
  highSalinity: string

  // Field Mapping
  fieldMappingTitle: string
  fieldMappingDesc: string
  interactiveFieldMap: string
  fieldDrawing: string
  startDrawingField: string
  fieldName: string
  enterFieldName: string
  saveField: string
  reset: string
  points: string
  estimatedArea: string
  savedFields: string
  noFieldsSaved: string
  howToUse: string
  instructions: string[]

  // Chatbot
  farmAssistant: string
  farmAssistantDesc: string
  farmAssistantChatbot: string
  askAboutFarming: string
  whatICanHelp: string
  helpTopics: string[]

  // Settings
  settingsTitle: string
  settingsDesc: string
  language: string
  selectLanguage: string
  theme: string
  selectTheme: string
  light: string
  dark: string
  system: string
  preferences: string
  savePreferences: string
  preferencesSaved: string

  // Quick questions
  quickQuestions: string[]

  // Units
  celsius: string
  percent: string
  psu: string
  sqUnits: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    fieldMapping: "Field Mapping",
    chatbot: "Chatbot",
    settings: "Settings",
    smartFarm: "Smart Farm",

    // Dashboard
    farmDashboard: "Farm Dashboard",
    liveReadings: "Live sensor readings",
    lastUpdated: "Last updated",
    refresh: "Refresh",
    temperature: "Temperature",
    phLevel: "pH Level",
    humidity: "Humidity",
    salinity: "Salinity",
    trend: "Trend",
    alert: "Alert",

    // Alerts
    highTemperature: "High temperature detected",
    lowTemperature: "Low temperature detected",
    phTooAcidic: "pH too acidic",
    phTooAlkaline: "pH too alkaline",
    highHumidity: "High humidity detected",
    lowHumidity: "Low humidity detected",
    highSalinity: "High salinity detected",

    // Field Mapping
    fieldMappingTitle: "Field Mapping",
    fieldMappingDesc: "Create and manage your field boundaries by clicking points on the interactive map",
    interactiveFieldMap: "Interactive Field Map",
    fieldDrawing: "Field Drawing",
    startDrawingField: "Start Drawing New Field",
    fieldName: "Field Name",
    enterFieldName: "Enter field name...",
    saveField: "Save Field",
    reset: "Reset",
    points: "Points",
    estimatedArea: "Estimated area",
    savedFields: "Saved Fields",
    noFieldsSaved: "No fields saved yet",
    howToUse: "How to use:",
    instructions: [
      'Click "Start Drawing New Field" to begin',
      "Click on the map to add points for your field boundary",
      "Add at least 3 points to create a field polygon",
      "Enter a name for your field",
      'Click "Save Field" to save your field',
      'Use "Reset" to clear current points and start over',
    ],

    // Chatbot
    farmAssistant: "Farm Assistant",
    farmAssistantDesc: "Get personalized farming advice and sensor reading interpretations from our AI assistant",
    farmAssistantChatbot: "Farm Assistant Chatbot",
    askAboutFarming: "Ask me about farming, sensors, or crop management...",
    whatICanHelp: "What I can help with:",
    helpTopics: [
      "Interpret your current sensor readings and provide recommendations",
      "Crop-specific growing advice (tomatoes, lettuce, etc.)",
      "Pest and disease management strategies",
      "Watering and irrigation best practices",
      "Fertilization and soil health guidance",
      "Harvest timing and techniques",
    ],

    // Settings
    settingsTitle: "Settings",
    settingsDesc: "Customize your Smart Farm experience",
    language: "Language",
    selectLanguage: "Select Language",
    theme: "Theme",
    selectTheme: "Select Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    preferences: "Preferences",
    savePreferences: "Save Preferences",
    preferencesSaved: "Preferences saved successfully!",

    // Quick questions
    quickQuestions: [
      "What do my current sensor readings mean?",
      "How should I water my crops?",
      "What are signs of plant diseases?",
      "When should I harvest my tomatoes?",
      "How do I manage pests naturally?",
    ],

    // Units
    celsius: "°C",
    percent: "%",
    psu: " PSU",
    sqUnits: "sq units",
  },

  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    fieldMapping: "खेत मैपिंग",
    chatbot: "चैटबॉट",
    settings: "सेटिंग्स",
    smartFarm: "स्मार्ट फार्म",

    // Dashboard
    farmDashboard: "फार्म डैशबोर्ड",
    liveReadings: "लाइव सेंसर रीडिंग",
    lastUpdated: "अंतिम अपडेट",
    refresh: "रिफ्रेश",
    temperature: "तापमान",
    phLevel: "पीएच स्तर",
    humidity: "नमी",
    salinity: "लवणता",
    trend: "रुझान",
    alert: "अलर्ट",

    // Alerts
    highTemperature: "उच्च तापमान का पता चला",
    lowTemperature: "कम तापमान का पता चला",
    phTooAcidic: "पीएच बहुत अम्लीय है",
    phTooAlkaline: "पीएच बहुत क्षारीय है",
    highHumidity: "उच्च नमी का पता चला",
    lowHumidity: "कम नमी का पता चला",
    highSalinity: "उच्च लवणता का पता चला",

    // Field Mapping
    fieldMappingTitle: "खेत मैपिंग",
    fieldMappingDesc: "इंटरैक्टिव मैप पर पॉइंट्स क्लिक करके अपनी खेत की सीमाएं बनाएं और प्रबंधित करें",
    interactiveFieldMap: "इंटरैक्टिव फील्ड मैप",
    fieldDrawing: "खेत ड्राइंग",
    startDrawingField: "नया खेत बनाना शुरू करें",
    fieldName: "खेत का नाम",
    enterFieldName: "खेत का नाम दर्ज करें...",
    saveField: "खेत सेव करें",
    reset: "रीसेट",
    points: "पॉइंट्स",
    estimatedArea: "अनुमानित क्षेत्रफल",
    savedFields: "सेव किए गए खेत",
    noFieldsSaved: "अभी तक कोई खेत सेव नहीं किया गया",
    howToUse: "उपयोग कैसे करें:",
    instructions: [
      'शुरू करने के लिए "नया खेत बनाना शुरू करें" पर क्लिक करें',
      "अपनी खेत की सीमा के लिए पॉइंट्स जोड़ने के लिए मैप पर क्लिक करें",
      "खेत का बहुभुज बनाने के लिए कम से कम 3 पॉइंट्स जोड़ें",
      "अपने खेत के लिए एक नाम दर्ज करें",
      'अपना खेत सेव करने के लिए "खेत सेव करें" पर क्लिक करें',
      'वर्तमान पॉइंट्स साफ करने और फिर से शुरू करने के लिए "रीसेट" का उपयोग करें',
    ],

    // Chatbot
    farmAssistant: "फार्म असिस्टेंट",
    farmAssistantDesc: "हमारे AI असिस्टेंट से व्यक्तिगत खेती की सलाह और सेंसर रीडिंग की व्याख्या प्राप्त करें",
    farmAssistantChatbot: "फार्म असिस्टेंट चैटबॉट",
    askAboutFarming: "मुझसे खेती, सेंसर या फसल प्रबंधन के बारे में पूछें...",
    whatICanHelp: "मैं किसमें मदद कर सकता हूं:",
    helpTopics: [
      "आपकी वर्तमान सेंसर रीडिंग की व्याख्या करना और सिफारिशें प्रदान करना",
      "फसल-विशिष्ट उगाने की सलाह (टमाटर, सलाद, आदि)",
      "कीट और रोग प्रबंधन रणनीतियां",
      "पानी देने और सिंचाई की सर्वोत्तम प्रथाएं",
      "उर्वरीकरण और मिट्टी के स्वास्थ्य का मार्गदर्शन",
      "फसल की समय और तकनीकें",
    ],

    // Settings
    settingsTitle: "सेटिंग्स",
    settingsDesc: "अपने स्मार्ट फार्म अनुभव को कस्टमाइज़ करें",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    theme: "थीम",
    selectTheme: "थीम चुनें",
    light: "लाइट",
    dark: "डार्क",
    system: "सिस्टम",
    preferences: "प्राथमिकताएं",
    savePreferences: "प्राथमिकताएं सेव करें",
    preferencesSaved: "प्राथमिकताएं सफलतापूर्वक सेव हो गईं!",

    // Quick questions
    quickQuestions: [
      "मेरी वर्तमान सेंसर रीडिंग का क्या मतलब है?",
      "मुझे अपनी फसलों को कैसे पानी देना चाहिए?",
      "पौधों की बीमारियों के संकेत क्या हैं?",
      "मुझे अपने टमाटर कब काटने चाहिए?",
      "मैं प्राकृतिक रूप से कीटों का प्रबंधन कैसे करूं?",
    ],

    // Units
    celsius: "°C",
    percent: "%",
    psu: " PSU",
    sqUnits: "वर्ग इकाइयां",
  },

  mr: {
    // Navigation
    dashboard: "डॅशबोर्ड",
    fieldMapping: "शेत मॅपिंग",
    chatbot: "चॅटबॉट",
    settings: "सेटिंग्ज",
    smartFarm: "स्मार्ट फार्म",

    // Dashboard
    farmDashboard: "फार्म डॅशबोर्ड",
    liveReadings: "लाइव्ह सेन्सर रीडिंग",
    lastUpdated: "शेवटचे अपडेट",
    refresh: "रिफ्रेश",
    temperature: "तापमान",
    phLevel: "पीएच पातळी",
    humidity: "आर्द्रता",
    salinity: "क्षारता",
    trend: "ट्रेंड",
    alert: "अलर्ट",

    // Alerts
    highTemperature: "उच्च तापमान आढळले",
    lowTemperature: "कमी तापमान आढळले",
    phTooAcidic: "पीएच खूप आम्लीय आहे",
    phTooAlkaline: "पीएच खूप क्षारीय आहे",
    highHumidity: "उच्च आर्द्रता आढळली",
    lowHumidity: "कमी आर्द्रता आढळली",
    highSalinity: "उच्च क्षारता आढळली",

    // Field Mapping
    fieldMappingTitle: "शेत मॅपिंग",
    fieldMappingDesc: "इंटरॅक्टिव्ह मॅपवर पॉइंट्स क्लिक करून तुमच्या शेताच्या सीमा तयार करा आणि व्यवस्थापित करा",
    interactiveFieldMap: "इंटरॅक्टिव्ह फील्ड मॅप",
    fieldDrawing: "शेत ड्रॉइंग",
    startDrawingField: "नवीन शेत काढणे सुरू करा",
    fieldName: "शेताचे नाव",
    enterFieldName: "शेताचे नाव टाका...",
    saveField: "शेत सेव्ह करा",
    reset: "रीसेट",
    points: "पॉइंट्स",
    estimatedArea: "अंदाजित क्षेत्रफळ",
    savedFields: "सेव्ह केलेली शेते",
    noFieldsSaved: "अजून कोणतीही शेते सेव्ह केलेली नाहीत",
    howToUse: "कसे वापरावे:",
    instructions: [
      'सुरू करण्यासाठी "नवीन शेत काढणे सुरू करा" वर क्लिक करा',
      "तुमच्या शेताच्या सीमेसाठी पॉइंट्स जोडण्यासाठी मॅपवर क्लिक करा",
      "शेताचा बहुभुज तयार करण्यासाठी किमान 3 पॉइंट्स जोडा",
      "तुमच्या शेतासाठी नाव टाका",
      'तुमचे शेत सेव्ह करण्यासाठी "शेत सेव्ह करा" वर क्लिक करा',
      'सध्याचे पॉइंट्स साफ करण्यासाठी आणि पुन्हा सुरू करण्यासाठी "रीसेट" वापरा',
    ],

    // Chatbot
    farmAssistant: "फार्म असिस्टंट",
    farmAssistantDesc: "आमच्या AI असिस्टंटकडून वैयक्तिक शेती सल्ला आणि सेन्सर रीडिंगचे स्पष्टीकरण मिळवा",
    farmAssistantChatbot: "फार्म असिस्टंट चॅटबॉट",
    askAboutFarming: "मला शेती, सेन्सर किंवा पीक व्यवस्थापनाबद्दल विचारा...",
    whatICanHelp: "मी कशात मदत करू शकतो:",
    helpTopics: [
      "तुमच्या सध्याच्या सेन्सर रीडिंगचे स्पष्टीकरण आणि शिफारसी प्रदान करणे",
      "पीक-विशिष्ट वाढवण्याचा सल्ला (टोमॅटो, कोशिंबिरीसाठी वापरण्यात येणारा एक पाला व त्याचे झाड, इ.)",
      "कीड आणि रोग व्यवस्थापन धोरणे",
      "पाणी देणे आणि सिंचनाच्या सर्वोत्तम पद्धती",
      "खत आणि मातीच्या आरोग्याचे मार्गदर्शन",
      "कापणीची वेळ आणि तंत्रे",
    ],

    // Settings
    settingsTitle: "सेटिंग्ज",
    settingsDesc: "तुमचा स्मार्ट फार्म अनुभव कस्टमाइझ करा",
    language: "भाषा",
    selectLanguage: "भाषा निवडा",
    theme: "थीम",
    selectTheme: "थीम निवडा",
    light: "लाइट",
    dark: "डार्क",
    system: "सिस्टम",
    preferences: "प्राधान्ये",
    savePreferences: "प्राधान्ये सेव्ह करा",
    preferencesSaved: "प्राधान्ये यशस्वीरित्या सेव्ह झाली!",

    // Quick questions
    quickQuestions: [
      "माझ्या सध्याच्या सेन्सर रीडिंगचा अर्थ काय आहे?",
      "मी माझ्या पिकांना कसे पाणी द्यावे?",
      "वनस्पतींच्या आजारांची चिन्हे काय आहेत?",
      "मी माझे टोमॅटो कधी कापावेत?",
      "मी नैसर्गिकरित्या कीडांचे व्यवस्थापन कसे करू?",
    ],

    // Units
    celsius: "°C",
    percent: "%",
    psu: " PSU",
    sqUnits: "चौ. एकके",
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en
}

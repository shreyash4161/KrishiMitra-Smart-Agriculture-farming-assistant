# AI-Powered Farming Assistant

A comprehensive React Native (Expo) mobile application designed specifically for Indian farmers, providing AI-powered farming assistance with multilingual support.

## Features

### 🌱 Core Functionality
- **Real-time Sensor Monitoring**: Live tracking of humidity, temperature, pH, and salinity levels
- **Smart Alerts**: Automatic notifications when sensor values go outside safe ranges
- **Field Mapping**: Google Maps integration for marking farm locations and drawing field boundaries
- **AI Chatbot**: Intelligent farming assistant with hardcoded responses for common queries
- **Weekly Reports**: Comprehensive analytics with charts and recommendations
- **Multilingual Support**: Available in English, Hindi, and Marathi

### 📱 User Experience
- **Farmer-Friendly Design**: Clean, intuitive interface designed for rural users
- **Dark/Light Mode**: Automatic theme switching based on user preference
- **Offline Capability**: Core features work without internet connection
- **Location-Based Advice**: Personalized recommendations based on farm location

### 🛠 Technical Features
- **React Native with Expo**: Cross-platform mobile development
- **Real-time Data Simulation**: Mock sensor data that updates every 5 seconds
- **Persistent Storage**: User preferences and farm data saved locally
- **Charts & Analytics**: Visual representation of farm data trends
- **Responsive Design**: Optimized for various screen sizes

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup
1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Configure Google Maps API:
   - Get a Google Maps API key from Google Cloud Console
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `app.json`

4. Start the development server:
   \`\`\`bash
   expo start
   \`\`\`

## App Structure

### Screens
- **Onboarding**: Location permission with farmer-friendly illustration
- **Dashboard**: Real-time sensor data with charts and alerts
- **Field Map**: Google Maps integration for farm management
- **Chatbot**: AI assistant with farming knowledge base
- **Reports**: Weekly analytics and recommendations
- **Settings**: Profile management and app preferences

### Key Components
- **Language Context**: Manages multilingual translations
- **Theme Context**: Handles dark/light mode switching
- **Sensor Data Utils**: Generates and validates mock sensor readings
- **Navigation**: Bottom tab navigation with intuitive icons

## Multilingual Support

The app supports three languages:
- **English**: Default language
- **Hindi (हिंदी)**: For Hindi-speaking farmers
- **Marathi (मराठी)**: For Marathi-speaking farmers

Translations cover all UI elements, alerts, and farming terminology.

## Data Simulation

The app includes realistic farming data simulation:
- **Humidity**: 30-70% range with alerts below 30%
- **Temperature**: 20-40°C with optimal range 20-30°C
- **pH Level**: 5.0-9.0 range with safe zone 6.5-7.5
- **Salinity**: 100-600 ppm with warnings above 300 ppm

## Farming Knowledge Base

The chatbot includes responses for:
- Crop selection and management
- Soil health and pH management
- Irrigation and water management
- Pest and disease control
- Weather-related advice
- Organic farming practices
- Modern farming technology

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both Android and iOS
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: help@farmingassistant.com
- Create an issue in the GitHub repository

## Acknowledgments

- Designed for Indian farmers with local farming practices in mind
- Icons and illustrations optimized for rural users
- Multilingual support for better accessibility
- Offline-first approach for areas with limited connectivity

# medical Applications

A comprehensive React application that helps users find nearby doctors and provides practice management tools including AI-powered chatbot support, marketing plan generation, medical image analysis, and automated quote generation.

![Application Screenshot]

## ✨ Core Features

### 🔍 Doctor Search
- 📍 Automatic location detection
- 🗺️ Distance-based search with adjustable radius
- ⭐ Ratings and reviews
- 🕒 Real-time availability
- ♿ Accessibility information

### 💰 Quote Generator Module
The quote module provides automated pricing and estimates:
- Quote generation
- Automated PDF generation
- Email quote functionality


### 🤖 AI Chatbot Assistant
The integrated chatbot provides:
- Google search intergration
- FAQ handling


### 📊 Marketing Plan Generator
Helps medical practices create comprehensive marketing strategies:
- Custom marketing plan generation

### 🔬 Medical Room transform
Advanced image processing capabilities:
- Transform a room picture from an empty space to a state of art design room


## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Places API key
- OpenAI API key (for chatbot)
- Image processing API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zwivhuyamashau/medicalSuiteFE
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. setup your AWS API gateway stage link on config.js,
4. add your google clientID on App.jsx


5. Start the development server:
```bash
npm run dev
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "@chakra-ui/react": "^2.x",
    "@emotion/react": "^11.x",
    "@emotion/styled": "^11.x",
    "framer-motion": "^6.x",
    "phosphor-react": "^1.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "openai": "^4.x",
    "react-pdf": "^7.x",
    "dicom-parser": "^1.x",
    "cornerstone-core": "^2.x",
    "jspdf": "^2.x",
    "html2canvas": "^1.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^4.x"
  }
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── doctor/
│   │   ├── DoctorSearch.jsx
│   │   ├── DoctorCard.jsx
│   │   └── LocationCard.jsx
│   ├── quote/
│   │   ├── QuoteModule.jsx
│   │   ├── QuoteForm.jsx
│   │   ├── QuoteCalculator.jsx
│   │   
│   │   
│   ├── chatbot/
│   │   ├── Chatbot.jsx
│   │   └── chatbot.css
│   ├── marketing/
│   │   ├── MarketingPlan.jsx
│   │   └── MarketingPlanPDF.jsx
│   └── images/
│       ├── Images.jsx
│       └── ImagesAPI.jsx
├── services/
│   ├── doctorService.js
│   ├── quoteService.js
│   ├── chatbotService.js
│   ├── marketingService.js
│   └── imageService.js
└── hooks/
    ├── useGoogleMapsApi.js
    ├── useQuoteCalculator.js
    ├── useChatbot.js
    └── useImageProcessing.js


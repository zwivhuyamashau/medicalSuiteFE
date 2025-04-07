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
- Dynamic quote generation
- Automated PDF generation
- Email quote functionality
- Quote history tracking
- Customizable templates

```jsx
// Example Quote Module Usage
<QuoteModule
  services={selectedServices}
  insuranceProvider="BlueCross"
  patientType="new"
  customDiscounts={discounts}
  outputFormat="pdf"
/>
```

### 🤖 AI Chatbot Assistant
The integrated chatbot provides:
- 24/7 patient support
- Appointment scheduling assistance
- Medical information guidance
- FAQ handling
- Emergency contact information
- Multilingual support

### 📊 Marketing Plan Generator
Helps medical practices create comprehensive marketing strategies:
- Custom marketing plan generation
- Target audience analysis
- Competition research
- Digital marketing strategies
- Social media planning
- Budget allocation
- ROI tracking

### 🔬 Medical Room transform
Advanced image processing capabilities:
- Transform a room picture from one to a state of art design room


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
git clone [your-repository-url]
cd doctor-search
```

2. Install dependencies:
```bash
npm install
```

3. setup your API keys:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_places_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_IMAGE_API_KEY=your_image_api_key
```

4. Start the development server:
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
```

## 🎯 Feature Details

### 💰 Quote Module Implementation
The quote generation system provides:
- Service package customization
- Automated PDF generation
- Email integration

Example quote calculation:
```javascript
// Quote calculation helper
const calculateQuote = ({
  baseServices,
  additionalServices,
  insuranceDetails,
  discounts
}) => {
  const baseTotal = calculateBaseTotal(baseServices);
  const additionalTotal = calculateAdditionalServices(additionalServices);
  const insuranceCoverage = calculateInsuranceCoverage(insuranceDetails);
  const discountAmount = applyDiscounts(discounts);

  return {
    subtotal: baseTotal + additionalTotal,
    insuranceCoverage,
    discountAmount,
    total: calculateFinalTotal({
      baseTotal,
      additionalTotal,
      insuranceCoverage,
      discountAmount
    })
  };
};
```

### Quote Module Components

#### QuoteModule
Main component that orchestrates the quote generation process:
```jsx
import { QuoteModule } from './components/quote/QuoteModule';

<QuoteModule
  initialServices={[]}
  insuranceProviders={providers}
  discountCodes={availableDiscounts}
  onQuoteGenerated={(quote) => {
    // Handle generated quote
  }}
  outputFormat="pdf"
/>
```

#### QuoteForm
Handles user input for quote generation:
```jsx
<QuoteForm
  services={availableServices}
  insuranceOptions={insuranceProviders}
  onSubmit={handleQuoteSubmission}
  defaultValues={savedQuote}
/>
```

#### QuoteCalculator
Performs the pricing calculations:
```jsx
<QuoteCalculator
  services={selectedServices}
  insurance={selectedInsurance}
  discounts={appliedDiscounts}
  onCalculationComplete={handleCalculation}
/>
```

#### QuotePreview
Displays the generated quote:
```jsx
<QuotePreview
  quoteData={generatedQuote}
  allowEdit={true}
  showPrintButton={true}
  onEdit={handleEdit}
  onPrint={handlePrint}
/>
```



---

Built with ❤️ using React and advanced AI technologies

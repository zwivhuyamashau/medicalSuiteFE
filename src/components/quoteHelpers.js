import { useEffect, useState } from 'react';
import { APIGATEWAY_BASE } from '../config';

export const transformApiResponse = (apiData) => {
  // Ensure the response is an array, or convert it into an array if it's an object
  if (!Array.isArray(apiData)) {
    if (typeof apiData === 'object' && apiData !== null) {
      apiData = [apiData]; // Wrap object in an array
    } else {
      console.error('Invalid API data format:', apiData);
      return {
        items: [],
        total: 'R0'
      };
    }
  }

  const transformed = {
    items: [],
    total: apiData[0]?.total || 'R0' // Default to 'R0' if no total
  };

  for (const item of apiData) {
    const categoryItem = {
      category: item.Offering,
      details: []
    };

    // Dynamically get all keys except 'Offering', 'total', 'compNameOfferering', and 'CompanyName'
    for (const [key, value] of Object.entries(item)) {
      if (!['Offering', 'total', 'compNameOfferering', 'CompanyName'].includes(key) && value) {
        categoryItem.details.push({
          name: key,
          cost: value
        });
      }
    }

    transformed.items.push(categoryItem);
  }

  return transformed;
};


// Format currency values
export const formatCurrency = (value) => {
  if (typeof value === 'string' && value.startsWith('R')) {
    return value;
  }
  return `R${parseFloat(value).toFixed(2)}`;
};

// Validate form data
export const validateQuoteData = (data, fields) => {
  const errors = {};
  fields.forEach(field => {
    if (!data[field] && !field.toLowerCase().includes('optional')) {
      errors[field] = `${field} is required`;
    }
  });
  return errors;
};

// Custom hook to fetch and manage quote data
export const useQuoteData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          APIGATEWAY_BASE + `quoteModule/getAll`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Group by CompanyName and transform structure
        const groupedData = result.reduce((acc, curr, index) => {
          const existingCompany = acc.find(c => c.name === curr.CompanyName);

          const offering = {
            id: index + 1,
            type: curr.Offering,
            name: curr.Offering,
            key: curr.compNameOfferering,
            fields: []
          };

          if (existingCompany) {
            existingCompany.offerings.push(offering);
          } else {
            acc.push({
              id: acc.length + 1,
              name: curr.CompanyName,
              offerings: [offering]
            });
          }
          return acc;
        }, []);

        setData(groupedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quote data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Helper function to group items by category
export const groupByCategory = (items) => {
  return items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};

// Helper function to calculate totals
export const calculateTotals = (items) => {
  return items.reduce((total, item) => {
    const cost = item.cost ? parseFloat(item.cost.replace('R', '')) : 0;
    return total + cost;
  }, 0);
};

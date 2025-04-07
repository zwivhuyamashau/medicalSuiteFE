import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts - using web-safe fonts for better compatibility
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Professional color palette
const colors = {
  primary: '#1a365d',
  secondary: '#2C5282',
  accent: '#3182CE',
  gradient: {
    start: '#2C5282',
    end: '#3182CE',
  },
  text: {
    dark: '#1A202C',
    medium: '#4A5568',
    light: '#718096',
  },
  background: {
    main: '#ffffff',
    alt: '#F7FAFC',
    highlight: '#EBF8FF',
  },
  border: {
    light: '#E2E8F0',
  }
};

// Clean, professional styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.background.main,
    padding: 40,
    paddingTop: 60,
    fontFamily: 'Roboto',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: colors.background.alt,
  },
  header: {
    marginBottom: 40,
    position: 'relative',
    zIndex: 1,
  },
  headerContent: {
    padding: '30 40',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.medium,
    marginBottom: 6,
    fontWeight: 'medium',
  },
  date: {
    fontSize: 12,
    color: colors.text.light,
    marginTop: 10,
  },
  section: {
    margin: '20 0',
    padding: '20 0',
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: `2 solid ${colors.border.light}`,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'medium',
    letterSpacing: 0.5,
    color: colors.text.dark,
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    letterSpacing: 0.2,
    color: colors.text.medium,
    marginBottom: 8,
  },
  list: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 11.5,
    lineHeight: 1.6,
    color: colors.text.medium,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listItemDot: {
    width: 4,
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 6,
  },
  listItemText: {
    flex: 1,
  },
  highlight: {
    backgroundColor: colors.background.highlight,
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: 500,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: `2 solid ${colors.border.light}`,
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: colors.text.light,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: colors.text.light,
  },
  divider: {
    height: 3,
    backgroundColor: colors.accent,
    width: '15%',
    marginBottom: 20,
    borderRadius: 1.5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.text.light,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
});

const createEmptySection = (title) => ({
  title,
  content: '',
  items: []
});

const parsePlan = (planText) => {
  const sections = {
    overview: createEmptySection('Overview'),
    targetMarket: createEmptySection('Target Market Analysis'),
    strategy: createEmptySection('Marketing Strategy'),
    budget: createEmptySection('Budget Allocation'),
    timeline: createEmptySection('Implementation Timeline'),
    recommendations: createEmptySection('Key Recommendations')
  };

  if (!planText) {
    return sections;
  }

  let currentSection = 'overview';
  const lines = planText.split('\n');

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const lowerLine = trimmedLine.toLowerCase();

    if (lowerLine.includes('target market') || lowerLine.includes('market analysis')) {
      currentSection = 'targetMarket';
      return;
    }
    if (lowerLine.includes('strategy') || lowerLine.includes('marketing channels')) {
      currentSection = 'strategy';
      return;
    }
    if (lowerLine.includes('budget') || lowerLine.includes('allocation')) {
      currentSection = 'budget';
      return;
    }
    if (lowerLine.includes('timeline') || lowerLine.includes('implementation')) {
      currentSection = 'timeline';
      return;
    }
    if (lowerLine.includes('recommend') || lowerLine.includes('action items')) {
      currentSection = 'recommendations';
      return;
    }

    // Add content to the current section
    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || /^\d+\./.test(trimmedLine)) {
      const cleanItem = trimmedLine.replace(/^[-•\d.]\s*/, '').trim();
      if (cleanItem) {
        sections[currentSection].items.push(cleanItem);
      }
    } else {
      sections[currentSection].content += trimmedLine + '\n';
    }
  });

  // Clean up content
  Object.keys(sections).forEach(key => {
    sections[key].content = sections[key].content.trim();
  });

  return sections;
};

const formatBudgetRange = (range) => {
  if (!range) return 'Not specified';
  if (range.includes('-')) {
    const [min, max] = range.split('-');
    return `$${min.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - $${max.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }
  if (range.endsWith('+')) {
    const value = range.slice(0, -1);
    return `$${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}+`;
  }
  return range;
};

const MarketingPlanPDF = ({ plan, businessInfo }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sections = parsePlan(plan);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background for header */}
        <View style={styles.headerBackground} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Strategic Marketing Plan</Text>
            <View style={styles.divider} />
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.subtitle}>{businessInfo?.businessName || 'Unnamed Business'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Industry</Text>
                <Text style={styles.subtitle}>{businessInfo?.industry || 'Not specified'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Timeline</Text>
                <Text style={styles.subtitle}>{businessInfo?.timeline || 'Not specified'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Budget Range</Text>
                <Text style={styles.subtitle}>{formatBudgetRange(businessInfo?.budget)}</Text>
              </View>
              <View style={[styles.infoItem, { width: '100%' }]}>
                <Text style={styles.infoLabel}>Document Date</Text>
                <Text style={styles.subtitle}>{currentDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Company Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Overview</Text>
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>{businessInfo?.companyDescription || 'No description provided'}</Text>
          </View>
          {businessInfo?.uniqueSellingProposition && (
            <>
              <Text style={styles.sectionSubtitle}>Unique Selling Proposition</Text>
              <Text style={styles.text}>{businessInfo.uniqueSellingProposition}</Text>
            </>
          )}
        </View>

        {/* Target Market Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sections.targetMarket.title}</Text>
          <Text style={styles.text}>{sections.targetMarket.content}</Text>
          {sections.targetMarket.items.length > 0 && (
            <View style={styles.list}>
              {sections.targetMarket.items.map((item, index) => (
                <View key={`market-${index}`} style={styles.listItem}>
                  <View style={styles.listItemDot} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Strategy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sections.strategy.title}</Text>
          <Text style={styles.text}>{sections.strategy.content}</Text>
          {sections.strategy.items.length > 0 && (
            <View style={styles.list}>
              {sections.strategy.items.map((item, index) => (
                <View key={`strategy-${index}`} style={styles.listItem}>
                  <View style={styles.listItemDot} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sections.budget.title}</Text>
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>Total Budget Range: {formatBudgetRange(businessInfo?.budget)}</Text>
          </View>
          <Text style={styles.text}>{sections.budget.content}</Text>
          {sections.budget.items.length > 0 && (
            <View style={styles.list}>
              {sections.budget.items.map((item, index) => (
                <View key={`budget-${index}`} style={styles.listItem}>
                  <View style={styles.listItemDot} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sections.timeline.title}</Text>
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>Project Duration: {businessInfo?.timeline || 'Not specified'}</Text>
          </View>
          <Text style={styles.text}>{sections.timeline.content}</Text>
          {sections.timeline.items.length > 0 && (
            <View style={styles.list}>
              {sections.timeline.items.map((item, index) => (
                <View key={`timeline-${index}`} style={styles.listItem}>
                  <View style={styles.listItemDot} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sections.recommendations.title}</Text>
          <Text style={styles.text}>{sections.recommendations.content}</Text>
          {sections.recommendations.items.length > 0 && (
            <View style={styles.list}>
              {sections.recommendations.items.map((item, index) => (
                <View key={`rec-${index}`} style={styles.listItem}>
                  <View style={styles.listItemDot} />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Confidential Document | Generated by Marketing Plan Generator | Review and adjust according to your specific needs
          </Text>
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default MarketingPlanPDF;

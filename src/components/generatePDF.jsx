import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20 },
  logo: { width: 80, height: 80, alignSelf: 'center' },
  heading: { fontSize: 20, marginBottom: 10, textAlign: 'center', fontWeight: 'bold', color: '#2C3E50' },
  section: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EAECEE', paddingBottom: 10 },
  category: { fontSize: 16, fontWeight: 'bold', color: '#3498DB', marginBottom: 5 },
  detail: { fontSize: 12, marginLeft: 10 },
  tableHeader: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#34495E' },
  row: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 12, paddingVertical: 3 },
  total: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginTop: 10, color: '#E74C3C' },
  footer: { fontSize: 10, textAlign: 'center', marginTop: 20, color: '#7F8C8D' },
  signatureSection: { marginTop: 20 },
  signatureLine: { marginTop: 10, fontSize: 12 },
  clientInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F8F9F9',
    borderRadius: 5
  },
  clientInfoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  clientInfoLabel: {
    width: '30%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50'
  },
  clientInfoValue: {
    width: '70%',
    fontSize: 12,
    color: '#34495E'
  },
  quoteNumber: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 10
  }
});

export const QuotePDF = ({ quoteResult, quoteData }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const quoteNumber = `Q${Date.now().toString().slice(-6)}`;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="https://via.placeholder.com/80" />
          <Text style={styles.heading}>Medical Equipment Quote</Text>
          <Text style={styles.quoteNumber}>Quote Number: {quoteNumber}</Text>
          <Text style={styles.quoteNumber}>Date: {currentDate}</Text>
        </View>

        {/* Client Information Section */}
        <View style={styles.clientInfo}>
          <Text style={[styles.category, { marginBottom: 10 }]}>Client Information</Text>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Name:</Text>
            <Text style={styles.clientInfoValue}>{quoteData.name}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Surname:</Text>
            <Text style={styles.clientInfoValue}>{quoteData.surname}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Company:</Text>
            <Text style={styles.clientInfoValue}>{quoteData.companyName}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Province:</Text>
            <Text style={styles.clientInfoValue}>{quoteData.province}</Text>
          </View>

          {quoteData.mpNumber && (
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>MP Number:</Text>
              <Text style={styles.clientInfoValue}>{quoteData.mpNumber}</Text>
            </View>
          )}

          {quoteData.prNumber && (
            <View style={styles.clientInfoRow}>
              <Text style={styles.clientInfoLabel}>PR Number:</Text>
              <Text style={styles.clientInfoValue}>{quoteData.prNumber}</Text>
            </View>
          )}
        </View>

        {/* Quote Items */}
        {quoteResult.items.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.category}>{item.category}</Text>
            {item.details.map((detail, dIndex) => (
              <View key={dIndex} style={styles.row}>
                <Text>{detail.name}</Text>
                {detail.cost && <Text>Cost: {detail.cost}</Text>}
                {detail.subItems && detail.subItems.map((subItem, sIndex) => (
                  <Text key={sIndex} style={styles.detail}>• {subItem}</Text>
                ))}
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.total}>Total Estimated Cost: {quoteResult.total}</Text>

        <View style={styles.signatureSection}>
          <Text style={styles.signatureLine}>Client Signature: _________________________</Text>
          <Text style={styles.signatureLine}>Date: _________________________</Text>
          <Text style={styles.signatureLine}>Company Representative: _________________________</Text>
        </View>

        <Text style={styles.footer}>
          This quote was generated electronically by Best Medical Solutions and is valid for 30 days.
          {'\n'}Quote Number: {quoteNumber}
        </Text>
      </Page>
    </Document>
  );
};

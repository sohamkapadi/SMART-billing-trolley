import PDFDocument from 'pdfkit';

export const generatePDF = (transaction) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add header
      doc.fontSize(20).text('Shopping Bill', { align: 'center' });
      doc.moveDown();

      // Add customer details
      doc.fontSize(12);
      doc.text(`Customer Name: ${transaction.customerName}`);
      doc.text(`Phone Number: ${transaction.phoneNumber}`);
      doc.text(`Trolley ID: ${transaction.trolleyId}`);
      doc.text(`Date: ${new Date(transaction.createdAt).toLocaleString()}`);
      doc.moveDown();

      // Add table headers
      const tableTop = 200;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 200, tableTop);
      doc.text('Price', 300, tableTop);
      doc.text('Total', 400, tableTop);

      // Add items
      doc.font('Helvetica');
      let yPosition = tableTop + 30;
      
      transaction.items.forEach(item => {
        doc.text(item.name, 50, yPosition);
        doc.text(item.quantity.toString(), 200, yPosition);
        doc.text(`₹${item.price.toFixed(2)}`, 300, yPosition);
        doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 400, yPosition);
        yPosition += 30;
      });

      // Add total
      doc.moveDown();
      doc.font('Helvetica-Bold');
      doc.text(`Total Amount: ₹${transaction.totalAmount.toFixed(2)}`, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
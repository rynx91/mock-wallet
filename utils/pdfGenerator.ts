import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface PDFProps {
  referenceId: string;
  accountNumber: string;
  amount: string;
  note?: string;
  dateTime: string;
}

export const sharePDF = async ({
  referenceId,
  accountNumber,
  amount,
  note,
  dateTime,
}: PDFProps) => {
  const html = `
    <html>
      <body>
        <h1>Payment Receipt</h1>
        <p><strong>Reference ID:</strong> ${referenceId}</p>
        <p><strong>Account Number:</strong> ${accountNumber}</p>
        <p><strong>Amount:</strong> RM ${parseFloat(amount).toFixed(2)}</p>
        <p><strong>Note:</strong> ${note ? note : '-'}</p>
        <p><strong>Date & Time:</strong> ${dateTime}</p>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
};

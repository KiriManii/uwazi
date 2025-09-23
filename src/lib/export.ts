import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Poll } from '@/types';

export const generatePDF = async (poll: Poll) => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(20);
  pdf.text('Poll Results Report', 20, 30);
  
  // Poll info
  pdf.setFontSize(16);
  pdf.text(poll.title, 20, 50);
  
  pdf.setFontSize(12);
  if (poll.description) {
    pdf.text(poll.description, 20, 65);
  }
  
  pdf.text(`Total Votes: ${poll.total_votes}`, 20, 80);
  pdf.text(`Created: ${new Date(poll.created_at).toLocaleDateString()}`, 20, 90);
  
  // Results
  let yPos = 110;
  poll.options.forEach((option, index) => {
    const percentage = poll.total_votes > 0 
      ? (option.vote_count / poll.total_votes * 100).toFixed(1)
      : '0';
    
    pdf.text(`${index + 1}. ${option.option_text}`, 20, yPos);
    pdf.text(`${option.vote_count} votes (${percentage}%)`, 20, yPos + 10);
    yPos += 25;
  });
  
  pdf.save(`${poll.title.substring(0, 30)}-results.pdf`);
};

export const generateCSV = (poll: Poll) => {
  const headers = ['Option', 'Votes', 'Percentage'];
  const rows = poll.options.map(option => {
    const percentage = poll.total_votes > 0 
      ? (option.vote_count / poll.total_votes * 100).toFixed(1)
      : '0';
    return [option.option_text, option.vote_count.toString(), percentage + '%'];
  });
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${poll.title.substring(0, 30)}-results.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const Price = ({ amount, className }) => {
  return (
    <p className={className}>{formatCurrency(amount)}</p>
  );
};

const formatCurrency = (amount) => {
  if (isNaN(amount)) return '0 VND';
  
  // Chuyển đổi amount về số và làm tròn, rồi chuyển đổi về định dạng tiền tệ
  const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formattedAmount + ' VND';
};

export default Price;

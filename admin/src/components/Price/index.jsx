import React from 'react';

const Price = ({ amount, className }) => {
  return (
    <p className={className}>{formatCurrency(amount)}</p>
  );
};

const formatCurrency = (amount) => {
  if (isNaN(amount)) return '0 VND';
  
  return amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    + ' VND';
};

export default Price;

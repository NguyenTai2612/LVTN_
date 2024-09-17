import React, { useState } from 'react';

const OrderSearchForm = ({ onSearch }) => {
  const [orderId, setOrderId] = useState('');
  const [userId, setUserId] = useState('');
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ orderId, userId, total, status, paymentMethod, paymentStatus });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Mã đơn hàng" />
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Mã khách hàng" />
      <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Tổng tiền" />
      <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Trạng thái" />
      <input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Phương thức thanh toán" />
      <input type="text" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} placeholder="Thanh toán" />
      <button type="submit">Tìm kiếm</button>
    </form>
  );
};

export default OrderSearchForm;

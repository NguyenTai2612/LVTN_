import React, { useContext, useEffect, useState } from 'react';
import DashboardBox from './components/DashboardBox';
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { apiGetTotalOrders, apiGetTotalProducts, apiGetTotalRevenue, apiGetRevenueByTime, apiGetTopSellingProducts } from '../../services/stats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const Overview = () => {
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [revenueByTime, setRevenueByTime] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHeaderFooterShow(false);

    // Gọi API để lấy dữ liệu
    fetchStatisticsData();
    fetchRevenueByTime(selectedPeriod); // Gọi với khoảng thời gian mặc định
    fetchTopSellingProducts();
  }, [selectedPeriod]); // Thêm selectedPeriod vào dependency array


  const processTopSellingProducts = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map(item => ({
        name: item.Product?.name || 'Tên sản phẩm không xác định', // Lấy tên sản phẩm
        sales: parseInt(item.totalSales, 10) || 0 // Đảm bảo giá trị là số
      }));
    } else {
      return [];
    }
  };

  const fetchStatisticsData = async () => {
    try {
      const products = await apiGetTotalProducts();
      const revenue = await apiGetTotalRevenue();
      const orders = await apiGetTotalOrders();

      setTotalProducts(products.totalProducts);
      setTotalRevenue(Number(revenue.data[0].totalActualRevenue));
      setTotalOrders(orders.totalOrders);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const processRevenueByTime = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, index) => ({
        date: `Ngày ${index + 1}`, // Tạo ngày giả
        revenue: parseInt(item.totalRevenue, 10) || 0 // Đảm bảo giá trị là số
      }));
    } else {
      return [];
    }
  };


  const fetchRevenueByTime = async (period) => {
    try {
      const response = await apiGetRevenueByTime(period);
      console.log('Revenue by Time API Response:', response); // In dữ liệu gốc từ API
      const processedData = processRevenueByTime(response);
      console.log('Processed Revenue by Time Data:', processedData); // In dữ liệu đã xử lý
      setRevenueByTime(processedData);
    } catch (error) {
      console.error('Error fetching revenue by time:', error);
      setRevenueByTime([]);
    }
  };

  const fetchTopSellingProducts = async () => {
    try {
      const response = await apiGetTopSellingProducts();
      console.log('Top Selling Products API Response:', response); // In dữ liệu gốc từ API
      const processedData = processTopSellingProducts(response);
      console.log('Processed Top Selling Products Data:', processedData); // In dữ liệu đã xử lý
      setTopSellingProducts(processedData);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      setTopSellingProducts([]);
    }
  };




  useEffect(() => {
    fetchStatisticsData();
    fetchRevenueByTime(selectedPeriod); // Gọi với khoảng thời gian mặc định
    fetchTopSellingProducts();
  }, [selectedPeriod]); // Thêm selectedPeriod vào dependency array



  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setSelectedPeriod(period);
  };

  useEffect(() => {
    console.log('Revenue by Time Data:', revenueByTime);
    console.log('Top Selling Products Data:', topSellingProducts);
  }, [revenueByTime, topSellingProducts]);

  return (
    <>
      <div className="card shadow my-4 border-0 flex-center p-3" style={{ backgroundColor: '#343A40' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold text-white">Overview</h1>
          <div className="ml-auto flex align-items-center gap-3">
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb component={Link} href="#" label="Dashboard" to="/" icon={<HomeIcon fontSize="small" />} />
              <StyledBreadcrumb label="Overview" />
            </Breadcrumbs>
          </div>
        </div>
      </div>

      <div className="card shadow my-4 border-0">
        <div className="section">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox
              color={["#1da256", "#48d483"]}
              icon={<FaUserCircle />}
              value={totalProducts}
              label="Tổng Số Sản Phẩm"
              isCurrency={false}
            />

            <DashboardBox
              color={["#c012e2", "#eb64fe"]}
              icon={<IoMdCart />}
              value={totalRevenue}
              label="Tổng Doanh Thu"
              isCurrency={true}
            />

            <DashboardBox
              color={["#2c78e5", "#60aff5"]}
              icon={<MdShoppingBag />}
              value={totalOrders}
              label="Tổng Đơn Hàng"
            />
          </div>

          <div className="period-selector">
            <FormControl variant="outlined" style={{ minWidth: 120 }}>
              <InputLabel>Chọn Thời Gian</InputLabel>
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                label="Chọn Thời Gian"
              >
                <MenuItem value="7days">7 Ngày</MenuItem>
                <MenuItem value="week">Tuần</MenuItem>
                <MenuItem value="month">Tháng</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="charts">
            <div className="chart-card">
              <h3>Doanh Thu Theo Thời Gian</h3>
              <LineChart width={600} height={300} data={revenueByTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </div>

            <div className="chart-card">
              <h3>Sản Phẩm Bán Chạy</h3>
              <BarChart width={600} height={300} data={topSellingProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>

            </div>


          </div>
        </div>
      </div>
    </>
  );
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default Overview;

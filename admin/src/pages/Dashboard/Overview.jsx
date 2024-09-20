import React, { useContext, useEffect, useState } from 'react';
import DashboardBox from './components/DashboardBox';
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { apiGetBrand, apiDeleteBrand } from '../../services/brand';
import TooltipBox from '@mui/material/Tooltip';
import { LuClipboardCheck } from "react-icons/lu";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
import { MyContext } from '../../App';
import { apiGetTotalOrders, apiGetTotalProducts, apiGetTotalRevenue } from '../../services/stats';


const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Overview = () => {
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);

  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHeaderFooterShow(false);

    // Gọi API để lấy dữ liệu
    fetchStatisticsData();
  }, []);

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

      <div className="section">
        <div className="dashboardBoxWrapper d-flex">
          <DashboardBox
            color={["#1da256", "#48d483"]}
            icon={<IoMdCart />}
            value={totalProducts}  // Truyền tổng sản phẩm
            label="Tổng Số Sản Phẩm"
            isCurrency={false}  // Không phải tiền tệ
          />

          {/* Hiển thị tổng đơn hàng */}
          <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<LuClipboardCheck />} value={totalOrders} label="Tổng Đơn Hàng" />

          <DashboardBox
            color={["#c012e2", "#eb64fe"]}
            icon={<LiaMoneyBillWaveSolid />}
            value={totalRevenue}  // Truyền tổng doanh thu
            label="Tổng Doanh Thu"
            isCurrency={true}  // Là tiền tệ
          />

        </div>
      </div>
      <div className="card shadow my-4 border-0">

        <div className="flex items-center mb-4 justify-between pt-3 px-4"></div>


      </div>



    </>
  );
};


export default Overview;

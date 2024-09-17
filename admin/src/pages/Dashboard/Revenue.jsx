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
import ProductTable2 from './ProductTable2'
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

const Revenue = () => {

  const [perPage, setPerPage] = useState(10);
  const [showBy, setShowBy] = useState(10);

  const [isAllChecked, setIsAllChecked] = useState(false);

  const selectAll = (e) => {
    if (e.target.checked === true) {
      setIsAllChecked(true)
    } else {
      setIsAllChecked(false)

    }
  }



  const handleChange = (event) => {
    setPerPage(event.target.value);
    setShowBy(event.target.value)
  };


  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHeaderFooterShow(false);
  }, []);
  return (
    <>

      <div className="card shadow my-4 border-0 flex-center p-3" style={{ backgroundColor: '#343A40' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold text-white">Revenue Statistics</h1>
          <div className="ml-auto flex align-items-center gap-3">
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component={Link}
                href="#"
                label="Dashboard"
                to="/"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb label="Revenue Statistics" />
            </Breadcrumbs>
            {/* <Link to={'/brand/add'}>
              <Button className="btn-blue ml-3 p-5 pr-5">Add Brand</Button>
            </Link> */}
          </div>
        </div>
      </div>
      <div className="section">
        


        <div className="card shadow my-4 border-0">
          <div className="flex items-center mb-2 "></div>

          <ProductTable2 />

        </div>



      </div >
    </>
  );
}

export default Revenue;

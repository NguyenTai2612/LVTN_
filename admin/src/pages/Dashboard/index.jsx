import React, {  useContext, useEffect, useState } from 'react';
import DashboardBox from './components/DashboardBox';
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { PureComponent } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Tooltip
} from "recharts";
import Rating from '@mui/material/Rating';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import TooltipBox from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchBox from '../../components/SearchBox';
import Checkbox from '@mui/material/Checkbox';
import ProductList from '../Products/productList';
import { MyContext } from '../../App';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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

const Dashboard = () => {

  const [perPage, setPerPage] = useState(10);
  const [showBy, setShowBy] = useState(10);
  
  const [isAllChecked, setIsAllChecked] = useState(false);

  const selectAll = (e) =>{
      if(e.target.checked===true){
          setIsAllChecked(true)
      }else{
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
      <div className="section">
        <div className="dashboardBoxWrapper d-flex">
          <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} />
          <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} />
          <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} />
        </div>

      
        <ProductList />


        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow my-4 p-4 border-0'>
              <h2 className='mb-4 font-bold'>Sales Report</h2>
              <AreaChart
                width={600}
                height={300}
                data={data}
                syncId="anyId"
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="amt" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow p-4 border-0">
              <h2 className="mb-4 font-bold">Sales Report</h2>
              <BarChart width={600} height={300} data={data}>
                <Bar dataKey="uv" fill="#8884d8" />
              </BarChart>

              I

            </div>

          </div>
        </div>



      </div >
    </>
  );
}

export default Dashboard;

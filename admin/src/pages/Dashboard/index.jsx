import React, {  useState } from 'react';
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

  const demoUrl = 'https://codesandbox.io/p/sandbox/tiny-area-chart-gq23nh';

  return (
    <>
      <div className="section">
        <div className="dashboardBoxWrapper d-flex">
          <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} />
          <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} />
          <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} />
        </div>

        {/* <div className='card shadow my-4 border-0'>
                <div className='flex items-center mb-4 justify-between pt-3 px-4'>
                    <h2 className='mb-0 font-bold text-md '>Best Selling Products</h2>

                    <div className='ml-auto flex items-center gap-4'>
                        <SearchBox />

                        <div className=''>

                            <FormControl size="small" className="w-100">

                                <Select
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100">
                                    <MenuItem value=""> <em>None</em> I
                                    </MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                </Select>

                            </FormControl>

                        </div>

                    </div>

                </div>
                <div className='table-responsive mb-2'>
                    <table className='table w-[100%] table-striped'>
                        <thead className='thead-dark'>
                            <tr>
                                <th><Checkbox {...label} size='small' onChange={selectAll}/></th>
                                <th>PRODUCTS</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRICE</th>
                                <th>STOCK</th>
                                <th>RATING</th>
                                <th>ORDER</th>
                                <th>SALES</th>
                                <th>ACTIONS</th>

                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td><Checkbox {...label} size='small' checked={isAllChecked}/></td>
                                <td>
                                    <div className='flex items-center gap-5 w-[300px]'>
                                        <div className='imgWrapper shadow overflow-hidden w-[25%] h-[25%] rounded-md'>
                                            <img src='https://mironcoder-hotash.netlify.app/images/product/01.webp' />
                                        </div>

                                        <div className='info w-[75%]'>
                                            <h6>Tops and skirt set for Female...</h6>
                                            <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                                        </div>
                                    </div>
                                </td>
                                <td>woman</td>
                                <td>richman</td>
                                <td>
                                    <div className='w-[70px]'>
                                        <del class="old">$21.00</del>
                                        <span class="new text-danger">$21.00</span>
                                    </div>
                                </td>
                                <td>300</td>
                                <td><Rating name="size-small" defaultValue={2.5} precision={0.5} readOnly size='small' /></td>
                                <td>350</td>
                                <td>$35k</td>
                                <td>
                                    <div className='actions flex items-center gap-2'>
                                        <TooltipBox title="Edit" placement="top">
                                            <button className='flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'><FiEdit3 /></button>
                                        </TooltipBox>
                                        <TooltipBox title="View" placement="top">
                                            <button className='flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'><MdOutlineRemoveRedEye /></button>
                                        </TooltipBox>
                                        <TooltipBox title="Delete" placement="top">

                                            <button className='flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'><MdOutlineDeleteOutline /></button>
                                        </TooltipBox>

                                    </div>
                                </td>
                            </tr>                   
           
                        </tbody>
                    </table>
                </div>
                <div className='table-footer flex items-center justify-between py-2 px-3 mb-2'>

                    <div className='flex items-center gap-3'>
                        <h6 className='mb-0 text-sm'>Rows per page</h6>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={perPage}
                            label="Page"
                            onChange={handleChange}
                            size='small'
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </div>
                    <Pagination count={10} color={"primary"} showFirstButton showLastButton className='ml-auto' />
                </div>

            </div> */}
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

import React, { useEffect, useState } from 'react'
import Logo from '../../../src/assets/logo2.png';
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import { MdOutlineDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { TbBrandProducthunt } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { TbCategoryPlus } from "react-icons/tb";
import { LuClipboardCheck } from "react-icons/lu";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";

const Sidebar = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
  // const [isLogin, setIsLogin] = useState(false);


  // useEffect(() => {
  //   const token = localStorage.getItem("token")

  //   if (token !== "" && token !== null && token !== undefined) {
  //     setIsLogin(true)

  //   } else {
  //     history("/login")
  //   }


  // }, [])
  const history = useNavigate()

  const isOpenSubmenu = (index) => {
    if (activeTab === index) {
      setIsToggleSubmenu(!isToggleSubmenu);
    } else {
      setActiveTab(index);
      setIsToggleSubmenu(true);
    }
  };

  return (
    <div className='sidebar fixed top-0 left-0 z-[100] w-[17%]'>
      <Link to={'/'}>
        <div className='logoWrapper' style={{ mixBlendMode: 'lighten' }}>
          <img src={Logo} className='w-100' />
        </div>
      </Link>

      <div className='sidebarTabs px-2'>
        <ul className='flex gap-3 flex-col'>
         

          <li className={`${activeTab === 0 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><MdOutlineDashboard /></span> &nbsp;
              Dashboard
              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 0 && isToggleSubmenu ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 0 && isToggleSubmenu
              ? "colapse"
              : "colapsed"
              }`}
            >
              <div className='submenu'>
              <Link to="/overview">
                  <Button className='w-100 '>Overview</Button>
                </Link>
                <Link to="/product_statistics">
                  <Button className='w-100 '>Product Statistics</Button>
                </Link>
                <Link to="/revenue">
                  <Button className='w-100 '>Revenue Statistics</Button>
                </Link>
                {/* <Link to="/product/upload">
                  <Button className='w-100 '>Category statistics</Button>
                </Link> */}
              </div>
            </div>
          </li>

          <li className={`${activeTab === 1 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab === 1 ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><TbBrandProducthunt /></span> &nbsp;
              Products
              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 1 && isToggleSubmenu ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu
              ? "colapse"
              : "colapsed"
              }`}
            >
              <div className='submenu'>
                <Link to="/product/list">
                  <Button className='w-100 '>Product List</Button>
                </Link>
               
                <Link to="/product/upload">
                  <Button className='w-100 '>Product Upload</Button>
                </Link>
              </div>
            </div>
          </li>

          <li className={`${activeTab === 2 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><MdOutlineCategory /></span> &nbsp;
              Category
              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 2 && isToggleSubmenu ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu
              ? "colapse"
              : "colapsed"
              }`}
            >
              <div className='submenu'>
                <Link to="/category">
                  <Button className='w-100 '>Category List</Button>
                </Link>
                <Link to="/category/add">
                  <Button className='w-100 '>Add Category</Button>
                </Link>
                <Link to="/subCategory">
                  <Button className='w-100 '>Sub Category List</Button>
                </Link>
                <Link to="/subCategory/add">
                  <Button className='w-100 '>Add Sub Category</Button>
                </Link>
                <Link to="/childSubCat">
                  <Button className='w-100 '>Child SubCat List</Button>
                </Link>
                <Link to="/childSubCat/add">
                  <Button className='w-100 '>Add Child SubCat</Button>
                </Link>
              </div>
            </div>
          </li>

          <li className={`${activeTab === 10 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => isOpenSubmenu(10)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><MdOutlineBrandingWatermark /></span> &nbsp;
              Brand
              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 10 && isToggleSubmenu ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 10 && isToggleSubmenu
              ? "colapse"
              : "colapsed"
              }`}
            >
              <div className='submenu'>
                <Link to="/brand">
                  <Button className='w-100 '>Brand List</Button>
                </Link>
                <Link to="/brand/add">
                  <Button className='w-100 '>Add Brand</Button>
                </Link>

              </div>
            </div>
          </li>

          <li className={`${activeTab === 3 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><LuClipboardCheck /></span> &nbsp;
                Order
              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 3 && isToggleSubmenu ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu
              ? "colapse"
              : "colapsed"
              }`}
            >
              <div className='submenu'>
                <Link to="/orders">
                  <Button className='w-100 '>View All Orders</Button>
                </Link>
                <Link to="/pending">
                  <Button className='w-100 '>Pending</Button>
                </Link>
                <Link to="/confirmed">
                  <Button className='w-100 '>Confirmed</Button>
                </Link>
                <Link to="/shipping">
                  <Button className='w-100 '>Shipping</Button>
                </Link>
                <Link to="/completed">
                  <Button className='w-100 '>Completed</Button>
                </Link>
                <Link to="/cancelled">
                  <Button className='w-100 '>Cancelled</Button>
                </Link>
              </div>
            </div>
          </li>

          <li className={`${activeTab === 11 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
            <Link to="/user/list">
              <Button className={`w-100 ${activeTab === 11 ? 'active' : ''}`} onClick={() => isOpenSubmenu(11)}>
                <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                   rounded-md'><FaUserCheck /></span> &nbsp;
                User
                <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
                justify-center ${activeTab === 11 && isToggleSubmenu ? 'rotate' : ''}`}>
                  <FaAngleRight /></span>
              </Button>
            </Link>


          </li>

          <li>
            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                rounded-md'><IoMdNotificationsOutline /></span> &nbsp;
              Notifications
            </Button>
          </li>

          <li>
            <h6 className='text-black/70 capitalize px-3 mt-4'>Authentication</h6>
          </li>

          <li>
            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                rounded-md'><FiUser /></span> &nbsp;
              Login
            </Button>
          </li>

          <li>
            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
               rounded-md'><FiUser /></span> &nbsp;
              Sign Up
            </Button>
          </li>

          <li>
            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
              <span className='icon w-[25px] h-[30px] flex items-center justify-center 
               rounded-md'><RiLockPasswordLine /></span> &nbsp;
              Forgot Password
            </Button>
          </li>

          <li>
            <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
              <span className='icon w-[25px] h-[30px] flex items-center justify-center 
               rounded-md'><AiTwotoneMessage /></span> &nbsp;
              OTP Page
            </Button>
          </li>

          <li>
            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`} onClick={() => isOpenSubmenu(9)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                rounded-md'><IoSettingsOutline /></span> &nbsp;
              Setting
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;

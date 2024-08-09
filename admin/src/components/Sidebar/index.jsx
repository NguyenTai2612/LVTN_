import React, { useState } from 'react'
import Logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
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



const Sidebar = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(!isToggleSubmenu)
  }

  return (
    <div className='sidebar fixed top-0 left-0 z-[100] w-[15%]'>
      <Link to={'/'}>
        <div className='logoWrapper py-3 px-4'>
          <img src={Logo} className='w-100' />
        </div>
      </Link>

      <div className='sidebarTabs px-2 mt-4'>
        <ul className='flex gap-3 flex-col'>
          <li>
            <Link to="/">
              <Button className={`w-100 ${activeTab == 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                <span className='icon w-[25px] h-[30px] flex items-center justify-center 
                 rounded-md'><MdOutlineDashboard /></span> &nbsp;
                Dashboard
              </Button>
            </Link>
          </li>
          <li className={`${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab == 1 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(1)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><TbBrandProducthunt /></span> &nbsp;
              Products

              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 1 && isToggleSubmenu === true ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true
              ? "colapse"
              : "colapsed"

              }`}
            >
              <div className='submenu'>
                <Link to="/product/list">
                  <Button className='w-100 '>Product List</Button>
                </Link>
                <Link to="/product/details">
                  <Button className='w-100 '>Product Details</Button>
                </Link>
                <Link to="/product/upload">
                  <Button className='w-100 '>Product Upload</Button>
                </Link>

              </div>
            </div>
          </li>

          <li className={`${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
            <Button className={`w-100 ${activeTab == 2 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(2)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                 rounded-md'><TbCategoryPlus /></span> &nbsp;
              Category

              <span className={`arrow ml-auto w-[25px] h-[25px] flex items-center
              justify-center ${activeTab === 2 && isToggleSubmenu === true ? 'rotate' : ''}`}>
                <FaAngleRight /></span>
            </Button>

            <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true
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

              </div>
            </div>
          </li>

          <li>

            <Button className={`w-100 ${activeTab == 3 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(3)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                rounded-md'><MdOutlineShoppingCart /></span> &nbsp;
              Order

              <span className='arrow ml-auto w-[25px] h-[25px] flex items-center justify-center'><FaAngleRight /></span>

            </Button>
          </li>
          <li>

            <Button className={`w-100 ${activeTab == 4 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(4)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                rounded-md'><IoMdNotificationsOutline /></span> &nbsp;
              Notifications
            </Button>
          </li>

          <li>
            <h6 className='text-black/70 capitalize px-3 mt-4'>Authentication</h6>
          </li>

          <li>
            <Button className={`w-100 ${activeTab == 5 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(5)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
                rounded-md'><FiUser /></span> &nbsp;
              Login
            </Button>
          </li>

          <li>

            <Button className={`w-100 ${activeTab == 6 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(6)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
               rounded-md'><FiUser /></span> &nbsp;
              Sign Up
            </Button>
          </li>

          <li>
            <Button className={`w-100 ${activeTab == 7 ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
              <span className='icon w-[25px] h-[30px] flex items-center justify-center 
               rounded-md'><RiLockPasswordLine /></span> &nbsp;
              Forgot PassWord
            </Button>
          </li>

          <li>
            <Button className={`w-100 ${activeTab == 8 ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
              <span className='icon w-[25px] h-[30px] flex items-center justify-center 
               rounded-md'><AiTwotoneMessage /></span> &nbsp;
              OTP Page
            </Button>
          </li>

          <li>

            <Button className={`w-100 ${activeTab == 4 ? 'active' : ''}'`} onClick={() => isOpenSubmenu(4)}>
              <span className='icon w-[30px] h-[30px] flex items-center justify-center 
    rounded-md'><IoSettingsOutline /></span> &nbsp;
              Settting
            </Button>
          </li>


        </ul>
      </div>
    </div>
  )
}

export default Sidebar

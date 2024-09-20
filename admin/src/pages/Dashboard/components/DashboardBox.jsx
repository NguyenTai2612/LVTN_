import { HiDotsVertical } from "react-icons/hi";
import Button from '@mui/material/Button';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import { IoIosTimer } from "react-icons/io";
import Price1 from "../../../components/Price/Price1";

const DashboardBox = ({ color, icon, value, label, grow, isCurrency }) => {
    return (
      <Button className="dashboardBox" style={{
        backgroundImage: `linear-gradient(to right, ${color?.[0]}, ${color?.[1]})`
      }}>
        {grow === true ? (
          <span className="chart"><TrendingUpIcon /></span>
        ) : (
          <span className="chart"><TrendingDownIcon /></span>
        )}
        <div className="d-flex w-100">
          <div className="col1">
            <h4 className="text-white mb-0">{label}</h4>
            {/* Kiểm tra nếu là tiền tệ thì dùng Price, nếu không thì hiển thị số nguyên */}
            <span className="text-white">
              {isCurrency ? <Price1 value={value} /> : value}
            </span>
          </div>
          <div className="ml-auto">
            {icon && <span className="icon">{icon}</span>}
          </div>
        </div>
      </Button>
    );
  };
  
  export default DashboardBox;
  
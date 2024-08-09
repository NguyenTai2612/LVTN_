import { FaAngleDown } from "react-icons/fa6";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { MdClose } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import { MyContext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropDown = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);

  const [countryList, setCountryList] = useState([]);

  const context = useContext(MyContext);

  const selectCountry = (index,country) => {
    setSelectedTab(index);
    setIsOpenModal(false);
    context.setSelectCountry(country)
  };

  useEffect(() => {
    setCountryList(context.countryList);
  }, []);

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword !== "") {
      const list = countryList.filter((item) => {
        return item.country.toLowerCase().includes(keyword);
      });
      setCountryList(list);
    } else {
      setCountryList(context.countryList);
    }
  };

  return (
    <div>
      <Button className="countryDrop" onClick={() => setIsOpenModal(true)}>
        <div className="info d-flex flex-column">
          <span className="label">Your Location</span>
          <span className="name">{context.selectCountry!=="" ? context.
          selectCountry.length>10 ? context.selectCountry?.substr(0,10)+'...' : 
          context.selectCountry : 'Select Location'}</span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>

      <Dialog
        onClose={() => setIsOpenModal(false)}
        open={isOpenModal}
        className="locationModal"
        TransitionComponent={Transition}
      >
        <h4 className="mb-0">Choose your Deliver Location</h4>
        <p>Enter your address and we will specify the offer for you area.</p>
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <MdClose />
        </Button>

        <div className="headerSearch w-100">
          <input
            type="text"
            placeholder="Search your area..."
            onChange={filterList}
          />
          <Button>
            <IoIosSearch />
          </Button>
        </div>
        <ul className="countryList mt-3">
          {countryList?.length !== 0 &&
            countryList?.map((item, index) => {
              return (
                <li key={index}>
                  <Button
                    className={`${selectedTab === index ? "active" : ""}`}
                    onClick={() => selectCountry(index,item.country)}
                  >
                    {item.country}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Dialog>
    </div>
  );
};

export default CountryDropDown;

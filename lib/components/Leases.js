import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faSort, faChevronUp, faChevronDown, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
const Leases = () => {
  const {
    theme
  } = useTheme();
  const [leases, setLeases] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("LeaseName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [leasesPerPage] = useState(12);
  const [editLease, setEditLease] = useState(null);
  const [formData, setFormData] = useState({});
  const [subdomain, setSubdomain] = useState("");
  useEffect(() => {
    const extractSubdomain = () => {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        setSubdomain(subdomainPart);
      } else {
        setSubdomain("");
      }
    };
    extractSubdomain();
  }, []);
  useEffect(() => {
    fetchLeases();
  }, []);
  const fetchLeases = async () => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let baseUrl;
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
      } else {
        baseUrl = "https://test.ogfieldticket.com";
      }
      const response = await axios.get(`${baseUrl}/api/leases.php`);
      const data = response.data;
      setLeases(data);
      setFilteredLeases(data);
    } catch (error) {
      console.error("Error fetching leases:", error);
    }
  };
  const handleSearch = e => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = leases.filter(lease => lease.LeaseID.toLowerCase().includes(searchTerm) || lease.LeaseName.toLowerCase().includes(searchTerm) || lease.PumperID.toLowerCase().includes(searchTerm) || lease.RRC.toLowerCase().includes(searchTerm));
    setFilteredLeases(filtered);
    setCurrentPage(1);
  };
  const handleSort = key => {
    let order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortKey(key);
    const sorted = [...filteredLeases].sort((a, b) => {
      if (order === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setFilteredLeases(sorted);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleSortClick = key => {
    handleSort(key);
    setIsMenuOpen(false); // Close the menu after sorting
  };
  const indexOfLastLease = currentPage * leasesPerPage;
  const indexOfFirstLease = indexOfLastLease - leasesPerPage;
  const currentLeases = filteredLeases.slice(indexOfFirstLease, indexOfLastLease);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const leaseAnimation = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(20px)"
    },
    to: {
      opacity: 1,
      transform: "translateY(0)"
    }
  });
  const handleEdit = lease => {
    setEditLease(lease);
    setFormData({
      ...lease
    });
  };
  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setEditLease({
      ...editLease,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const {
        tanks,
        wells
      } = data;
      const formDataTanks = formData.Tanks || [];
      const formDataWells = formData.Wells || [];
      const filteredTanks = tanks.filter(tank => !formDataTanks.some(formTank => formTank.UniqID === tank.UniqID));
      const filteredWells = wells.filter(well => !formDataWells.some(formWell => formWell.UniqID === well.UniqID));
      const updatedLease = {
        ...formData,
        Tanks: [...formDataTanks, ...filteredTanks],
        Wells: [...formDataWells, ...filteredWells]
      };
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let baseUrl;
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
      } else {
        baseUrl = "https://test.ogfieldticket.com";
      }
      const response = await axios.patch(`${baseUrl}/api/leases.php`, updatedLease, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setEditLease(null);
        fetchLeases();
      } else {
        console.error("Error updating lease:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating lease:", error);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `container mx-auto mt-5 p-4 rounded shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl font-bold mb-8"
  }, "Leases"), /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex justify-between items-center space-x-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by LeaseID, LeaseName, PumperID, or RRC",
    value: searchTerm,
    onChange: handleSearch,
    className: `flex-grow px-4 py-2 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`
  }), /*#__PURE__*/React.createElement("button", {
    className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSearch
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    className: "px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400",
    onClick: toggleMenu
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faSort
  }), " Sort"), isMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: `absolute right-0 mt-2 w-48 shadow-lg rounded z-50 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`
  }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", {
    className: `px-4 py-2 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${sortKey === "LeaseName" ? "font-bold" : ""}`,
    onClick: () => handleSortClick("LeaseName")
  }, "Lease Name"), /*#__PURE__*/React.createElement("li", {
    className: `px-4 py-2 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${sortKey === "LeaseID" ? "font-bold" : ""}`,
    onClick: () => handleSortClick("LeaseID")
  }, "Lease ID"), /*#__PURE__*/React.createElement("li", {
    className: `px-4 py-2 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${sortKey === "PumperID" ? "font-bold" : ""}`,
    onClick: () => handleSortClick("PumperID")
  }, "Pumper ID"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  }, currentLeases.map(lease => /*#__PURE__*/React.createElement(animated.div, {
    key: lease.LeaseID,
    style: leaseAnimation,
    className: `p-6 rounded-lg shadow-md relative ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2 right-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: `${theme === "dark" ? "text-white" : "text-gray-800"} hover:text-blue-500`,
    onClick: () => handleEdit(lease)
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faEdit
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-2"
  }, lease.LeaseName), lease.LeaseID && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "LeaseID:"), " ", lease.LeaseID), lease.PumperID && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Pumper:"), " ", lease.PumperID), lease.Active && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Active:"), " ", lease.Active), lease.RRC && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "RRC:"), " ", lease.RRC), lease.Wells && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Wells:"), " ", lease.Wells.length), lease.Tanks && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Tanks:"), " ", lease.Tanks.length))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex justify-center flex-wrap"
  }, Array.from({
    length: Math.ceil(filteredLeases.length / leasesPerPage)
  }, (_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => paginate(i + 1),
    className: `mx-1 my-1 px-2 py-1 rounded ${currentPage === i + 1 ? theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-800 text-white" : theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-800"}`
  }, i + 1))), editLease && /*#__PURE__*/React.createElement(EditLeaseModal, {
    lease: editLease,
    formData: formData,
    onInputChange: handleInputChange,
    onSave: handleSubmit,
    onClose: () => setEditLease(null),
    setFormData: setFormData
  }));
};
const EditLeaseModal = ({
  lease,
  formData,
  onInputChange,
  onSave,
  onClose,
  setFormData,
  purchasers
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const {
    theme
  } = "light";
  const [tagOptions, setTagOptions] = useState([]);
  const [pumperOptions, setPumperOptions] = useState([]);
  const [reliefOptions, setReliefOptions] = useState([]);
  const [subdomain, setSubdomain] = useState("");
  const [tanks] = useState(lease.Tanks || []);
  const [wells] = useState(lease.Wells || []);
  const [expandedTankIndex, setExpandedTankIndex] = useState(null);
  const [expandedWellIndex, setExpandedWellIndex] = useState(null);
  const tankSectionRef = useRef(null);
  const wellSectionRef = useRef(null);
  const [toast, setToast] = useState({
    visible: false,
    message: ""
  });
  useEffect(() => {
    const extractSubdomain = () => {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        setSubdomain(subdomainPart);
      } else {
        setSubdomain("");
      }
    };
    extractSubdomain();
  }, []);
  useEffect(() => {
    fetchOptions();
  }, []);
  const toggleExpandTank = index => {
    setExpandedTankIndex(expandedTankIndex === index ? null : index);
    if (expandedTankIndex !== index) {
      setTimeout(() => {
        tankSectionRef.current.scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    }
  };
  const toggleExpandWell = index => {
    setExpandedWellIndex(expandedWellIndex === index ? null : index);
    if (expandedWellIndex !== index) {
      setTimeout(() => {
        wellSectionRef.current.scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    }
  };
  const handleDeleteWell = async wellId => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let baseUrl;
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
      } else {
        baseUrl = "https://test.ogfieldticket.com";
      }
      const response = await axios.delete(`${baseUrl}/api/leases.php`, {
        data: {
          LeaseID: lease.LeaseID,
          Wells: [{
            UniqID: wellId
          }]
        }
      });
      if (response.status === 200) {
        setFormData({
          ...formData,
          Wells: formData.Wells.filter(well => well.UniqID !== wellId)
        });
      } else {
        console.error("Error deleting well:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting well:", error);
      setToast({
        visible: true,
        message: "Well is currently being used"
      });
    }
  };
  const fetchOptions = async () => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let baseUrl;
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
      } else {
        baseUrl = "https://test.ogfieldticket.com";
      }
      const response = await axios.get(`${baseUrl}/api/usertags.php`);
      const data = response.data;
      const tags = data.filter(item => item.TagID && item.TagDesc);
      const pumpers = data.filter(item => item.Role === "P");
      const reliefPumpers = data.filter(item => item.Role === "P");
      setTagOptions(tags);
      setPumperOptions(pumpers);
      setReliefOptions(reliefPumpers);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
  const handleAddTank = () => {
    setFormData({
      ...formData,
      Tanks: [...formData.Tanks, {
        UniqID: "",
        LeaseID: lease.LeaseID,
        TankID: "",
        Size: "",
        BBLSperInch: "",
        Active: "Y",
        TankType: "T",
        GasCoeff: "",
        ExcludeDrawsFromProd: "N",
        WPTankNum: ""
      }]
    });
    setTimeout(() => {
      tankSectionRef.current.scrollTop = tankSectionRef.current.scrollHeight;
    }, 100);
  };
  const handleDeleteTank = async tankId => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let baseUrl;
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
      } else {
        baseUrl = "https://test.ogfieldticket.com";
      }
      const response = await axios.delete(`${baseUrl}/api/leases.php`, {
        data: {
          LeaseID: lease.LeaseID,
          Tanks: [{
            UniqID: tankId
          }]
        }
      });
      if (response.status === 200) {
        setFormData({
          ...formData,
          Tanks: formData.Tanks.filter(tank => tank.UniqID !== tankId)
        });
      } else {
        console.error("Error deleting tank:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting tank:", error);
      setToast({
        visible: true,
        message: "Tank is currently being used"
      });
    }
  };
  const handleAddWell = () => {
    setFormData({
      ...formData,
      Wells: [...formData.Wells, {
        UniqID: "",
        LeaseID: lease.LeaseID,
        WellID: "",
        Active: "Y",
        PropertyNum: "",
        AllocPct: ""
      }]
    });
    setTimeout(() => {
      wellSectionRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    onSave(e, {
      wells,
      tanks
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-90",
    style: {
      background: "rgba(0, 0, 0, 0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative bg-transparent w-full max-w-3xl mx-auto p-6 rounded-lg",
    style: {
      maxHeight: "800px",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative bg-white"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => handleSubmit(e, tanks, wells),
    className: "max-w-3xl mx-auto p-8 shadow-lg rounded-lg bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center border-b pb-4 mb-6 text-gray-700 border-gray-300"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-3xl font-semibold text-gray-900"
  }, "Edit Lease"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "text-red-500 hover:text-red-700 focus:outline-none"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faTimes,
    size: "lg"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-4 mb-8"
  }, ["basic", "additional", "tags", "tanks", "wells"].map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab,
    type: "button",
    onClick: () => setActiveTab(tab),
    className: `px-4 py-2 rounded-lg focus:outline-none ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} transition duration-150`
  }, tab === "basic" ? "Basic Info" : tab === "additional" ? "Additional Info" : tab === "tags" ? "Tags" : tab === "tanks" ? "Tanks" : "Wells"))), activeTab === "basic" && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "LeaseName",
    className: "block text-sm font-medium text-gray-700"
  }, "Lease Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "LeaseName",
    value: formData.LeaseName,
    onChange: e => setFormData({
      ...formData,
      LeaseName: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "PumperID",
    className: "block text-sm font-medium text-gray-700"
  }, "Pumper"), /*#__PURE__*/React.createElement("select", {
    name: "PumperID",
    value: formData.PumperID,
    onChange: e => setFormData({
      ...formData,
      PumperID: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, pumperOptions.map(pumper => /*#__PURE__*/React.createElement("option", {
    key: pumper.UserID,
    value: pumper.UserID
  }, pumper.FullName)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "ReliefID",
    className: "block text-sm font-medium text-gray-700"
  }, "Relief"), /*#__PURE__*/React.createElement("select", {
    name: "ReliefID",
    value: formData.ReliefID || "",
    onChange: e => setFormData({
      ...formData,
      ReliefID: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, formData.ReliefID ? "Remove Relief" : "Select Relief"), reliefOptions.map(relief => /*#__PURE__*/React.createElement("option", {
    key: relief.UserID,
    value: relief.UserID
  }, relief.FullName)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Active",
    className: "block text-sm font-medium text-gray-700"
  }, "Active"), /*#__PURE__*/React.createElement("select", {
    name: "Active",
    value: formData.Active || "",
    onChange: e => setFormData({
      ...formData,
      Active: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Y"
  }, "Yes"), /*#__PURE__*/React.createElement("option", {
    value: "N"
  }, "No")))), activeTab === "additional" && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "LeaseID",
    className: "block text-sm font-medium text-gray-700"
  }, "Lease ID"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "LeaseID",
    value: formData.LeaseID || "",
    readOnly: true,
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "District",
    className: "block text-sm font-medium text-gray-700"
  }, "District"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "District",
    value: formData.District || "",
    onChange: e => setFormData({
      ...formData,
      District: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "RRC",
    className: "block text-sm font-medium text-gray-700"
  }, "RRC"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "RRC",
    value: formData.RRC || "",
    onChange: e => setFormData({
      ...formData,
      RRC: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "WellType",
    className: "block text-sm font-medium text-gray-700"
  }, "Well Type"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "WellType",
    value: formData.WellType || "",
    readOnly: true,
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:border-blue-300 transition duration-150"
  })), formData.WellType !== "INJ" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "ShowOil",
    className: "block text-sm font-medium text-gray-700"
  }, "Show Oil"), /*#__PURE__*/React.createElement("select", {
    name: "ShowOil",
    value: formData.ShowOil || "",
    onChange: e => setFormData({
      ...formData,
      ShowOil: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Y"
  }, "Yes"), /*#__PURE__*/React.createElement("option", {
    value: "N"
  }, "No"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "ShowWater",
    className: "block text-sm font-medium text-gray-700"
  }, "Show Water"), /*#__PURE__*/React.createElement("select", {
    name: "ShowWater",
    value: formData.ShowWater || "",
    onChange: e => setFormData({
      ...formData,
      ShowWater: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Y"
  }, "Yes"), /*#__PURE__*/React.createElement("option", {
    value: "N"
  }, "No"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "ShowGas",
    className: "block text-sm font-medium text-gray-700"
  }, "Show Gas"), /*#__PURE__*/React.createElement("select", {
    name: "ShowGas",
    value: formData.ShowGas || "",
    onChange: e => setFormData({
      ...formData,
      ShowGas: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Y"
  }, "Yes"), /*#__PURE__*/React.createElement("option", {
    value: "N"
  }, "No")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Purchaser",
    className: "block text-sm font-medium text-gray-700"
  }, "Purchaser"), /*#__PURE__*/React.createElement("select", {
    name: "Purchaser",
    value: formData.Purchaser || "",
    onChange: e => setFormData({
      ...formData,
      Purchaser: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Purchaser"), purchasers && purchasers.map(purchaser => /*#__PURE__*/React.createElement("option", {
    key: purchaser.PurchaserID,
    value: purchaser.PurchaserID
  }, purchaser.PurchaserName)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "PurchaserLeaseNo",
    className: "block text-sm font-medium text-gray-700"
  }, "Purchaser Lease No"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "PurchaserLeaseNo",
    value: formData.PurchaserLeaseNo || "",
    onChange: e => setFormData({
      ...formData,
      PurchaserLeaseNo: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), formData.WellType === "INJ" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "MaxInj",
    className: "block text-sm font-medium text-gray-700"
  }, "Max Inj"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "MaxInj",
    value: formData.MaxInj || "",
    onChange: e => setFormData({
      ...formData,
      MaxInj: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "MaxPressure",
    className: "block text-sm font-medium text-gray-700"
  }, "Max Pressure"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "MaxPressure",
    value: formData.MaxPressure || "",
    onChange: e => setFormData({
      ...formData,
      MaxPressure: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Target",
    className: "block text-sm font-medium text-gray-700"
  }, "Target"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "Target",
    value: formData.Target || "",
    onChange: e => setFormData({
      ...formData,
      Target: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "PropertyNum",
    className: "block text-sm font-medium text-gray-700"
  }, "External Property #"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "PropertyNum",
    value: formData.PropertyNum || "",
    onChange: e => setFormData({
      ...formData,
      PropertyNum: e.target.value
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }))), activeTab === "tags" && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-6"
  }, [1, 2, 3, 4].map(tagNum => /*#__PURE__*/React.createElement("div", {
    key: tagNum
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: `Tag${tagNum}`,
    className: "block text-sm font-medium text-gray-700"
  }, "Tag ", tagNum), /*#__PURE__*/React.createElement("select", {
    name: `Tag${tagNum}`,
    value: formData[`Tag${tagNum}`] || "",
    onChange: e => setFormData({
      ...formData,
      [`Tag${tagNum}`]: e.target.value
    }),
    className: "mt-1 form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Tag"), tagOptions && tagOptions.map(tag => /*#__PURE__*/React.createElement("option", {
    key: tag.TagID,
    value: tag.TagID
  }, tag.TagID, " - ", tag.TagDesc)))))), activeTab === "tanks" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: tankSectionRef,
    className: "space-y-4"
  }, formData.Tanks.map((tank, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "border rounded-lg p-4"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => toggleExpandTank(index),
    className: "flex justify-between items-center cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, "Tank ", tank.TankID), /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: expandedTankIndex === index ? faChevronUp : faChevronDown
  })), expandedTankIndex === index && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "TankID",
    className: "block text-sm font-medium text-gray-700"
  }, "Tank ID"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Tank ID",
    value: tank.TankID,
    onChange: e => setFormData({
      ...formData,
      Tanks: formData.Tanks.map((t, i) => i === index ? {
        ...t,
        TankID: e.target.value
      } : t)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150",
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "size",
    className: "block text-sm font-medium text-gray-700"
  }, "Size"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Size",
    value: tank.Size || 0,
    onChange: e => setFormData({
      ...formData,
      Tanks: formData.Tanks.map((t, i) => i === index ? {
        ...t,
        Size: e.target.value
      } : t)
    }),
    step: "1" // Added step attribute
    ,
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "BBL",
    className: "block text-sm font-medium text-gray-700"
  }, "BBLSperInch"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "BBLS per Inch",
    value: tank.BBLSperInch,
    onChange: e => setFormData({
      ...formData,
      Tanks: formData.Tanks.map((t, i) => i === index ? {
        ...t,
        BBLSperInch: e.target.value
      } : t)
    }),
    step: "0.01" // Added step attribute
    ,
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Type",
    className: "block text-sm font-medium text-gray-700"
  }, "Type"), /*#__PURE__*/React.createElement("select", {
    value: tank.TankType,
    onChange: e => setFormData({
      ...formData,
      Tanks: formData.Tanks.map((t, i) => i === index ? {
        ...t,
        TankType: e.target.value
      } : t)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  }, /*#__PURE__*/React.createElement("option", {
    value: "F"
  }, "Frac"), /*#__PURE__*/React.createElement("option", {
    value: "T"
  }, "Tank"), /*#__PURE__*/React.createElement("option", {
    value: "W"
  }, "Water"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "TankNum",
    className: "block text-sm font-medium text-gray-700"
  }, "Tank Num"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "External Tank Num\r ",
    value: tank.WPTankNum,
    onChange: e => setFormData({
      ...formData,
      Tanks: formData.Tanks.map((t, i) => i === index ? {
        ...t,
        WPTankNum: e.target.value
      } : t)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "active",
    className: "block text-sm font-medium text-gray-700"
  }, "Active"), /*#__PURE__*/React.createElement("select", {
    value: tank.Active,
    onChange: e => setFormData({
      ...formData,
      Tanks: formData.Tanks.map((t, i) => i === index ? {
        ...t,
        Active: e.target.value
      } : t)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150",
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: "Y"
  }, "Active"), /*#__PURE__*/React.createElement("option", {
    value: "N"
  }, "Inactive"))), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleDeleteTank(tank.UniqID),
    className: "p-2 bg-red-500 text-white rounded hover:bg-red-600"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faTrash
  }))))))), toast.visible && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 flex items-center justify-center z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-red-500 text-white p-4 rounded shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, toast.message), /*#__PURE__*/React.createElement("button", {
    onClick: () => setToast({
      ...toast,
      visible: false
    }),
    className: "ml-4"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faTimes
  })))))), activeTab === "wells" && /*#__PURE__*/React.createElement("div", {
    ref: wellSectionRef,
    className: "space-y-4 mt-6"
  }, formData.Wells?.map((well, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "border rounded-lg p-4"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => toggleExpandWell(index),
    className: "flex justify-between items-center cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, "Well ", well.WellID), /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: expandedWellIndex === index ? faChevronUp : faChevronDown
  })), expandedWellIndex === index && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "WellID",
    className: "block text-sm font-medium text-gray-700"
  }, "Well ID"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Well ID",
    value: well.WellID,
    onChange: e => setFormData({
      ...formData,
      Wells: formData.Wells.map((w, i) => i === index ? {
        ...w,
        WellID: e.target.value
      } : w)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150",
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "ExternalPropertyNumber",
    className: "block text-sm font-medium text-gray-700"
  }, "External Property #"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "External Property #",
    value: well.ExternalPropertyNumber,
    onChange: e => setFormData({
      ...formData,
      Wells: formData.Wells.map((w, i) => i === index ? {
        ...w,
        ExternalPropertyNumber: e.target.value
      } : w)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "API",
    className: "block text-sm font-medium text-gray-700"
  }, "API"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "API",
    value: well.API,
    onChange: e => setFormData({
      ...formData,
      Wells: formData.Wells.map((w, i) => i === index ? {
        ...w,
        API: e.target.value
      } : w)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "RRC",
    className: "block text-sm font-medium text-gray-700"
  }, "RRC"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "RRC",
    value: well.RRC,
    onChange: e => setFormData({
      ...formData,
      Wells: formData.Wells.map((w, i) => i === index ? {
        ...w,
        RRC: e.target.value
      } : w)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "CP",
    className: "block text-sm font-medium text-gray-700"
  }, "CP"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "CP",
    value: well.CP,
    onChange: e => setFormData({
      ...formData,
      Wells: formData.Wells.map((w, i) => i === index ? {
        ...w,
        CP: e.target.value
      } : w)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Active",
    className: "block text-sm font-medium text-gray-700"
  }, "Active"), /*#__PURE__*/React.createElement("select", {
    value: well.Active,
    onChange: e => setFormData({
      ...formData,
      Wells: formData.Wells.map((w, i) => i === index ? {
        ...w,
        Active: e.target.value
      } : w)
    }),
    className: "mt-1 form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150",
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: "Y"
  }, "Active"), /*#__PURE__*/React.createElement("option", {
    value: "N"
  }, "Inactive"))), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleDeleteWell(well.UniqID),
    className: "p-2 bg-red-500 text-white rounded hover:bg-red-600"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faTrash
  })))))), toast.visible && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 flex items-center justify-center z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-red-500 text-white p-4 rounded shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, toast.message), /*#__PURE__*/React.createElement("button", {
    onClick: () => setToast({
      ...toast,
      visible: false
    }),
    className: "ml-4"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faTimes
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "sticky bottom-0 p-4 bg-white bg-opacity-90"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end space-x-4"
  }, activeTab === "wells" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddWell,
    className: "p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faPlus
  }), " Add Well"), activeTab === "tanks" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddTank,
    className: "p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faPlus
  }), " Add Tank"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      onClose();
    },
    className: "p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  }, "Save")))))));
};
export default Leases;
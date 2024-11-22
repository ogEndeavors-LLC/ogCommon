import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faUser, faLock, faPenFancy } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function UserProfile() {
  const {
    theme
  } = useTheme();
  const {
    userID
  } = useUser();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const extractSubdomain = () => {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        console.log(`sub domain ${subdomainPart}`);
        setSubdomain(subdomainPart);
      } else {
        console.log(`sub domain ${parts}`);
        setSubdomain("");
      }
    };
    extractSubdomain();
  }, []);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const hostname = window.location.hostname;
        const parts = hostname.split(".");
        let baseUrl;
        if (parts.length > 2) {
          const subdomainPart = parts.shift();
          baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
          console.log(`Using subdomain URL: ${baseUrl}`);
        } else {
          baseUrl = "https://test.ogfieldticket.com";
          console.log(`Using default URL: ${baseUrl}`);
        }
        const response = await axios.get(`${baseUrl}/api/userdetails.php?id=${userID}`);
        if (response.data.success) {
          const users = response.data.users;
          const currentUser = users.find(user => user.UserID === userID);
          setUser(currentUser);
          setEditedUser(currentUser);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    if (userID) {
      fetchUserDetails();
    }
  }, [userID, subdomain]);
  const handleEditProfile = () => {
    setEditMode(true);
  };
  const handleSaveProfile = async () => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let baseUrl;
      if (parts.length > 2) {
        const subdomainPart = parts.shift();
        baseUrl = `https://${subdomainPart}.ogfieldticket.com`;
        console.log(`Using subdomain URL: ${baseUrl}`);
      } else {
        baseUrl = "https://test.ogfieldticket.com";
        console.log(`Using default URL: ${baseUrl}`);
      }
      const response = await fetch(`${baseUrl}/api/userdetails.php`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editedUser)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(editedUser);
          setEditMode(false);
        } else {}
      } else {
        console.error("Error updating user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };
  const handleCancelEdit = () => {
    setEditedUser(user);
    setEditMode(false);
  };
  const handleInputChange = event => {
    const {
      name,
      value
    } = event.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };
  const handleChangePassword = async () => {
    try {
      const updatedUser = {
        UserID: user.UserID,
        Sec: password // Assuming 'Sec' is your backend field for password
      };
      const baseUrl = subdomain ? `https://${subdomain}.ogfieldticket.com` : "https://test.ogfieldticket.com";
      const response = await axios.patch(`${baseUrl}/api/userdetails.php`, updatedUser);
      if (response.data.success) {
        setPassword("");
        setConfirmPassword("");
        setShowPasswordChange(false); // Hide password fields after change
      } else {
        console.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };
  const getRoleLabel = role => {
    switch (role) {
      case "P":
        return "Pumper";
      case "O":
        return "Operator";
      case "A":
        return "Admin";
      case "I":
        return "Partner";
      default:
        return "";
    }
  };
  if (!user) {
    return /*#__PURE__*/React.createElement("div", null, "Loading...");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} py-8`
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-4xl mx-auto relative ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate("/home"),
    className: `absolute top-5 right-5 p-2 rounded-full hover:bg-opacity-30 transition-all ${theme === "dark" ? "hover:bg-white" : "hover:bg-gray-400"}`
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    className: `w-6 h-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M3 9.5V21h7V14h4v7h7V9.5M9 3l3-3 3 3M2 9h20"
  }))), /*#__PURE__*/React.createElement("div", {
    className: `p-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-full w-24 h-24 bg-gray-300 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faUser,
    size: "3x"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-full text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xl font-semibold"
  }, user.FullName), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 truncate"
  }, getRoleLabel(user.Role)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faEnvelope,
    className: `h-6 w-6 mr-4 ${theme === "dark" ? "text-white" : "text-black"}`
  }), /*#__PURE__*/React.createElement("p", {
    className: `font-semibold ${theme === "dark" ? "text-white" : "text-black"}`
  }, "Email")), editMode ? /*#__PURE__*/React.createElement("input", {
    type: "email",
    name: "Email",
    value: editedUser.Email,
    onChange: handleInputChange,
    className: `text-gray-400 bg-transparent border-b focus:outline-none focus:border-blue-500 w-full ${theme === "dark" ? "border-gray-500 text-white" : "border-gray-300 text-black"}`
  }) : /*#__PURE__*/React.createElement("p", {
    className: `truncate mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`
  }, user.Email)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faPhone,
    className: `h-6 w-6 mr-4 ${theme === "dark" ? "text-white" : "text-black"}`
  }), /*#__PURE__*/React.createElement("p", {
    className: `font-semibold ${theme === "dark" ? "text-white" : "text-black"}`
  }, "Phone")), editMode ? /*#__PURE__*/React.createElement("input", {
    type: "tel",
    name: "Phone",
    value: editedUser.Phone,
    onChange: handleInputChange,
    className: `text-gray-400 bg-transparent border-b focus:outline-none focus:border-blue-500 w-full ${theme === "dark" ? "border-gray-500 text-white" : "border-gray-300 text-black"}`
  }) : /*#__PURE__*/React.createElement("p", {
    className: `truncate mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`
  }, user.Phone)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faLock,
    className: `h-6 w-6 mr-4 ${theme === "dark" ? "text-white" : "text-black"}`
  }), /*#__PURE__*/React.createElement("p", {
    className: `font-semibold ${theme === "dark" ? "text-white" : "text-black"}`
  }, "UserID")), /*#__PURE__*/React.createElement("p", {
    className: `truncate mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`
  }, user.UserID)), user.Role === "A" || user.Role === "P" ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faPenFancy,
    className: `h-6 w-6 mr-4 ${theme === "dark" ? "text-white" : "text-black"}`
  }), /*#__PURE__*/React.createElement("p", {
    className: `font-semibold ${theme === "dark" ? "text-white" : "text-black"}`
  }, "Message")), /*#__PURE__*/React.createElement("p", {
    className: `truncate mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`
  }, user.Message)) : null), showPasswordChange && /*#__PURE__*/React.createElement("div", {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold mb-4 text-center"
  }, "Change Password"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "New Password",
    value: password,
    onChange: e => setPassword(e.target.value),
    className: "text-gray-400 bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 w-full"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Confirm Password",
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    className: "text-gray-400 bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 w-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full",
    onClick: handleChangePassword
  }, "Save Password"), /*#__PURE__*/React.createElement("button", {
    className: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full",
    onClick: () => setShowPasswordChange(false)
  }, "Cancel")))), /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-4 mt-8"
  }, editMode ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full",
    onClick: handleSaveProfile
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full",
    onClick: handleCancelEdit
  }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
    className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full",
    onClick: handleEditProfile
  }, "Edit Profile"), /*#__PURE__*/React.createElement("button", {
    className: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full",
    onClick: () => setShowPasswordChange(true)
  }, "Change Password"))))));
}
export default UserProfile;
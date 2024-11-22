import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import HomePage from "./components/HomePage";
import CreateFieldTicket from "./components/CreateFieldTicket";
import Layout from "./components/Layout";
import "./index.css";
import FieldTicketEntry from "./components/FieldTicketEntry";
import { ThemeProvider } from "./components/ThemeContext";
import Summary from "./components/Summary";
import JobForm from "./components/JobTypeForm";
import Details from "./components/Details";
import MasterList from "./components/ItemMasterList";
import TicketGrid from "./components/TicketGrid";
import { UserProvider } from "./components/UserContext";
import Admin from "./components/admin";
function App() {
  return /*#__PURE__*/React.createElement(UserProvider, null, /*#__PURE__*/React.createElement(ThemeProvider, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    element: /*#__PURE__*/React.createElement(SignInPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/home",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(HomePage, null))
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/create-field-ticket/:highestTicketNumber",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(CreateFieldTicket, null), " ")
  }), " ", /*#__PURE__*/React.createElement(Route, {
    path: "/ticketGrid",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(TicketGrid, null), " ")
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/view-field-ticket",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Summary, null))
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/field-ticket-entry",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(FieldTicketEntry, null))
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/job-form",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(JobForm, null))
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/profile-details",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Details, null))
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/admin-panel",
    element: /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Admin, null))
  }))));
}
export default App;
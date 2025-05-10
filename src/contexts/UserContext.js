// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  /* ──────────────── STATE ──────────────── */
  const [userRole, setUserRole] = useState("");
  const [userID, setUserID] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [subdomain, setSubdomain] = useState(""); // NEW
  const [userEmail, setUserEmail] = useState(""); // NEWER
  const [userPhone, setUserPhone] = useState(""); // NEWER

  /* ──────────── INIT FROM localStorage ──────────── */
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserID = localStorage.getItem("userID");
    const storedCompanyName = localStorage.getItem("companyName");
    const storedJobRole = localStorage.getItem("jobRole");
    const storedSubdomain = localStorage.getItem("subdomain"); // NEW
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserPhone = localStorage.getItem("userPhone");

    if (storedUserRole) setUserRole(storedUserRole);
    if (storedUserID) setUserID(storedUserID);
    if (storedCompanyName) setCompanyName(storedCompanyName);
    if (storedJobRole) setJobRole(storedJobRole);
    if (storedSubdomain) setSubdomain(storedSubdomain); // NEW
    if (storedUserEmail) setUserEmail(storedUserEmail);
    if (storedUserPhone) setUserPhone(storedUserPhone);
  }, []);

  /**
   * Updates all user info in context and localStorage.
   *
   * @param {string}  role       - User role
   * @param {string}  id         - User ID
   * @param {string}  company    - Company name
   * @param {string}  jRole      - Job role
   * @param {string}  sub        - Subdomain                           (NEW)
   * @param {string}  email      - User email (optional)
   * @param {string}  phone      - User phone number (optional)
   */
  const setUser = (role, id, company, jRole, sub, email = "", phone = "") => {
    setUserRole(role);
    setUserID(id);
    setCompanyName(company);
    setJobRole(jRole);
    setSubdomain(sub); // NEW
    setUserEmail(email);
    setUserPhone(phone);

    localStorage.setItem("userRole", role);
    localStorage.setItem("userID", id);
    localStorage.setItem("companyName", company);
    localStorage.setItem("jobRole", jRole);
    localStorage.setItem("subdomain", sub); // NEW
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phone);
  };

  /* ──────────────── PROVIDER ──────────────── */
  return (
    <UserContext.Provider
      value={{
        userRole,
        userID,
        companyName,
        jobRole,
        subdomain, // NEW
        userEmail,
        userPhone,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

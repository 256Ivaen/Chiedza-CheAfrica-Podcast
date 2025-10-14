"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletPage from "../components/wallet/wallet";

export default function Wallet() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("wallet")
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, []);


  return <WalletPage />;

  return (

    <WalletPage
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    />
)
}

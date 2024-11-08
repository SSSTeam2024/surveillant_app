import React, { useEffect, useState } from "react";

const Navdata = () => {
  //state data

  const [isTracking, setIsTracking] = useState(false);
  const [isStudents, setIsStudents] = useState(false);
  const [isSchedle, setIsSchedle] = useState(false);
  const [isFeedbackClaims, setIsFeedbackClaims] = useState(false);
  const [isPayement, setIsPayement] = useState(false);
  const [isAccounts, setIsAccounts] = useState(false);
  const [isTools, setIsTools] = useState(false);
  const [isHelp, setIsHelp] = useState(false);
  const [isMessagerie, setIsMessagerie] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        // var id: any = item.getAttribute("subitems");
        // if (document.getElementById(id)){
        //     document.getElementById(id).classList.remove("show");
        // }
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (iscurrentState !== "Tracking") {
      setIsTracking(false);
    }
    if (iscurrentState !== "Messagerie") {
      setIsMessagerie(false);
    }
    if (iscurrentState !== "Students") {
      setIsStudents(false);
    }
    if (iscurrentState !== "Programming") {
      setIsSchedle(false);
    }
    if (iscurrentState !== "Feedback&Claims") {
      setIsFeedbackClaims(false);
    }
    if (iscurrentState !== "Payement") {
      setIsPayement(false);
    }
    if (iscurrentState !== "Accounts") {
      setIsAccounts(false);
    }
    if (iscurrentState !== "Tools") {
      setIsTools(false);
    }
    if (iscurrentState !== "Help") {
      setIsHelp(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
  }, [
    iscurrentState,
    isTracking,
    isStudents,
    isSchedle,
    isFeedbackClaims,
    isPayement,
    isAccounts,
    isTools,
    isHelp,
    isMessagerie,
    isMultiLevel,
  ]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "Dashboard",
      label: "Tableau de bord",
      icon: "ph ph-gauge",
      link: "/dashboard",
    },

    {
      id: "invoices",
      label: "Retards",
      link: "/retards",
      parentId: "invoices",
      icon: "ph ph-person-simple-run",
    },
    {
      id: "invoices",
      label: "Sorties",
      link: "/sorties",
      parentId: "invoices",
      icon: "ph ph-buildings",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Widgets from "./Widgets";
import { useSelector } from "react-redux";
//import images
import { RootState } from "app/store"; // Import your RootState interface
import { selectCurrentUser } from "features/account/authSlice";

const Dashboard = () => {
  document.title = "Tableau de bord | Leaders Ecole Privée";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Widgets />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;

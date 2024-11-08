import React, { useState } from "react";
import { Card, Col, Modal, Row } from "react-bootstrap";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import avtar1 from "assets/images/users/avatar-1.jpg";
import ModalNewRetard from "Common/ModalNewRetard";
import ModalNewSortie from "Common/ModalNewSortie";
interface WidgetsProps {
  id: number;
  name: string;
  amount: number;
  decimal?: number;
  perstange?: string;
  badgeColor: string;
  icon: string;
  iconColor: string;
}
const Widgets = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const handleFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setSelectedFilter(newFilter);
  };

  const [modal_AddRetard, setmodal_AddRetard] = useState<boolean>(false);
  function tog_AddRetard() {
    setmodal_AddRetard(!modal_AddRetard);
  }

  const [modal_AddSortie, setmodal_AddSortie] = useState<boolean>(false);
  function tog_AddSortie() {
    setmodal_AddSortie(!modal_AddSortie);
  }

  return (
    <React.Fragment>
      <Row className="d-flex justify-content-center ">
        <Col xxl={4}>
          <Card
            className="bg-primary opacity-50 card-animate d-flex align-items-center p-4 m-2 mt-5 w-100"
            style={{ cursor: "pointer", height: "100%" }}
            onClick={tog_AddRetard}
          >
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <img
                    src="data:image/png;base64,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"
                    alt="hurry"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="card-text">
                    <span className="fw-medium fs-24 text-white">
                      Nouveau Retard
                    </span>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={4}>
          <Card
            className="bg-primary opacity-75 card-animate d-flex align-items-center p-4 m-2 mt-5 w-100 h-100"
            style={{ cursor: "pointer" }}
            onClick={tog_AddSortie}
          >
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <img
                    src="data:image/png;base64,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"
                    alt="leave-house"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="card-text">
                    <span className="fw-medium fs-24 text-white">
                      Nouvelle Sortie
                    </span>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        className="fade"
        id="createModal"
        show={modal_AddRetard}
        onHide={() => {
          tog_AddRetard();
        }}
        centered
        size="xl"
      >
        <ModalNewRetard
          modal_AddRetard={modal_AddRetard}
          setmodal_AddRetard={setmodal_AddRetard}
        />
      </Modal>
      <Modal
        className="fade"
        id="createSortieModal"
        show={modal_AddSortie}
        onHide={() => {
          tog_AddSortie();
        }}
        centered
        size="xl"
      >
        <ModalNewSortie
          modal_AddSortie={modal_AddSortie}
          setmodal_AddSortie={setmodal_AddSortie}
        />
      </Modal>
    </React.Fragment>
  );
};

export default Widgets;

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useCreateRetardMutation,
  useDeleteRetardMutation,
  useGetRetardsQuery,
} from "features/retards/retardSlice";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import avatar from "assets/images/3607444.png";
import SimpleBar from "simplebar-react";
import { formatDate, formatTime } from "helpers/data_time_format";
import ModalNewRetard from "Common/ModalNewRetard";
import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";

const Retards = () => {
  const { data = [] } = useGetRetardsQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();
  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  const [deleteRetard] = useDeleteRetardMutation();
  const [calculatedTrimestre, setCalculatedTrimestre] = useState<string>("");
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Paramètre Absence SMS a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-based
    const currentDay = currentDate.getDate();

    if (
      (currentMonth === 9 && currentDay >= 15) ||
      currentMonth === 10 ||
      currentMonth === 11 ||
      (currentMonth === 12 && currentDay <= 31)
    ) {
      setCalculatedTrimestre("1er trimestre");
    } else if (
      (currentMonth === 1 && currentDay >= 1) ||
      currentMonth === 2 ||
      (currentMonth === 3 && currentDay <= 31)
    ) {
      setCalculatedTrimestre("2eme trimestre");
    } else if (
      (currentMonth === 4 && currentDay >= 1) ||
      currentMonth === 5 ||
      (currentMonth === 6 && currentDay <= 30)
    ) {
      setCalculatedTrimestre("3eme trimestre");
    }
  }, []);

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const AlertDelete = async (_id: any) => {
    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Vous ne pouvez pas revenir en arrière?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprime-le !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteRetard(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le retard est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le retard est en sécurité :)",
            "info"
          );
        }
      });
  };
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedStudentIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const [modal_AddRetard, setmodal_AddRetard] = useState<boolean>(false);
  function tog_AddRetard() {
    setmodal_AddRetard(!modal_AddRetard);
  }
  const [modal_UpdateRetard, setmodal_UpdateRetard] = useState<boolean>(false);
  function tog_UpdateRetard() {
    setmodal_UpdateRetard(!modal_UpdateRetard);
  }

  const handleSelectClasse = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const result = await fetchEtudiantsByClasseId(value).unwrap();
    setStudents(result);
    setSelectedClasse(value);
  };

  const [createRetard] = useCreateRetardMutation();

  const initialRetard = {
    date: "",
    heure: "",
    id_eleve: "",
    trimestre: "",
  };

  const [retard, setRetard] = useState(initialRetard);
  const currentDate = new Date();
  const { date, heure, id_eleve, trimestre } = retard;

  const onSubmitRetard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createRetardPromises = selectedStudentIds.map((id) => {
        const retard = {
          ...initialRetard,
          id_eleve: id,
          date: formatDate(currentDate),
          heure: formatTime(currentDate),
          trimestre: calculatedTrimestre,
        };
        return createRetard(retard);
      });

      await Promise.all(createRetardPromises);
      notifySuccess();
      setRetard(initialRetard);
      setSelectedStudentIds([]);
      setSelectedClasse("");
      setStudents([]);
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Eleve</span>,
      selector: (row: any) => (
        <div>
          <span>{row.id_eleve.prenom}</span> <span>{row.id_eleve.nom}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => (
        <div>
          <span>{row.date}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure</span>,
      selector: (row: any) => (
        <div>
          <span>{row.heure}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Trimèstre</span>,
      selector: (row: any) => (
        <div>
          <span>{row.trimestre}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                // onClick={() => tog_UpdateRetard()}
                state={row}
              >
                <i
                  className="ri-edit-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => AlertDelete(row._id)}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const [searchRetardTerm, setSearchRetardTerm] = useState("");
  const handleSearchRetardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchRetardTerm(event.target.value);
  };

  const getFilteredRetards = () => {
    let filteredRetards = [...data];

    if (searchRetardTerm) {
      filteredRetards = filteredRetards.filter(
        (retard: any) =>
          retard
            ?.date!.toLowerCase()
            .includes(searchRetardTerm.toLowerCase()) ||
          retard
            ?.heure!.toLowerCase()
            .includes(searchRetardTerm.toLowerCase()) ||
          retard
            ?.trimestre!.toLowerCase()
            .includes(searchRetardTerm.toLowerCase()) ||
          retard?.id_eleve
            .prenom!.toLowerCase()
            .includes(searchRetardTerm.toLowerCase()) ||
          retard?.id_eleve
            .nom!.toLowerCase()
            .includes(searchRetardTerm.toLowerCase())
      );
    }

    return filteredRetards.reverse();
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredClasses = () => {
    let filteredClasses = AllClasses;

    if (searchTerm) {
      filteredClasses = filteredClasses.filter((classe: any) =>
        classe?.nom_classe!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredClasses;
  };

  const [searchEtudiantTerm, setSearchEtudiantTerm] = useState("");
  const handleSearchEtudiantChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchEtudiantTerm(event.target.value);
  };

  const getFilteredEtudiants = () => {
    let filteredEtudiants = students;

    if (searchEtudiantTerm) {
      filteredEtudiants = filteredEtudiants.filter(
        (eleve: any) =>
          eleve
            ?.nom!.toLowerCase()
            .includes(searchEtudiantTerm.toLowerCase()) ||
          eleve
            ?.prenom!.toLowerCase()
            .includes(searchEtudiantTerm.toLowerCase())
      );
    }

    return filteredEtudiants;
  };

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const [updateAbsenceSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const absence_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Retard"
      );
      setFormData((prevState) => ({
        ...prevState,
        id: absence_sms_setting[0]?._id!,
        status: absence_sms_setting[0]?.sms_status!,
      }));
    }
  }, [AllSmsSettings, isLoading]);

  const onChangeAbsenceSmsSetting = () => {
    let updateData = {
      id: formData.id,
      status: formData.status === "1" ? "0" : "1",
    };
    updateAbsenceSmsSetting(updateData)
      .then(() =>
        setFormData((prevState) => ({
          ...prevState,
          status: formData.status === "1" ? "0" : "1",
        }))
      )
      .then(() => notifySuccess());
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Retards" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchRetardTerm}
                        onChange={handleSearchRetardChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={7}>
                    <Row>
                      <Col lg={2}>
                        <Form.Label>Status SMS: </Form.Label>
                      </Col>
                      <Col lg={2}>
                        <div className="form-check form-switch">
                          <input
                            key={formData?.id!}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={formData.id}
                            checked={formData.status === "1"}
                            onChange={() => onChangeAbsenceSmsSetting()}
                          />
                          {formData.status === "0" ? (
                            <span className="badge bg-warning-subtle text-warning badge-border">
                              Désactivé
                            </span>
                          ) : (
                            <span className="badge bg-info-subtle text-info badge-border">
                              Activé
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddRetard()}
                      >
                        <i
                          className="ri-add-fill align-middle"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "1.5em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        ></i>{" "}
                        <span>Ajouter Retard</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredRetards()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
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
            id="updateModal"
            show={modal_UpdateRetard}
            onHide={() => {
              tog_UpdateRetard();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Retard
              </h1>
            </Modal.Header>
            <Modal.Body>
              {/* <UpdateSalle
                modal_UpdateRetard={modal_UpdateRetard}
                setmodal_UpdateRetard={setmodal_UpdateRetard}
              /> */}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Retards;

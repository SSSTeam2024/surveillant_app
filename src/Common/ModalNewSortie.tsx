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
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import avatar from "assets/images/3607444.png";
import SimpleBar from "simplebar-react";
import { formatDate, formatTime } from "helpers/data_time_format";
import {
  useCreateSortieMutation,
  useDeleteSortieMutation,
  useGetSortiesQuery,
} from "features/sorties/sortieSlice";

interface ChildProps {
  modal_AddSortie: boolean;
  setmodal_AddSortie: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalNewSortie: React.FC<ChildProps> = ({
  modal_AddSortie,
  setmodal_AddSortie,
}) => {
  const { data = [] } = useGetSortiesQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();
  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  const [deleteSortie] = useDeleteSortieMutation();
  const [calculatedTrimestre, setCalculatedTrimestre] = useState<string>("");
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le sortie a été créé avec succès",
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
          deleteSortie(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le sortie est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le sortie est en sécurité :)",
            "info"
          );
        }
      });
  };
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  function tog_AddSortie() {
    setmodal_AddSortie(!modal_AddSortie);
  }
  const handleSelect = (id: string) => {
    setSelectedStudentIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const [modal_UpdateSortie, setmodal_UpdateSortie] = useState<boolean>(false);
  function tog_UpdateSortie() {
    setmodal_UpdateSortie(!modal_UpdateSortie);
  }

  const handleSelectClasse = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const result = await fetchEtudiantsByClasseId(value).unwrap();
    setStudents(result);
    setSelectedClasse(value);
  };

  const [createSortie] = useCreateSortieMutation();

  const initialSortie = {
    date: "",
    heure: "",
    id_eleve: "",
    trimestre: "",
  };

  const [sortie, setSortie] = useState(initialSortie);
  const currentDate = new Date();
  const { date, heure, id_eleve, trimestre } = sortie;

  const onSubmitSortie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createRetardPromises = selectedStudentIds.map((id) => {
        const sorty = {
          ...initialSortie,
          id_eleve: id,
          date: formatDate(currentDate),
          heure: formatTime(currentDate),
          trimestre: calculatedTrimestre,
        };
        return createSortie(sorty);
      });

      await Promise.all(createRetardPromises);
      notifySuccess();
      setSortie(initialSortie);
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

  const [searchRetardTerm, setSearchRetardTerm] = useState("");
  const handleSearchRetardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchRetardTerm(event.target.value);
  };

  const getFilteredSorties = () => {
    let filteredSorties = [...data];

    if (searchRetardTerm) {
      filteredSorties = filteredSorties.filter(
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

    return filteredSorties.reverse();
  };

  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <h1 className="modal-title fs-5" id="createModalLabel">
          Ajouter Sortie
        </h1>
      </Modal.Header>
      <Modal.Body>
        <Form className="create-form" onSubmit={onSubmitSortie}>
          <Row>
            <Col lg={4}>
              <Card>
                <Card.Header>
                  <div className="hstack gap-4">
                    <h6>Classes</h6>{" "}
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mx-n3">
                    <SimpleBar
                      autoHide={false}
                      style={{ maxHeight: "335px" }}
                      className="px-3"
                    >
                      <div className="list-group">
                        {getFilteredClasses().map((classe) => (
                          <label className="list-group-item">
                            <input
                              className="form-check-input me-1"
                              name="exampleRadios"
                              type="radio"
                              value={classe._id}
                              onChange={handleSelectClasse}
                            />
                            {classe.nom_classe}
                          </label>
                        ))}
                      </div>
                    </SimpleBar>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card>
                <Card.Header>
                  <div className="hstack gap-4">
                    <h6>Elèves</h6>{" "}
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchEtudiantTerm}
                        onChange={handleSearchEtudiantChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mx-n3">
                    <SimpleBar
                      autoHide={false}
                      style={{ maxHeight: "335px" }}
                      className="px-3"
                    >
                      <ul className="list-group">
                        {getFilteredEtudiants().map((eleve) => (
                          <li
                            className={`list-group-item ${
                              selectedStudentIds.includes(eleve._id!)
                                ? "bg-primary text-white"
                                : ""
                            }`}
                            aria-disabled="true"
                            onClick={() => handleSelect(eleve?._id!)}
                            key={eleve?._id!}
                          >
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0">
                                {eleve?.avatar === "" ||
                                eleve?.avatar.endsWith(".") ? (
                                  <img
                                    src={avatar}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                ) : (
                                  <img
                                    src={`${
                                      process.env.REACT_APP_BASE_URL
                                    }/etudiantFiles/${eleve?.avatar!}`}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                )}
                              </div>
                              <div className="flex-grow-1 ms-2">
                                {eleve.prenom} {eleve.nom}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </SimpleBar>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <div className="hstack gap-2 justify-content-end">
              <Button
                variant="light"
                onClick={() => {
                  tog_AddSortie();
                  setSortie(initialSortie);
                  setSelectedStudentIds([]);
                  setSelectedClasse("");
                  setStudents([]);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  tog_AddSortie();
                }}
                type="submit"
                variant="success"
                id="addNew"
              >
                Ajouter
              </Button>
            </div>
          </Row>
        </Form>
      </Modal.Body>
    </React.Fragment>
  );
};
export default ModalNewSortie;

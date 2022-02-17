import "./App.css";
import Card from "./components/Modal";
import { app, db } from "./firebaseConn";
import {
  getDocs,
  collection,
  doc,
  deleteDoc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "./components/Modal";
import { computeHeadingLevel } from "@testing-library/react";

function App() {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [headingText, setHeadingText] = useState("");
  const [columnToEdit, setColumnToEdit] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isEdit, setISEditMode] = useState(false);

  const columnCollectionsRef = collection(db, "columns");
  const taskRef = collection(db, "Tasks");

  // const columnCollectionsRef = collection(db, "Tasks");

  useEffect(() => {
    const getColumns = async () => {
      const columnsArray = [];
      try {
        const columns = await getDocs(columnCollectionsRef);

        console.log(columns);
        for (let i = 0; i < columns.docs.length; i++) {
          // console.log(columns.docs[i].data());

          const temp = {
            id: columns.docs[i].id,
            ...columns.docs[i].data(),
            tasks: [],
          };
          // console.log(temp);

          const q = query(taskRef, where("columnId", "==", columns.docs[i].id));
          const data = await getDocs(q);
          console.log(data);

          for (let j = 0; j < data.docs.length; j++) {
            temp.tasks.push(data.docs[j].data());
            console.log(data.docs[j].data());
          }

          // data.docs.map((el) => {
          // });
          columnsArray.push(temp);
        }
        // columns.docs.map(async (column) => {
        //   const temp = { id: column.id, ...column.data(), tasks: [] };

        //   const taskRef = collection(db, "Tasks");

        //   const q = query(taskRef, where("columnId", "==", column.id));
        //   const data = await getDocs(q);

        //   data.docs.map((el) => {
        //     temp.tasks.push(el.data());

        //     console.log(el.data());
        //   });
        //   columnsArray.push(temp);
        // });
        // setcolumns(columns.docs.map((user) => ({ ...user.data(), id: user.id })));
      } catch (error) {
        console.log(error);
      }
      // console.log({ columnsArray });
      setColumns(columnsArray);
    };
    getColumns();
  }, []);
  console.log(columns);

  // const addNewColumnFunc = async (e) => {
  //   e.preventDefault();
  //   console.log(e);
  //   // console.log(user);
  //   try {
  //     await addDoc(columnCollectionsRef, user);
  //     console.log("created");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onSubmit = async () => {
    if (!isEdit) {
      const body = { CardHeading: headingText };
      try {
        const data = await addDoc(columnCollectionsRef, body);
        const temp = [...columns];
        temp.push({ ...body, id: data.id, tasks: [] });
        setColumns(temp);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("asd");
      const userDoc = doc(db, "columns", columnToEdit);
      try {
        await updateDoc(userDoc, { CardHeading: headingText });
        const temp = [...columns];
        const temp2 = temp.find((el) => el.id === columnToEdit);

        temp2.CardHeading = headingText;
        setColumns(temp);

        console.log("Updated");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onEdit = async () => {
    console.log("asd");
    const body = {
      taskName,
      taskDesc: taskDescription,
      columnId: columnToEdit,
    };
    try {
      const data = await addDoc(taskRef, body);
      const temp = [...columns];
      const temp2 = temp.find((el) => el.id === columnToEdit);
      temp2.tasks.push({ ...body, id: data.id });
      setColumns(temp);
    } catch (error) {
      console.log(error);
    }

    console.log({ body });
  };

  const onDelete = async (id, idx) => {
    const userDoc = doc(db, "columns", id);
    try {
      await deleteDoc(userDoc);
      const temp = [...columns];
      temp.splice(idx, 1);
      setColumns(temp);
      console.log("Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "lightgray",
          }}
        >
          <h2>TASKS</h2>
          <button
            style={{
              padding: "0.5rem",
              margin: "1rem",
              width: "200px",
              cursor: "pointer",
            }}
            onClick={() => setCreateModal(true)}
          >
            Add New Column
          </button>
          <Modal
            show={createModal}
            handleClose={() => setCreateModal(false)}
            onSubmit={onSubmit}
          >
            <input
              type="text"
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
            />
          </Modal>
          <Modal
            show={editModal}
            handleClose={() => setEditModal(false)}
            onSubmit={onEdit}
          >
            <input
              type="text"
              value={taskName}
              placeholder="Name"
              onChange={(e) => setTaskName(e.target.value)}
            />
            <input
              type="text"
              value={taskDescription}
              placeholder="Description"
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </Modal>
          {/* <button type="button" onClick={this.showModal}>
            Open
          </button> */}
        </div>
        {/* {columns.map((e) => {
          console.log(e);
          <Card id={e.id} heading={e.CardHeading} tasks={e.tasks} />;
        })} */}
        <DragDropContext>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  backgroundColor: "lightgrey",
                  display: "flex",
                  gap: "1.5rem",
                  padding: "1rem",
                  margin: "1rem",
                }}
              >
                {columns.map((e, i) => {
                  console.log(e);
                  return (
                    <Draggable key={e.id} draggableId={e.id}>
                      {(provided) => (
                        <card
                          key={e.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="characters-thumb"
                            style={{
                              backgroundColor: "whitesmoke",
                              padding: "0.3rem",
                            }}
                          >
                            {/* <img src={thumb} alt={`${name} Thumb`} /> */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <h3>{e.CardHeading}</h3>
                              <div style={{ display: "flex", gap: "0.1rem" }}>
                                <button
                                  style={{
                                    margin: "1rem",
                                    width: "40px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setISEditMode(true);
                                    setCreateModal(true);
                                    setHeadingText(e.CardHeading);
                                    setColumnToEdit(e.id);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    margin: "1rem",
                                    width: "55px",
                                    cursor: "pointer",
                                    backgroundColor: "red",
                                    color: "white",
                                  }}
                                  onClick={() => onDelete(e.id, i)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            {e.tasks.map((task) => (
                              <>
                                <h5>{task.taskName}</h5>
                                <h5>{task.taskDesc}</h5>
                              </>
                            ))}
                            <div>
                              <button
                                onClick={() => {
                                  setColumnToEdit(e.id);
                                  setEditModal(true);
                                }}
                              >
                                Add Task
                              </button>
                            </div>
                          </div>
                        </card>
                      )}
                    </Draggable>
                  );
                })}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;

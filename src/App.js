import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from 'react-bootstrap/Dropdown';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: "",
      editUserInput: "",
      list: [],
      nextId: 0,
      editId: null,
      deadline: "",
      subtaskInput: "",
    };
  }

  componentDidMount() {
    const savedList = localStorage.getItem("todoList");
    const savedNextId = localStorage.getItem("nextId");

    if (savedList) {
      this.setState({
        list: JSON.parse(savedList),
        nextId: savedNextId ? JSON.parse(savedNextId) : 0,
      });
    }
  }

  updateInput(value) {
    this.setState({ userInput: value });
  }

  updateEditInput(value) {
    this.setState({ editUserInput: value });
  }

  updateDeadline(value) {
    this.setState({ deadline: value });
  }

  updateSubtaskInput(value) {
    this.setState({ subtaskInput: value });
  }

  addItem() {
    if (this.state.userInput.trim() !== "") {
      const userInput = {
        id: this.state.nextId,
        value: this.state.userInput,
        deadline: this.state.deadline,
        subtasks: [],
      };

      const list = [...this.state.list, userInput];

      this.setState(
        {
          list,
          userInput: "",
          nextId: this.state.nextId + 1,
          deadline: "",
        },
        () => {
          localStorage.setItem("todoList", JSON.stringify(this.state.list));
          localStorage.setItem("nextId", JSON.stringify(this.state.nextId));
        }
      );
    }
  }

  deleteItem(id) {
    const list = this.state.list.filter((item) => item.id !== id);

    this.setState({ list }, () => {
      localStorage.setItem("todoList", JSON.stringify(this.state.list));
    });
  }

  editItem(id) {
    const itemToEdit = this.state.list.find((item) => item.id === id);
    this.setState({
      editUserInput: itemToEdit.value,
      deadline: itemToEdit.deadline || "",
      editId: id,
    });
  }

  updateItem() {
    const updatedList = this.state.list.map((item) =>
      item.id === this.state.editId
        ? { ...item, value: this.state.editUserInput, deadline: this.state.deadline }
        : item
    );

    this.setState(
      {
        list: updatedList,
        userInput: "",
        editUserInput: "",
        deadline: "",
        editId: null,
      },
      () => {
        localStorage.setItem("todoList", JSON.stringify(this.state.list));
      }
    );
  }

  addSubtask(parentId) {
    const updatedList = this.state.list.map((item) =>
      item.id === parentId
        ? {
          ...item,
          subtasks: [
            ...item.subtasks,
            { id: Math.random(), value: this.state.subtaskInput },
          ],
        }
        : item
    );

    this.setState(
      {
        list: updatedList,
        subtaskInput: "",
      },
      () => {
        localStorage.setItem("todoList", JSON.stringify(this.state.list));
      }
    );
  }

  deleteSubtask(parentId, subtaskId) {
    const updatedList = this.state.list.map((item) =>
      item.id === parentId
        ? {
          ...item,
          subtasks: item.subtasks.filter((subtask) => subtask.id !== subtaskId),
        }
        : item
    );

    this.setState(
      {
        list: updatedList,
      },
      () => {
        localStorage.setItem("todoList", JSON.stringify(this.state.list));
      }
    );
  }

  moveTaskUp(index) {
    if (index > 0) {
      const newList = [...this.state.list];
      const [movedItem] = newList.splice(index, 1);
      newList.splice(index - 1, 0, movedItem);

      this.setState({ list: newList }, () => {
        localStorage.setItem("todoList", JSON.stringify(newList));
      });
    }
  }

  moveTaskDown(index) {
    if (index < this.state.list.length - 1) {
      const newList = [...this.state.list];
      const [movedItem] = newList.splice(index, 1);
      newList.splice(index + 1, 0, movedItem);

      this.setState({ list: newList }, () => {
        localStorage.setItem("todoList", JSON.stringify(newList));
      });
    }
  }

  render() {
    return (
      <Container>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3rem",
            fontWeight: "bolder",
          }}
        >
          Kakemity VS ToDo
        </Row>
        <hr />
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Tasks"
                size="lg"
                value={this.state.userInput}
                onChange={(item) => this.updateInput(item.target.value)}
              />
              <FormControl
                type="date"
                value={this.state.deadline}
                onChange={(e) => this.updateDeadline(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
              <Button
                variant="primary"
                style={{ marginLeft: "10px" }}
                onClick={() => this.addItem()}
              >
                ADD
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 7, offset: 2 }}>
            <ListGroup>
              {this.state.list.map((item, index) => (
                <ListGroup.Item
                  key={item.id}
                  variant="dark"
                  action
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    {this.state.editId === item.id ? (
                      <InputGroup>
                        <FormControl
                          value={this.state.editUserInput}
                          onChange={(e) => this.updateEditInput(e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => {
                            this.updateItem();
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => this.setState({ editId: null, editUserInput: "" })}
                        >
                          Cancel
                        </Button>
                      </InputGroup>
                    ) : (
                      <>
                        {item.value}{" "}
                        {item.deadline && (
                          <small className="text-muted">
                            (Deadline: {item.deadline})
                          </small>
                        )}
                      </>
                    )}
                  </div>
                  <div className="col-11 d-flex justify-content-end position-absolute">
                    {this.state.editId !== item.id && (
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => this.editItem(item.id)}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => this.deleteItem(item.id)}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                  <InputGroup className="mt-4">
                    <FormControl
                      placeholder="Add subtask"
                      value={this.state.subtaskInput}
                      onChange={(e) => this.updateSubtaskInput(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => this.addSubtask(item.id)}
                    >
                      Add Subtask
                    </Button>
                  </InputGroup>
                  <ListGroup className="mt-2">
                    {item.subtasks.map((subtask) => (
                      <ListGroup.Item
                        key={subtask.id}
                        variant="light"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {subtask.value}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            this.deleteSubtask(item.id, subtask.id)
                          }
                        >
                          Delete
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className="d-flex justify-content-between">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => this.moveTaskUp(index)}
                      disabled={index === 0} // Disable if it's the first item
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => this.moveTaskDown(index)}
                      disabled={index === this.state.list.length - 1} // Disable if it's the last item
                    >
                      ↓
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;

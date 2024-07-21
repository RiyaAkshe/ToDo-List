import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000";

    // Function to handle form submission for adding a new Todo item
    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "") {
            // POST request to create a new Todo item
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error("Unable to create Todo item");
                    }
                })
                .then((data) => {
                    // Update state with the new Todo item
                    setTodos([...todos, data]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    };

    // Function to fetch all Todo items from the server on component mount
    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        // GET request to fetch all Todo items
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((data) => {
                setTodos(data);
            })
            .catch((error) => {
                setError("Unable to fetch Todo items");
            });
    };

    // Function to handle editing a Todo item
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    // Function to handle updating a Todo item
    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            // PUT request to update a Todo item
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            })
                .then((res) => {
                    if (res.ok) {
                        // Update the corresponding Todo item in state
                        const updatedTodos = todos.map((item) =>
                            item._id === editId ? { ...item, title: editTitle, description: editDescription } : item
                        );
                        setTodos(updatedTodos);
                        setEditTitle("");
                        setEditDescription("");
                        setEditId(-1);
                        setMessage("Item updated successfully!");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                    } else {
                        throw new Error("Unable to update Todo item");
                    }
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    };

    // Function to cancel the edit mode
    const handleEditCancel = () => {
        setEditId(-1);
    };

    // Function to handle deleting a Todo item
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            // DELETE request to delete a Todo item
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE",
            })
                .then(() => {
                    // Remove the deleted Todo item from state
                    const updatedTodos = todos.filter((item) => item._id !== id);
                    setTodos(updatedTodos);
                    setMessage("Item deleted successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                })
                .catch((error) => {
                    setError("Unable to delete Todo item");
                });
        }
    };

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>ToDo Project with MERN stack</h1>
            </div>
            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li key={item._id} className="list-group-item bg-light d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </>
                                    ) : (
                                        <div className="form-group d-flex gap-2">
                                            <input
                                                placeholder="Title"
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                value={editTitle}
                                                className="form-control"
                                                type="text"
                                            />
                                            <input
                                                placeholder="Description"
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                value={editDescription}
                                                className="form-control"
                                                type="text"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 ? (
                                        <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                    ) : (
                                        <button className="btn btn-warning" onClick={handleUpdate}>
                                            Update
                                        </button>
                                    )}
                                    {editId === -1 ? (
                                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                                            Delete
                                        </button>
                                    ) : (
                                        <button className="btn btn-danger" onClick={handleEditCancel}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

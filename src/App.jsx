
import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  LayoutDashboard,
  X,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  LoaderCircle
} from "lucide-react";

import "./App.css";

// Backend API URL
// const API_URL = "http://localhost:5000/students";
const API_URL = "https://student-management-backend-demo.onrender.com/students";

function App() {

  // State variables
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    course: ""
  });

  const [notification, setNotification] = useState({
    message: "",
    type: ""
  });

  // Show notification
  const notify = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  // =====================================
  // GET ALL STUDENTS
  // =====================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students when component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // =====================================
  // HANDLE FORM INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open Add Student Form
  const openAddForm = () => {
    setEditMode(false);

    setFormData({
      id: "",
      name: "",
      course: ""
    });

    setShowForm(true);
  };

  // Open Edit Student Form
  const openEditForm = (student) => {
    setEditMode(true);

    setFormData({
      id: student.id,
      name: student.name,
      course: student.course
    });

    setShowForm(true);
  };

  // =====================================
  // ADD / UPDATE STUDENT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editMode
        ? `${API_URL}/${formData.id}`
        : API_URL;

      const method = editMode ? "PUT" : "POST";

      const body = editMode
        ? {
            id: Number(formData.id),
            name: formData.name.trim(),
            course: formData.course.trim()
          }
        : {
            id: Number(formData.id),
            name: formData.name.trim(),
            course: formData.course.trim()
          };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      notify(
        editMode
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      setShowForm(false);

      fetchStudents();

    } catch (error) {
      notify(error.message, "error");
    }
  };

  // =====================================
  // DELETE STUDENT
  // =====================================

  const deleteStudent = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      notify("Student deleted successfully!");

      fetchStudents();

    } catch (error) {
      notify(error.message, "error");
    }
  };

  // =====================================
  // SEARCH STUDENTS
  // =====================================

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();

    return (
      String(student.id).includes(keyword) ||
      student.name.toLowerCase().includes(keyword) ||
      student.course.toLowerCase().includes(keyword)
    );
  });

  // =====================================
  // DASHBOARD UI
  // =====================================

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={26} />
          </div>

          <div>
            <h2>EduManage</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="sidebar-menu">

          <p className="menu-heading">MENU</p>

          <div className="menu-item active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </div>

          <div className="menu-item">
            <Users size={19} />
            <span>Students</span>
          </div>

          <div className="menu-item">
            <BookOpen size={19} />
            <span>Courses</span>
          </div>

        </div>

        <div className="sidebar-footer">
          <div className="profile-avatar">A</div>

          <div>
            <strong>Administrator</strong>
            <span>Admin Account</span>
          </div>
        </div>

      </aside>


      {/* Main Content */}
      <main className="main-content">

        {/* Top Header */}
        <header className="topbar">

          <div>
            <p className="breadcrumb">Pages / Dashboard</p>
            <h1>Student Management</h1>
          </div>

          <div className="topbar-right">
            <span className="admin-label">Admin Panel</span>
            <div className="profile-avatar top-avatar">A</div>
          </div>

        </header>


        <div className="dashboard-content">

          {/* Welcome Section */}
          <section className="welcome-section">
            <div>
              <h2>Welcome Back, Administrator!</h2>
              <p>
                Manage your students and their courses from one place.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={openAddForm}
            >
              <Plus size={19} />
              Add New Student
            </button>
          </section>


          {/* Statistics Cards */}
          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon purple">
                <Users size={24} />
              </div>

              <div>
                <p>Total Students</p>
                <h2>{students.length}</h2>
                <span>Registered students</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <GraduationCap size={24} />
              </div>

              <div>
                <p>Active Courses</p>
                <h2>
                  {new Set(students.map(s => s.course.toLowerCase())).size}
                </h2>
                <span>Unique courses</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <BookOpen size={24} />
              </div>

              <div>
                <p>Student Records</p>
                <h2>{students.length}</h2>
                <span>Available records</span>
              </div>
            </div>

          </section>


          {/* Students Table Section */}
          <section className="table-section">

            <div className="table-header">

              <div>
                <h2>All Students</h2>
                <p>View and manage registered students.</p>
              </div>

              <button
                className="refresh-btn"
                onClick={fetchStudents}
                title="Refresh students"
              >
                <RefreshCw size={17} />
                Refresh
              </button>

            </div>


            {/* Search Bar */}
            <div className="search-container">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search by student name, ID or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  <X size={17} />
                </button>
              )}
            </div>


            {/* Students Table */}
            <div className="table-responsive">

              <table>

                <thead>
                  <tr>
                    <th>STUDENT ID</th>
                    <th>STUDENT NAME</th>
                    <th>COURSE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td colSpan="4" className="empty-state">
                        <LoaderCircle className="spin" size={28} />
                        <p>Loading students...</p>
                      </td>
                    </tr>

                  ) : filteredStudents.length === 0 ? (

                    <tr>
                      <td colSpan="4" className="empty-state">
                        <Users size={32} />
                        <p>
                          {search
                            ? "No matching students found."
                            : "No students available. Add your first student!"}
                        </p>
                      </td>
                    </tr>

                  ) : (

                    filteredStudents.map((student) => (

                      <tr key={student.id}>

                        <td>
                          <span className="student-id">
                            #{student.id}
                          </span>
                        </td>

                        <td>
                          <div className="student-info">
                            <div className="student-avatar">
                              {student.name.charAt(0).toUpperCase()}
                            </div>

                            <strong>{student.name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="course-badge">
                            {student.course}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">

                            <button
                              className="edit-btn"
                              title="Edit student"
                              onClick={() => openEditForm(student)}
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              className="delete-btn"
                              title="Delete student"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

            <div className="table-footer">
              Showing {filteredStudents.length} of {students.length} students
            </div>

          </section>

          <footer className="footer">
            AI Rivals Infotech © 2026
            <span>www.airivalsinfotech.com</span>
          </footer>

        </div>

      </main>


      {/* Add / Edit Student Modal */}
      {showForm && (

        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>
                  {editMode ? "Edit Student" : "Add New Student"}
                </h2>

                <p>
                  {editMode
                    ? "Update the student information."
                    : "Enter the details to register a new student."}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                <X size={21} />
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Student ID</label>

                <input
                  type="number"
                  name="id"
                  placeholder="Enter student ID"
                  value={formData.id}
                  onChange={handleChange}
                  disabled={editMode}
                  required
                  min="1"
                />
              </div>


              <div className="form-group">
                <label>Student Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength="20"
                  required
                />
              </div>


              <div className="form-group">
                <label>Course</label>

                <input
                  type="text"
                  name="course"
                  placeholder="Enter course name"
                  value={formData.course}
                  onChange={handleChange}
                  maxLength="20"
                  required
                />
              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <CheckCircle size={18} />
                  {editMode ? "Update Student" : "Save Student"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* Notification */}
      {notification.message && (

        <div className={`notification ${notification.type}`}>

          {notification.type === "success"
            ? <CheckCircle size={20} />
            : <AlertCircle size={20} />}

          <span>{notification.message}</span>

        </div>

      )}

    </div>
  );
}

export default App;

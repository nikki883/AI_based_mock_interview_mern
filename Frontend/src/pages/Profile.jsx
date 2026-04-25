import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [editDepartment, setEditDepartment] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  // const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        // setDepartment(res.data.user.department || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInterviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/interview/user`,
          { withCredentials: true }
        );
        if (res.data.success) setInterviews(res.data.interviews);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      }
    };

    fetchProfile();
    fetchInterviews();
  }, []);

  const handleUploadPicture = async (e) => {
    e.preventDefault();
    if (!profilePic) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/upload-profile-picture`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Profile picture updated!");
      setUser((prev) => ({ ...prev, profilePic: res.data.imageUrl }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image");
    }
  };

  // const handleUpdateDepartment = async () => {
  //   try {
  //     const res = await axios.put(
  //       `${import.meta.env.VITE_API_URL}/api/users/select-department`,
  //       { department },
  //       { withCredentials: true }
  //     );
  //     alert("Department updated!");
  //     console.log(res.data);
  //     setUser((prev) => ({ ...prev, department }));
  //     setEditDepartment(false);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error updating department");
  //   }
  // };

  const handleChangePassword = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        { newPassword: password },
        { withCredentials: true }
      );
      alert("Password changed successfully!");
      console.log(res.data);
      setEditPassword(false);
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profilePic || "https://res.cloudinary.com/demo/image/upload/v123456789/default_profile.png"}
            alt="Profile"
            className="profile-pic"
          />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUploadPicture} className="upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
          <button type="submit">Upload Picture</button>
        </form>

        {/* <div className="profile-section">
          <h3>Department</h3>
          {editDepartment ? (
            <div className="edit-field">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <button onClick={handleUpdateDepartment}>Save</button>
            </div>
          ) : (
            <p onClick={() => setEditDepartment(true)} className="editable-text">
              {user.department || "Click to set department"}
            </p>
          )}
        </div> */}

        <div className="profile-section">
          <h3>Password</h3>
          {editPassword ? (
            <div className="edit-field">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleChangePassword}>Save</button>
            </div>
          ) : (
            <p onClick={() => setEditPassword(true)} className="editable-text">
              ••••••••
            </p>
          )}
        </div>
      </div>

      <div className="interview-history">
        <h3>Interview Feedback</h3>
        {interviews.length === 0 ? (
          <p className="no-interviews">No interviews found.</p>
        ) : (
          interviews.map((interview, i) => (
            <div key={i} className="interview-card">
              <div className="interview-header">
                <strong>{interview.subject}</strong>
                <span className="interview-date">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </span>
              </div>
              {interview.questions.map((q, j) => (
                <div key={j} className="feedback-item">
                  <p><strong>Q:</strong> {q.question}</p>
                  <p><strong>Feedback:</strong> {q.evaluation.feedback || "No feedback yet."}</p>
                  <div className="score-row">
                    <span>Fluency: {q.evaluation.fluency}/10</span>
                    <span>Technical: {q.evaluation.technicalAccuracy}/10</span>
                    <span>Grammar: {q.evaluation.grammar}/10</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;

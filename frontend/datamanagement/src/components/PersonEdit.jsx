import React, { useState, useEffect } from 'react';
import PersonForm from './PersonForm';

const PersonEdit = ({ personId, onSuccess, onCancel }) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://vonus-form-1.onrender.com/get-person.php?id=${personId}`);
        const result = await response.json();

        if (result && result.person) {
          setPerson(result.person);
        } else {
          console.error("Person not found");
        }
      } catch (error) {
        console.error("Error fetching person:", error);
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchPerson();
    }
  }, [personId]);

  const handleUpdate = async (updatedData) => {
    const data = new FormData();
    data.append("id", personId);
    data.append("name", updatedData.name);
    data.append("gender", updatedData.gender);
    data.append("dob", updatedData.dob);
    data.append("address", updatedData.address);
    data.append("hobbies", JSON.stringify(updatedData.hobbies));
    if (updatedData.display_picture instanceof File) {
      data.append("displayPic", updatedData.display_picture);
    }

    try {
      const response = await fetch("https://vonus-form-1.onrender.com/update-person.php", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result?.success) {
        alert("Person updated successfully!");
        onSuccess();
      } else {
        alert(result.error || "Failed to update person.");
      }
    } catch (err) {
      console.error("Error updating person:", err);
      alert("Update failed.");
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="form-container">
        <div className="text-center text-red">Person not found!</div>
        <div className="mt-4 text-center">
          <button onClick={onCancel} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <PersonForm
      editData={person}
      onSuccess={onSuccess}
      onSubmit={handleUpdate}
    />
  );
};

export default PersonEdit;
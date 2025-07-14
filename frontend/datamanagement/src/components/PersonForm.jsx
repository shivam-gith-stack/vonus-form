import React, { useState } from 'react';

const PersonForm = ({ onSuccess, editData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    gender: editData?.gender || '',
    dob: editData?.dob || '',
    address: editData?.address || '',
    hobbies: editData?.hobbies || [],
  });

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    editData?.display_picture
      ? `https://vonus-form-1.onrender.com/${editData.display_picture.replace('uploads/', '')}`
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hobbiesOptions = [
    'Reading', 'Writing', 'Gaming', 'Sports', 'Music',
    'Dancing', 'Cooking', 'Traveling', 'Photography', 'Art'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHobbyChange = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('hobbies', JSON.stringify(formData.hobbies));

    if (file) {
      formDataToSend.append('displayPic', file);
    }

    try {
      if (onSubmit) {
        await onSubmit(formDataToSend);
      } else {
        const response = await fetch('https://vonus-form-1.onrender.com/create.php', {
          method: 'POST',
          body: formDataToSend,
        });
        const result = await response.json();
        if (result?.error) throw new Error(result.error);
        alert('Person added successfully');
        onSuccess();
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {editData ? 'Edit Person' : 'Add New Person'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender *</label>
          <div className="radio-group">
            {['male', 'female', 'other'].map(g => (
              <div key={g} className="radio-item">
                <input
                  type="radio"
                  id={g}
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
                <label htmlFor={g} className="radio-label">
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date of Birth *</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Enter your address..."
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hobbies</label>
          <div className="checkbox-group">
            {hobbiesOptions.map(hobby => (
              <div key={hobby} className="checkbox-item">
                <input
                  type="checkbox"
                  id={hobby}
                  checked={formData.hobbies.includes(hobby)}
                  onChange={() => handleHobbyChange(hobby)}
                  disabled={isSubmitting}
                />
                <label htmlFor={hobby} className="checkbox-label">{hobby}</label>
              </div>
            ))}
          </div>
        </div>

<div className="form-group">
  <label className="form-label font-semibold text-gray-700">Profile Picture</label>

  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
    <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer shadow">
      Choose Image
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isSubmitting}
      />
    </label>

    {file && (
      <span className="text-sm text-gray-600 mt-1 sm:mt-0">
        Selected: {file.name}
      </span>
    )}
  </div>

  {imagePreview && (
    <div className="mt-4 border border-gray-200 p-2 rounded-md shadow-sm bg-white w-fit">
      <img
        src={imagePreview}
        alt="Profile Preview"
        className="rounded-md max-w-[200px] max-h-[200px] object-cover"
        onError={(e) => {
          e.target.src = '/default-profile.png';
        }}
      />
    </div>
  )}
</div>


        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (editData ? 'Update' : 'Add')} Person
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;

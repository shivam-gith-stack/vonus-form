import React, { useState, useEffect } from 'react';

const PersonView = ({ personId, onBack }) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPerson = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://vonus-form-1.onrender.com/get-person.php?id=${personId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.person) {
          throw new Error('Person data not found');
        }
        
        setPerson({
          ...result.person,
          display_picture: result.person.display_picture 
            ? `https://vonus-form-1.onrender.com/${result.person.display_picture}`
            : null
        });
      } catch (err) {
        console.error("Error fetching person:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (personId) loadPerson();
  }, [personId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid date" : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date format";
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading person details...</p>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="form-container">
        <div className="text-center py-8">
          <div className="text-red-500 text-xl mb-4">
            {error || 'Person not found!'}
          </div>
          <button 
            onClick={onBack} 
            className="btn btn-secondary px-6 py-2"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Person Details</h2>
        <button 
          onClick={onBack} 
          className="btn btn-secondary"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {person.display_picture ? (
              <img
                src={person.display_picture}
                alt={person.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
                onError={(e) => {
                  e.target.src = '/default-profile.png';
                  e.target.className = 'w-40 h-40 rounded-full object-contain border-4 border-gray-200 bg-gray-100 p-2';
                }}
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-300">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold">{person.name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Gender" value={person.gender} capitalize />
          <DetailItem label="Date of Birth" value={formatDate(person.dob)} />
          <DetailItem label="Address" value={person.address || 'Not provided'} />
          
          <div className="detail-item">
            <span className="detail-label">Hobbies:</span>
            <div className="detail-value">
              {person.hobbies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {person.hobbies.map((hobby, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">No hobbies selected</span>
              )}
            </div>
          </div>

          <DetailItem label="Created" value={formatDate(person.created_at)} />
          {person.updated_at && (
            <DetailItem label="Last Updated" value={formatDate(person.updated_at)} />
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, capitalize = false }) => (
  <div className="detail-item mb-4">
    <span className="detail-label block text-sm font-medium text-gray-500 mb-1">
      {label}:
    </span>
    <span className={`detail-value block ${capitalize ? 'capitalize' : ''}`}>
      {value}
    </span>
  </div>
);

export default PersonView;
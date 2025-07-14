import React, { useState } from 'react';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import PersonEdit from './components/PersonEdit';
import PersonView from './components/PersonView';
import './styles/main.css';

const App = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const renderView = () => {
    switch (currentView) {
      case 'add':
        return <PersonForm onSuccess={() => setCurrentView('list')} />;
      case 'edit':
        return (
          <PersonEdit
            personId={selectedPersonId}
            onSuccess={() => setCurrentView('list')}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'view':
        return (
          <PersonView
            personId={selectedPersonId}
            onBack={() => setCurrentView('list')}
          />
        );
      default:
        return (
          <PersonList
            onAdd={() => setCurrentView('add')}
            onEdit={(id) => {
              setSelectedPersonId(id);
              setCurrentView('edit');
            }}
            onView={(id) => {
              setSelectedPersonId(id);
              setCurrentView('view');
            }}
          />
        );
    }
  };

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">CRUD Application</div>
          <ul className="nav-links">
            <li>
              <a
                href="#"
                className={`nav-link ${currentView === 'list' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView('list');
                }}
              >
                List
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${currentView === 'add' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView('add');
                }}
              >
                Add Person
              </a>
            </li>
          </ul>
        </nav>
      </header>
      
      <div className="container">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
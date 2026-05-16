import React, { useEffect, useState } from 'react';
import { X, Clock, User as UserIcon, AlertCircle, PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import type { TestCase, Status } from '../types';
import { useAppContext } from '../context/AppContext';

interface Props {
  testCase: TestCase;
  onClose: () => void;
}

const TestCaseModal: React.FC<Props> = ({ testCase, onClose }) => {
  const { user, updateTestCase } = useAppContext();
  const [note, setNote] = useState(testCase.developerNote || '');
  const [localStatus, setLocalStatus] = useState<Status>(testCase.status);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'severity-critical';
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      case 'Low': return 'severity-low';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle size={16} className="text-warning" />;
      case 'In Progress': return <PlayCircle size={16} className="text-info" />;
      case 'Fixed': return <CheckCircle size={16} className="text-success" />;
      case 'Closed': return <XCircle size={16} className="text-muted" />;
      default: return null;
    }
  };

  const handleSaveUpdate = () => {
    // Only update if something actually changed
    if (localStatus !== testCase.status || note !== testCase.developerNote) {
      updateTestCase(testCase.id, { 
        status: localStatus,
        developerNote: note,
        ...(user?.role === 'Developer' ? { hasUnreadUpdate: true } : {})
      });
    }
    // Optionally close after saving, or just let them stay
    onClose();
  };

  const formattedDate = new Date(testCase.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="case-id">{testCase.id}</span>
            <div className="badges">
              <span className={`badge ${getSeverityClass(testCase.severity)}`}>
                {testCase.severity}
              </span>
              <span className={`badge status-badge ${testCase.status.toLowerCase().replace(' ', '-')}`}>
                {getStatusIcon(testCase.status)}
                {testCase.status}
              </span>
            </div>
          </div>
          <h2 className="modal-title">{testCase.title}</h2>
          
          <div className="meta-info mt-2">
            <div className="meta-item">
              <UserIcon size={14} />
              <span>{testCase.createdBy}</span>
            </div>
            <div className="meta-item">
              <Clock size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <div className="detail-section flex-1">
              <h3>Feature</h3>
              <p>{testCase.feature}</p>
            </div>
            <div className="detail-section flex-1">
              <h3>Test Date</h3>
              <p>{testCase.testDate}</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Test Case Scenario</h3>
            <p className="highlight-text">{testCase.scenario}</p>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{testCase.description}</p>
          </div>

          <div className="detail-section">
            <h3>Steps to Reproduce</h3>
            <pre className="detail-pre">{testCase.steps}</pre>
          </div>

          <div className="detail-row">
            <div className="detail-section flex-1">
              <h3>Expected Result</h3>
              <p>{testCase.expectedResult || 'Not specified'}</p>
            </div>
            <div className="detail-section flex-1">
              <h3>Actual Result</h3>
              <p>{testCase.actualResult || 'Not specified'}</p>
            </div>
          </div>

          {testCase.testerNote && (
            <div className="detail-section tester-note-section">
              <h3>Tester Note</h3>
              <p className="note-read-only">{testCase.testerNote}</p>
            </div>
          )}

          {testCase.screenshot && (
            <div className="detail-section">
              <h3>Screenshot</h3>
              <div className="screenshot-container">
                <img src={testCase.screenshot} alt="Test Case Screenshot" />
              </div>
            </div>
          )}

          {(user?.role === 'Developer' || testCase.developerNote) && (
            <div className="detail-section developer-note-section">
              <h3>Developer Note</h3>
              {user?.role === 'Developer' ? (
                <textarea
                  className="developer-note-input"
                  placeholder="Add a note or comment about the fix..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="detail-pre note-read-only">
                  {testCase.developerNote || 'No notes provided.'}
                </div>
              )}
            </div>
          )}
        </div>

        {user?.role === 'Developer' && (
          <div className="modal-footer">
            <div className="status-updater-large">
              <label>Update Status:</label>
              <select 
                value={localStatus} 
                onChange={(e) => setLocalStatus(e.target.value as Status)}
                className="status-select-large"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Fixed">Fixed</option>
              </select>
              <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={handleSaveUpdate}>
                Submit Update
              </button>
            </div>
          </div>
        )}

        {user?.role === 'Tester' && testCase.status === 'Fixed' && (
          <div className="modal-footer">
            <div className="status-updater-large" style={{ justifyContent: 'space-between', width: '100%' }}>
              <span className="text-muted">Please verify the developer's fix before closing.</span>
              <button 
                className="btn btn-success" 
                onClick={() => {
                  updateTestCase(testCase.id, { status: 'Closed', hasUnreadUpdate: false });
                  onClose();
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <CheckCircle size={18} />
                Verify & Close Test Case
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseModal;

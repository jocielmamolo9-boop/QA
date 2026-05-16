import React from 'react';
import { Clock, User as UserIcon, AlertCircle, PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import type { TestCase, Status } from '../types';
import { useAppContext } from '../context/AppContext';

interface Props {
  testCase: TestCase;
  onClick?: () => void;
}

const TestCaseCard: React.FC<Props> = ({ testCase, onClick }) => {
  const { user, updateTestCase } = useAppContext();

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

  const formattedDate = new Date(testCase.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="test-case-card fade-in" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="card-header">
        <div className="title-row-with-indicator">
          <span className="case-id">{testCase.id}</span>
          {user?.role === 'Tester' && testCase.hasUnreadUpdate && (
            <span className="update-indicator" title="Updated by Developer"></span>
          )}
        </div>
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
      
      <h3 className="card-title">{testCase.title}</h3>
      <p className="card-description">{testCase.description}</p>
      
      <div className="card-footer">
        <div className="meta-info">
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
    </div>
  );
};

export default TestCaseCard;

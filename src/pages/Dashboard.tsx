import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TestCaseCard from '../components/TestCaseCard';
import TestCaseModal from '../components/TestCaseModal';
import type { Status, Severity, TestCase } from '../types';

const Dashboard: React.FC = () => {
  const { testCases, user, updateTestCase } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);

  const selectedTestCase = selectedTestCaseId 
    ? testCases.find(tc => tc.id === selectedTestCaseId) || null 
    : null;

  const filteredCases = testCases.filter((tc) => {
    const matchesSearch = tc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tc.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || tc.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Test Cases Dashboard</h2>
          <p>Welcome back, {user?.username}. Here's the current state of QA.</p>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-value">{testCases.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-value text-warning">
              {testCases.filter(tc => tc.status === 'Open').length}
            </span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-card">
            <span className="stat-value text-success">
              {testCases.filter(tc => tc.status === 'Fixed').length}
            </span>
            <span className="stat-label">Fixed</span>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by ID or Title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-selects">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value as Severity | 'All')}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Test Cases Found</h3>
          <p>We couldn't find any test cases matching your current filters.</p>
        </div>
      ) : (
        <div className="test-cases-grid">
          {filteredCases.map((tc) => (
            <TestCaseCard 
              key={tc.id} 
              testCase={tc} 
              onClick={() => {
                if (user?.role === 'Tester' && tc.hasUnreadUpdate) {
                  updateTestCase(tc.id, { hasUnreadUpdate: false });
                }
                setSelectedTestCaseId(tc.id);
              }} 
            />
          ))}
        </div>
      )}

      {selectedTestCase && (
        <TestCaseModal 
          testCase={selectedTestCase} 
          onClose={() => setSelectedTestCaseId(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;

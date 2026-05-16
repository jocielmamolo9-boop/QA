import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Severity, TestCase } from '../types';

const CreateTestCase: React.FC = () => {
  const { user, addTestCase, testCases } = useAppContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [severity, setSeverity] = useState<Severity>('Medium');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [feature, setFeature] = useState('');
  const [scenario, setScenario] = useState('');
  const [testerNote, setTesterNote] = useState('');
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 500KB limit
    if (file.size > 500 * 1024) {
      alert('Image size exceeds 500KB limit. Please choose a smaller image.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Auto ID Generation: TC_MMDD###
  const generateId = () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const prefix = `TC_${mm}${dd}`;
    
    // Find highest sequence number for today
    const todaysCases = testCases.filter(tc => tc.id.startsWith(prefix));
    const sequence = String(todaysCases.length + 1).padStart(3, '0');
    
    return `${prefix}${sequence}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !steps.trim() || !feature.trim() || !scenario.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const newCase: TestCase = {
      id: generateId(),
      title,
      description,
      steps,
      expectedResult,
      actualResult,
      severity,
      status: 'Open',
      createdBy: user?.username || 'Unknown',
      createdAt: Date.now(),
      testDate,
      feature,
      scenario,
      testerNote,
      screenshot,
    };

    addTestCase(newCase);
    navigate('/dashboard');
  };

  return (
    <div className="create-container fade-in">
      <div className="create-header">
        <button className="btn-icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h2><FileText size={28} className="text-primary" /> Create New Test Case</h2>
      </div>

      <div className="create-card">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="title">Test Case Title *</label>
              <input
                id="title"
                type="text"
                placeholder="E.g. Login fails with invalid credentials"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group flex-1">
              <label htmlFor="severity">Severity</label>
              <select 
                id="severity"
                value={severity} 
                onChange={(e) => setSeverity(e.target.value as Severity)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="testDate">Test Date *</label>
              <input
                id="testDate"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="feature">Feature *</label>
              <input
                id="feature"
                type="text"
                placeholder="E.g. Login Module"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="scenario">Test Case Scenario *</label>
            <input
              id="scenario"
              type="text"
              placeholder="E.g. Validating password strength requirements"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Brief overview of what is being tested"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="steps">Steps to Reproduce *</label>
            <textarea
              id="steps"
              placeholder="1. Navigate to...\n2. Click on...\n3. Enter..."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="expectedResult">Expected Result</label>
              <textarea
                id="expectedResult"
                placeholder="What should happen?"
                value={expectedResult}
                onChange={(e) => setExpectedResult(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="form-group flex-1">
              <label htmlFor="actualResult">Actual Result (if applicable)</label>
              <textarea
                id="actualResult"
                placeholder="What actually happened?"
                value={actualResult}
                onChange={(e) => setActualResult(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="testerNote">Tester Note (Optional)</label>
            <textarea
              id="testerNote"
              placeholder="Any additional context or comments?"
              value={testerNote}
              onChange={(e) => setTesterNote(e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="screenshot">Screenshot (Optional, max 500KB)</label>
            <input
              id="screenshot"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageUpload}
              className="file-input"
            />
            {screenshot && (
              <div className="image-preview">
                <img src={screenshot} alt="Screenshot Preview" />
                <button type="button" onClick={() => setScreenshot(undefined)} className="btn-remove-image">Remove Image</button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Test Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestCase;

import { AuthData } from "../../auth/AuthWrapper";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Account = () => {
  const { user } = AuthData();
  const [netWorth, setNetWorth] = useState({
    assets: 0,
    liabilities: 0,
    total: 0
  });
  const [incomeStreams, setIncomeStreams] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  });
  const [newAsset, setNewAsset] = useState({ name: '', amount: '', type: 'cash' });
  const [newLiability, setNewLiability] = useState({ name: '', amount: '', type: 'loan' });
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', frequency: 'monthly' });

  // Calculate net worth whenever assets or liabilities change
  useEffect(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.amount), 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + Number(liability.amount), 0);
    setNetWorth({
      assets: totalAssets,
      liabilities: totalLiabilities,
      total: totalAssets - totalLiabilities
    });
  }, [assets, liabilities]);

  // Investment projection calculator
  const calculateProjection = (principal, monthlyContribution, years, rate) => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let projection = [];
    let current = principal;

    for(let i = 0; i <= months; i++) {
      if(i % 12 === 0) projection.push(current);
      current = (current + monthlyContribution) * (1 + monthlyRate);
    }

    return projection;
  };

  // Sample investment projection data
  const investmentData = {
    labels: Array.from({length: 30}, (_, i) => i + 1),
    datasets: [{
      label: 'Projected Growth',
      data: calculateProjection(10000, 500, 30, 7),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Handlers for adding financial items
  const addAsset = (e) => {
    e.preventDefault();
    setAssets([...assets, newAsset]);
    setNewAsset({ name: '', amount: '', type: 'cash' });
  };

  const addLiability = (e) => {
    e.preventDefault();
    setLiabilities([...liabilities, newLiability]);
    setNewLiability({ name: '', amount: '', type: 'loan' });
  };

  const addIncome = (e) => {
    e.preventDefault();
    setIncomeStreams([...incomeStreams, newIncome]);
    setNewIncome({ source: '', amount: '', frequency: 'monthly' });
  };

  const addGoal = (e) => {
    e.preventDefault();
    setGoals([...goals, {
      ...newGoal,
      progress: (newGoal.currentAmount / newGoal.targetAmount * 100).toFixed(1)
    }]);
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
  };

  return (
    <div className="page">
      <div className="header">
        <h2>Welcome Back, {user.firstname}!</h2>
        <div className="net-worth-summary">
          <h3>Net Worth Overview</h3>
          <div className="net-worth-cards">
            <div className="summary-card">
              <h4>Total Assets</h4>
              <p>${netWorth.assets.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h4>Total Liabilities</h4>
              <p>${netWorth.liabilities.toLocaleString()}</p>
            </div>
            <div className="summary-card highlight">
              <h4>Net Worth</h4>
              <p>${netWorth.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="financial-sections">
        {/* Income and Assets Section */}
        <div className="section">
          <h3>Income & Assets</h3>
          <div className="input-group">
            <h4>Add Income Stream</h4>
            <form onSubmit={addIncome}>
              <input type="text" placeholder="Income source"
                value={newIncome.source}
                onChange={e => setNewIncome({...newIncome, source: e.target.value})} />
              <input type="number" placeholder="Amount"
                value={newIncome.amount}
                onChange={e => setNewIncome({...newIncome, amount: e.target.value})} />
              <select value={newIncome.frequency}
                onChange={e => setNewIncome({...newIncome, frequency: e.target.value})}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
              <button type="submit">Add Income</button>
            </form>
          </div>

          <div className="input-group">
            <h4>Add Asset</h4>
            <form onSubmit={addAsset}>
              <input type="text" placeholder="Asset name"
                value={newAsset.name}
                onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
              <input type="number" placeholder="Value"
                value={newAsset.amount}
                onChange={e => setNewAsset({...newAsset, amount: e.target.value})} />
              <select value={newAsset.type}
                onChange={e => setNewAsset({...newAsset, type: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="property">Property</option>
                <option value="investments">Investments</option>
              </select>
              <button type="submit">Add Asset</button>
            </form>
          </div>
        </div>

        {/* Liabilities and Goals Section */}
        <div className="section">
          <h3>Liabilities & Goals</h3>
          <div className="input-group">
            <h4>Add Liability</h4>
            <form onSubmit={addLiability}>
              <input type="text" placeholder="Liability name"
                value={newLiability.name}
                onChange={e => setNewLiability({...newLiability, name: e.target.value})} />
              <input type="number" placeholder="Amount owed"
                value={newLiability.amount}
                onChange={e => setNewLiability({...newLiability, amount: e.target.value})} />
              <select value={newLiability.type}
                onChange={e => setNewLiability({...newLiability, type: e.target.value})}>
                <option value="loan">Loan</option>
                <option value="mortgage">Mortgage</option>
                <option value="credit">Credit Card</option>
              </select>
              <button type="submit">Add Liability</button>
            </form>
          </div>

          <div className="input-group">
            <h4>Set Financial Goal</h4>
            <form onSubmit={addGoal}>
              <input type="text" placeholder="Goal name"
                value={newGoal.name}
                onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
              <input type="number" placeholder="Target amount"
                value={newGoal.targetAmount}
                onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})} />
              <input type="number" placeholder="Current amount"
                value={newGoal.currentAmount}
                onChange={e => setNewGoal({...newGoal, currentAmount: e.target.value})} />
              <input type="date"
                value={newGoal.targetDate}
                onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})} />
              <button type="submit">Set Goal</button>
            </form>
          </div>
        </div>

        {/* Investment Projection Section */}
        <div className="section">
          <h3>Investment Future Projection</h3>
          <div className="chart-wrapper">
            <Line data={investmentData} options={{
              responsive: true,
              plugins: {
                title: { display: true, text: '10-Year Projection' }
              }
            }} />
          </div>
          <div className="projection-controls">
            <button onClick={() => {/* Add interactive controls */}}>
              Adjust Projection Parameters
            </button>
          </div>
        </div>

        {/* Goals Progress Section */}
        <div className="section">
          <h3>Goals Progress</h3>
          {goals.map((goal, index) => (
            <div key={index} className="goal-item">
              <h4>{goal.name}</h4>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${goal.progress}%` }}></div>
                <span>{goal.progress}%</span>
              </div>
              <p>Target: ${goal.targetAmount} by {goal.targetDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
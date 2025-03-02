import { AuthData } from "../../auth/AuthWrapper";
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Private = () => {
  const { user } = AuthData();
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [newExpense, setNewExpense] = useState({
    expensename: '',
    expensecost: '',
    recurring: 'No',
    type: 'Food'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
         // Fix 1: Remove body from GET request and fix template literal
         const response = await fetch(`https://finance-tracker-api-dtfkggehg3ggc0au.canadacentral-01.azurewebsites.net/members/${user.memberid}/expenses`, {
           method: 'GET',
           headers: { 'Content-Type': 'application/json' }
           // Removed body property
         });
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const data = await response.json();
        setExpenses(data);
        setTotalExpenses(data.reduce((sum, expense) => sum + Number(expense.expensecost), 0));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [user.memberid]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!newExpense.expensename || !newExpense.expensecost) {
    setError('Please fill all required fields');
    return;
  }

  try {
    const response = await fetch(`https://finance-tracker-api-dtfkggehg3ggc0au.canadacentral-01.azurewebsites.net/members/${user.memberid}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expensename: newExpense.expensename,
        expensecost: parseFloat(newExpense.expensecost).toFixed(2),
        recurring: newExpense.recurring,
        type: newExpense.type
      })
    });

    const textResponse = await response.text();

    // Handle successful response that's not JSON
    if (response.ok) {
      // Refresh expenses list from server
      const refreshResponse = await fetch(`https://finance-tracker-api-dtfkggehg3ggc0au.canadacentral-01.azurewebsites.net/members/${user.memberid}/expenses`);
      const refreshedData = await refreshResponse.json();

      setExpenses(refreshedData);
      setTotalExpenses(refreshedData.reduce((sum, expense) => sum + Number(expense.expensecost), 0));
      setNewExpense({ expensename: '', expensecost: '', recurring: 'No', type: 'Food' });
      return;
    }

    // Handle errors
    try {
      const data = JSON.parse(textResponse);
      throw new Error(data.message || 'Failed to add expense');
    } catch {
      throw new Error(textResponse || 'Unknown error occurred');
    }

  } catch (err) {
    setError(err.message);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: name === 'expensecost' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  // Chart data
  const barChartData = {
    labels: expenses.map((expense) => expense.expensename),
    datasets: [{
      label: 'Expense Cost',
      data: expenses.map((expense) => expense.expensecost),
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
    }],
  };

  const pieChartData = {
    labels: [...new Set(expenses.map(expense => expense.type))],
    datasets: [{
      label: 'Expenses by Type',
      data: [...new Set(expenses.map(expense => expense.type))].map(type =>
        expenses.filter(exp => exp.type === type).reduce((sum, exp) => sum + Number(exp.expensecost), 0)
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Expense Breakdown' }
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error: {error}</div>;

  return (
    <div className="page">
      <div className="header">
        <h2>Welcome Back, {user.firstname}!</h2>
        <div className="summary-card">
          <h3>Total Monthly Expenses</h3>
          <p className="total-amount">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <Bar options={chartOptions} data={barChartData} />
        </div>
        <div className="chart-wrapper">
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      <div className="expense-section">
        <form onSubmit={handleSubmit} className="expense-form">
          <h3>Add New Expense</h3>
          {error && <p className="error-message">{error}</p>}

          <div className="form-row">
            <div className="input-group">
              <label>Expense Name</label>
              <input
                type="text"
                name="expensename"
                value={newExpense.expensename}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Amount ($)</label>
              <input
                type="number"
                name="expensecost"
                value={newExpense.expensecost}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="input-group">
              <label>Recurring</label>
              <select
                name="recurring"
                value={newExpense.recurring}
                onChange={handleInputChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                name="type"
                value={newExpense.type}
                onChange={handleInputChange}
              >
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="add-button">
              Add Expense
            </button>
          </div>
        </form>

        <div className="expense-table">
          <h3>Recent Expenses</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Recurring</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.expensename}</td>
                  <td>${Number(expense.expensecost).toFixed(2)}</td>
                  <td>{expense.type}</td>
                  <td>{expense.recurring}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
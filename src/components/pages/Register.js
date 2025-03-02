import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    occupation: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    zipcode: "",
    phoneNumber: "",
    email: "",
    userName: "",
    profileStatus: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) { // Use response.ok to check for 2xx status codes
        alert("User successfully registered!");
        navigate("/login");;
      } else {
        const errorData = await response.json(); // Try to get error message from server
        alert(`Registration failed: ${errorData?.message || response.statusText}`);
        console.error("Registration failed:", response.status, response.statusText, errorData);
      }
    } catch (error) {
      alert("An error occurred during registration.");
      console.error("Error:", error);
    }
  };

  const populateForm = () => {
    setFormData({
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      occupation: "Engineer",
      address1: "123 Main St",
      address2: "Apt 101",
      city: "New York",
      country: "USA",
      zipcode: "12345",
      phoneNumber: "555-123-4567",
      email: "john.doe@example.com",
      userName: "",
      profileStatus: "active",
      password: "",
    });
  };

  return (
    <div className="page">
        <h2>Welcome to our Finance Management App</h2>
        <p>
          To sign up now please enter your details and get ready to reach your
          financial goals!
        </p>
      <form id="registrationForm" className="form" onSubmit={handleRegister}>
          <div className="inputs">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required /><br /><br />

            <label htmlFor="middleName">Middle Name:</label>
            <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} /><br /><br />

            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required /><br /><br />

            <label htmlFor="occupation">Occupation:</label>
            <input type="text" id="occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} /><br /><br />

            <label htmlFor="address1">Address 1:</label>
            <input type="text" id="address1" name="address1" value={formData.address1} onChange={handleInputChange} /><br /><br />

            <label htmlFor="address2">Address 2:</label>
            <input type="text" id="address2" name="address2" value={formData.address2} onChange={handleInputChange} /><br /><br />

            <label htmlFor="city">City:</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} /><br /><br />

            <label htmlFor="country">Country:</label>
            <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} /><br /><br />

            <label htmlFor="zipcode">Zipcode:</label>
            <input type="number" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleInputChange} /><br /><br />

            <label htmlFor="phoneNumber">Phone Number:</label>
            <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} /><br /><br />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} /><br /><br />

            <label htmlFor="userName">Username:</label>
            <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleInputChange} required /><br /><br />

            <label htmlFor="profileStatus">Profile Status:</label>
            <input type="text" id="profileStatus" name="profileStatus" value={formData.profileStatus} onChange={handleInputChange} required /><br /><br />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required /><br /><br />
            <button type="button" id="populateBtn" onClick={populateForm}>Populate Form</button>
              <div className="button">
                <button type="submit" id="registerBtn">Register</button>
               </div>

          </div>
      </form>
    </div>
  );
};


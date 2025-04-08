import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; 

const Account = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);  
      console.log("User logged out successfully");
      alert("You have been logged out.");
    } catch (error) {
      console.error("Logout failed: ", error.message);
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <div className="Account">
      <h2>Your Account</h2>
      <p>Welcome, you are logged in!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;

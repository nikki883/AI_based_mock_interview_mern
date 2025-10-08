// import { useState, useEffect } from "react"
// import { useNavigate, Link } from "react-router-dom"
// import axios from "axios"
// // import "./Register.css"

// const Register = () => {
//   // Email verification states
//   const [email, setEmail] = useState("")
//   const [otp, setOtp] = useState("")
//   const [isOtpSent, setIsOtpSent] = useState(false)
//   const [resendCooldown, setResendCooldown] = useState(false)
//   const [timer, setTimer] = useState(30)
//   const [success, setSuccess] = useState("")

//   // Registration states
//   const [name, setName] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
// //   const [location, setLocation] = useState("")
//   const [isEmailVerified, setIsEmailVerified] = useState(false)
//   const [error, setError] = useState("")
//   const navigate = useNavigate()

//   // Timer for OTP resend cooldown
//   useEffect(() => {
//     let interval
//     if (resendCooldown) {
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             setResendCooldown(false)
//             clearInterval(interval)
//             return 30 // Reset timer
//           }
//           return prev - 1
//         })
//       }, 1000) // 1 second interval
//     }
//     return () => clearInterval(interval) // Cleanup interval
//   }, [resendCooldown])

//   const handleSendOtp = async () => {
//     setError("")
//     setSuccess("")
//     if (!email) return setError("Please enter your email")

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { email })
//       if (response.data.message === "OTP sent to your email") {
//         setIsOtpSent(true)
//         setSuccess("OTP sent to your email. Please check your inbox.")
//         setResendCooldown(true)
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Error sending OTP")
//     }
//   }

//   const handleResendOtp = async () => {
//     if (resendCooldown) {
//       setError(`Please wait ${timer} seconds before resending OTP.`)
//       return
//     }
//     setError("")
//     setSuccess("")
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, { email })
//       setIsOtpSent(true)
//       setResendCooldown(true) // Start the cooldown
//       setTimer(30) // Reset timer for cooldown
//       setSuccess(response.data.message || "OTP resent successfully!") // Show success message
//     } catch (err) {
//       setError(err.response?.data?.message || "Error resending OTP")
//     }
//   }

//   const handleVerifyOtp = async () => {
//     setError("")
//     setSuccess("")
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
//         email,
//         otp,
//       })
//       console.log("Verifying OTP with:", { email, otp })

//       if (response.data.message === "Email verified successfully") {
//         setIsEmailVerified(true)
//         setSuccess("Email verified successfully!")
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Error verifying OTP")
//     }
//   }

//   const handleRegister = async (e) => {
//     e.preventDefault()
//     setError("")
//     setSuccess("")

//     if (!isEmailVerified) return setError("Please verify your email before registering")
//     if (password !== confirmPassword) return setError("Passwords do not match")

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
//         email,
//         name,
//         password,
//         confirmPassword,
//         // location,
//       })

//       setSuccess(response.data.message || "Registration successful!")
//       setTimeout(() => {
//         navigate("/login")
//       }, 2000)
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed")
//     }
//   }

//   return (
//     <div className="auth-container">
//       <div className="auth-card register-card">
//         <div className="auth-header">
//           <h2>Create Account</h2>
//           <p>Join the sustainable fashion movement</p>
//         </div>

//         {error && <div className="auth-error">{error}</div>}
//         {success && <div className="auth-success">{success}</div>}

//         <form onSubmit={handleRegister} className="auth-form">
//           {/* Step 1: Email Verification */}
//           <div className="form-step">
//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 disabled={isOtpSent && isEmailVerified}
//               />
//             </div>

//             {!isOtpSent ? (
//               <div className="form-action">
//                 <button type="button" className="btn-primary" onClick={handleSendOtp}>
//                   Send OTP
//                 </button>
//               </div>
//             ) : !isEmailVerified ? (
//               <>
//                 <div className="form-group">
//                   <label htmlFor="otp">Verification Code</label>
//                   <input
//                     id="otp"
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     placeholder="Enter OTP sent to your email"
//                     required
//                   />
//                 </div>
//                 <div className="form-action-row">
//                   <button type="button" className="btn-primary" onClick={handleVerifyOtp}>
//                     Verify OTP
//                   </button>
//                   <button
//                     type="button"
//                     className={`btn-outline ${resendCooldown ? "disabled" : ""}`}
//                     onClick={handleResendOtp}
//                     disabled={resendCooldown}
//                   >
//                     {resendCooldown ? `Resend in ${timer}s` : "Resend OTP"}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="verified-badge">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//                   <polyline points="22 4 12 14.01 9 11.01"></polyline>
//                 </svg>
//                 <span>Email Verified</span>
//               </div>
//             )}
//           </div>

//           {/* Step 2: Account Details (Only shown after email verification) */}
//           {isEmailVerified && (
//             <div className="form-step">
//               <div className="step-divider">
//                 <span>Account Details</span>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="name">Full Name</label>
//                 <input
//                   id="name"
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter your full name"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Create a password"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="confirmPassword">Confirm Password</label>
//                 <input
//                   id="confirmPassword"
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm your password"
//                   required
//                 />
//               </div>

//               <div className="form-action">
//                 <button type="submit" className="btn-primary">
//                   Create Account
//                 </button>
//               </div>
//             </div>
//           )}
//         </form>

//         <div className="auth-footer">
//           <p>
//             Already have an account? <Link to="/login">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register



import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [timer, setTimer] = useState(30);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  // Cooldown timer for resend
  useEffect(() => {
    let interval;
    if (resendCooldown) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setResendCooldown(false);
            clearInterval(interval);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    setError(""); setSuccess("");
    if (!email) return setError("Please enter your email");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { email });
      if (res.data.message) {
        setIsOtpSent(true);
        setSuccess("OTP sent to your email. Please check your inbox.");
        setResendCooldown(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setError(""); setSuccess("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp });
      if (res.data.message === "Email verified successfully") {
        setIsEmailVerified(true);
        setSuccess("Email verified successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying OTP");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!isEmailVerified) return setError("Please verify your email before registering");
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email, name, password, confirmPassword
      });
      setSuccess(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Create Account</h2>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isEmailVerified}
              required
            />
          </div>

          {!isOtpSent ? (
            <button type="button" onClick={handleSendOtp}>Send OTP</button>
          ) : !isEmailVerified ? (
            <>
              <div className="form-group">
                <label>OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <div>
                <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={resendCooldown}
                >
                  {resendCooldown ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
              </div>
            </>
          ) : null}

          {isEmailVerified && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit">Register</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;


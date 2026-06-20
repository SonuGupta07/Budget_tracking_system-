import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import AuthLayout from "../../layouts/AuthLayout";
import { sendOtp, verifyOtp } from "../../api/authApi";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId] = useState(location.state?.user_id || "");
  const [email] = useState(location.state?.email || "");
  const [otpCode, setOtpCode] = useState("");

  const [success, setSuccess] = useState(
    "OTP has been sent to your registered email.",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("User ID missing. Please register again.");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({
        user_id: Number(userId),
        otp_code: otpCode,
      });

      setSuccess("OTP verified successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "OTP verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email missing. Please register again.");
      return;
    }

    setResendLoading(true);

    try {
      await sendOtp({ email });
      setSuccess("OTP resent successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to resend OTP",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify OTP" subtitle="Enter the OTP sent to your email">
      {email && (
        <Typography textAlign="center" color="text.secondary" mb={2}>
          Email: {email}
        </Typography>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleVerifyOtp}>
        <TextField
          label="OTP Code"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 3, py: 1.4, borderRadius: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Verify OTP"
          )}
        </Button>
      </Box>

      <Button
        variant="text"
        fullWidth
        disabled={resendLoading}
        onClick={handleResendOtp}
        sx={{ mt: 2 }}
      >
        {resendLoading ? "Sending OTP..." : "Resend OTP"}
      </Button>

      <Typography textAlign="center" mt={2}>
        Wrong email? <Link to="/register">Register again</Link>
      </Typography>
    </AuthLayout>
  );
};

export default VerifyOtp;

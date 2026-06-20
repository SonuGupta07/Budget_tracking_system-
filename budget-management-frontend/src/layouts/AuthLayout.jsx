import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  useTheme,
} from "@mui/material";

const AuthLayout = ({ title, subtitle, children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #111827 100%)"
            : "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 450px" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Box sx={{ color: "white", display: { xs: "none", md: "block" } }}>
            <Typography variant="h3" fontWeight={800} mb={2}>
              Budget Management System
            </Typography>

            <Typography variant="h6" sx={{ maxWidth: 560, opacity: 0.9 }}>
              Manage income, expenses, savings, budgets, analytics and AI-based
              financial insights from one secure platform.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography>✓ Secure Authentication</Typography>
              <Typography>✓ OTP Verification</Typography>
              <Typography>✓ Finance Dashboard</Typography>
              <Typography>✓ AI Budget Advisor</Typography>
            </Box>
          </Box>

          <Card
            sx={{
              width: "100%",
              borderRadius: 5,
              boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" fontWeight={800} textAlign="center">
                {title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={1}
                mb={3}
              >
                {subtitle}
              </Typography>

              {children}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;

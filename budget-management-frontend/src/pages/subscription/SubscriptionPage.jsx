import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { QRCodeCanvas } from "qrcode.react";
import PageHeader from "../../components/common/PageHeader";
import usePayments from "../../hooks/usePayments";

const SubscriptionPage = () => {
  const { premiumStatus, isPremium, paying, error, success, startPayment } =
    usePayments();

  const subscriptionUrl = `${window.location.origin}/subscription`;

  return (
    <Box>
      <PageHeader
        title="Subscription"
        subtitle="Upgrade to Premium Member and show payment integration in your BudgetPro project."
        breadcrumbs={["Billing", "Subscription"]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: isPremium ? "success.main" : "divider",
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <WorkspacePremiumIcon color="primary" />
                <Typography variant="h5" fontWeight={900}>
                  Premium Membership
                </Typography>
              </Stack>

              <Typography color="text.secondary" mb={2}>
                Unlock premium badge and demonstrate secure Razorpay payment
                integration.
              </Typography>

              <Typography variant="h3" fontWeight={900}>
                ₹99
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Valid for 30 days
              </Typography>

              <Stack spacing={1.5} mb={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="success" />
                  <Typography>Premium Member badge on navbar</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="success" />
                  <Typography>Payment stored in backend database</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="success" />
                  <Typography>Razorpay Checkout integration</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="success" />
                  <Typography>QR code shown on frontend</Typography>
                </Stack>
              </Stack>

              {isPremium ? (
                <Chip
                  icon={<WorkspacePremiumIcon />}
                  label={`Premium Member ${
                    premiumStatus?.end_date
                      ? `valid till ${new Date(
                          premiumStatus.end_date,
                        ).toLocaleDateString("en-IN")}`
                      : ""
                  }`}
                  color="success"
                  sx={{ fontWeight: 900 }}
                />
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  disabled={paying}
                  onClick={startPayment}
                  startIcon={<WorkspacePremiumIcon />}
                >
                  {paying ? "Processing..." : "Subscribe Now"}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={900} mb={1}>
                Scan QR Code
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Scan this QR code to open the subscription page on another
                device.
              </Typography>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "white",
                  display: "inline-flex",
                }}
              >
                <QRCodeCanvas value={subscriptionUrl} size={220} />
              </Box>

              <Typography variant="body2" color="text.secondary" mt={2}>
                QR opens: {subscriptionUrl}
              </Typography>

              <Alert severity="info" sx={{ mt: 3 }}>
                Payment will still happen through Razorpay Checkout after
                clicking Subscribe.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionPage;

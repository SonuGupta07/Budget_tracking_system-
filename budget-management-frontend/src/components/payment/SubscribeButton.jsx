import { Button, Chip, Stack } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import usePayments from "../../hooks/usePayments";

const SubscribeButton = () => {
  const { isPremium, paying, startPayment } = usePayments();

  if (isPremium) {
    return (
      <Chip
        icon={<WorkspacePremiumIcon />}
        label="Premium Member"
        color="success"
        sx={{ fontWeight: 800 }}
      />
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      <Button
        variant="contained"
        size="small"
        disabled={paying}
        onClick={startPayment}
        startIcon={<WorkspacePremiumIcon />}
      >
        {paying ? "Processing..." : "Subscribe"}
      </Button>
    </Stack>
  );
};

export default SubscribeButton;

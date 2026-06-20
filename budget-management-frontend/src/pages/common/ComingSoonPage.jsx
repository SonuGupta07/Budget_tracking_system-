import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";

const ComingSoonPage = ({ title, subtitle }) => {
  return (
    <Box>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={["Budget Management", title]}
      />

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          minHeight: 300,
        }}
      >
        <CardContent>
          <Chip label="UI module ready for development" color="primary" />

          <Typography variant="h5" mt={3} fontWeight={900}>
            {title}
          </Typography>

          <Typography color="text.secondary" mt={1}>
            This module will be connected with backend APIs in the next steps.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComingSoonPage;

import { Box, Breadcrumbs, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const PageHeader = ({
  title,
  subtitle,
  actionText,
  onAction,
  breadcrumbs = [],
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
      }}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 1 }}
          >
            {breadcrumbs.map((item) => (
              <Typography key={item} variant="body2" color="text.secondary">
                {item}
              </Typography>
            ))}
          </Breadcrumbs>
        )}

        <Typography variant="h4" fontWeight={900}>
          {title}
        </Typography>

        {subtitle && (
          <Typography color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {actionText && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;

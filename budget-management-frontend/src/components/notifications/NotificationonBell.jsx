import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";

const NotificationBell = () => {
  const navigate = useNavigate();
  const {
    notifications,
    smartAlerts,
    totalAlertCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const latestNotifications = notifications.slice(0, 4);
  const latestSmartAlerts = smartAlerts.slice(0, 3);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={totalAlertCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: "95vw",
            borderRadius: 3,
          },
        }}
      >
        <Box px={2} py={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={900}>Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                {totalAlertCount} active alert(s)
              </Typography>
            </Box>

            <IconButton size="small" onClick={markAllAsRead}>
              <DoneAllIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        <Divider />

        {latestSmartAlerts.length > 0 && (
          <Box px={2} py={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={800}
            >
              SMART FINANCE ALERTS
            </Typography>

            {latestSmartAlerts.map((alert) => (
              <MenuItem
                key={`${alert.type}-${alert.message}`}
                sx={{ whiteSpace: "normal" }}
              >
                <Box>
                  <Typography fontWeight={800}>{alert.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alert.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        {latestNotifications.length > 0 && (
          <Box px={2} py={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={800}
            >
              SYSTEM NOTIFICATIONS
            </Typography>

            {latestNotifications.map((notification) => (
              <MenuItem
                key={notification.notification_id}
                sx={{ whiteSpace: "normal" }}
                onClick={() => {
                  if (notification.is_read !== "Y") {
                    markAsRead(notification.notification_id);
                  }
                }}
              >
                <Box>
                  <Typography fontWeight={800}>{notification.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        {latestNotifications.length === 0 && latestSmartAlerts.length === 0 && (
          <Box px={2} py={4} textAlign="center">
            <Typography color="text.secondary">
              No notifications found.
            </Typography>
          </Box>
        )}

        <Divider />

        <Box px={2} py={1.5}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleClose();
              navigate("/notifications");
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;

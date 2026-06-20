import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { navigationItems } from "../../app/navigation";

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, onClose, currentRole = "USER" }) => {
  const location = useLocation();
  const theme = useTheme();

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #0f172a 0%, #111827 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "white",
            }}
          >
            <AccountBalanceWalletIcon />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
              BudgetPro
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Finance Manager
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Box px={3} pb={2}>
        <Chip
          label={`${currentRole} Workspace`}
          color={currentRole === "ADMIN" ? "error" : "primary"}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </Box>

      <Divider />

      <Box sx={{ overflowY: "auto", height: "calc(100% - 140px)", px: 1.5 }}>
        {navigationItems.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(currentRole),
          );

          if (visibleItems.length === 0) return null;

          return (
            <Box key={section.section} mt={2}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={800}
                sx={{ px: 2, textTransform: "uppercase", letterSpacing: 0.8 }}
              >
                {section.section}
              </Typography>

              <List dense>
                {visibleItems.map((item) => {
                  const active =
                    location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`);

                  return (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={onClose}
                      sx={{
                        my: 0.5,
                        borderRadius: 3,
                        color: active ? "primary.main" : "text.primary",
                        backgroundColor: active
                          ? theme.palette.mode === "dark"
                            ? "rgba(59,130,246,0.16)"
                            : "rgba(37,99,235,0.10)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(15,23,42,0.06)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: active ? "primary.main" : "text.secondary",
                          minWidth: 42,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: active ? 800 : 600,
                          fontSize: 14,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme as useMuiTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../UI/ThemeToggle';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ 
        width: 250,
        bgcolor: '#121212',
        color: 'white',
        height: '100%'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {currentUser && (
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: '#00bcd4', width: 40, height: 40 }}>
            {currentUser.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6">{currentUser.username}</Typography>
        </Box>
      )}
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List>
        <ListItem button component={RouterLink} to="/" sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ color: '#00bcd4' }}>
            <HomeIcon fontSize="large" />
          </ListItemIcon>
          <ListItemText 
            primary="Home" 
            primaryTypographyProps={{ fontSize: '1.1rem' }} 
          />
        </ListItem>
        {currentUser && (
          <ListItem button component={RouterLink} to="/favorites" sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#00bcd4' }}>
              <FavoriteIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText 
              primary="Favorites" 
              primaryTypographyProps={{ fontSize: '1.1rem' }} 
            />
          </ListItem>
        )}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      {currentUser ? (
        <List>
          <ListItem button onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#00bcd4' }}>
              <ExitToAppIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontSize: '1.1rem' }} 
            />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={RouterLink} to="/login" sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#00bcd4' }}>
              <AccountCircleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText 
              primary="Login" 
              primaryTypographyProps={{ fontSize: '1.1rem' }} 
            />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'rgba(6, 6, 6, 0.85)', boxShadow: '0 4px 20px rgba(194, 68, 68, 0.5)' }}>
      <Toolbar sx={{ py: 1 }}>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, color: '#00bcd4' }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        )}
        
        <Box 
          component={RouterLink} 
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexGrow: 1,
          }}
        >
          <LocalMoviesIcon 
            sx={{ 
              color: '#00bcd4', 
              fontSize: { xs: '2.2rem', md: '2.8rem' },
              mr: 1,
              transform: 'rotate(-10deg)'
            }} 
          />
          <Typography
            variant="h4"
            sx={{
              color: '#00bcd4',
              textDecoration: 'none',
              fontSize: { xs: '1.6rem', sm: '2rem' },
              fontWeight: 900,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '1px'
            }}
          >
            Movie Explorer
          </Typography>
        </Box>

        <ThemeToggle />

        {!isMobile && (
          <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{ 
                color: '#00bcd4', 
                fontSize: '1.3rem', 
                fontWeight: 'bold',
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 188, 212, 0.1)',
                }
              }}
            >
              Home
            </Button>
            
            {currentUser && (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/favorites"
                sx={{ 
                  color: '#00bcd4', 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold',
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 188, 212, 0.1)',
                  } 
                }}
              >
                Favourites
              </Button>
            )}
          </Box>
        )}

        {!isMobile && (
          <>
            {currentUser ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  color="inherit"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  sx={{ ml: 2 }}
                >
                  <Avatar sx={{ width: 40, height: 40, bgcolor: '#00bcd4', border: '2px solid #00bcd4' }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: '#121212',
                      color: 'white',
                      border: '1px solid #333'
                    }
                  }}
                >
                  <MenuItem disabled sx={{ color: '#999' }}>{currentUser.username}</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#00bcd4' }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                variant="outlined"
                sx={{ 
                  ml: 2, 
                  color: '#00bcd4', 
                  borderColor: '#00bcd4',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#00e5ff',
                    bgcolor: 'rgba(0, 188, 212, 0.1)',
                  }
                }}
              >
                Login
              </Button>
            )}
          </>
        )}
      </Toolbar>
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            bgcolor: '#121212',
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Header;
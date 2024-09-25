import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Drawer, FormControl, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material';
import us from './img/Flag-United-States-of-America.webp'
import vn from './img/quockyvn.jpg'
import { useState } from 'react';
import { useEffect } from 'react';
import { removeVietnameseAccent } from '@mieuteacher/meomeojs';
import Items from './Items';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar() {
  const [language, setLanguage] = React.useState(localStorage.getItem("locales") || "en");
  const [locale, setLocale] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [storedData, setStoredData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  console.log("drawerOpen", drawerOpen);

  useEffect(() => {
    if (storedData && storedData.length > 0) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      let filteredResults = [];

      if (locale === 'en') {
        filteredResults = storedData.filter(item =>
          item.en && (normalizeString(item.en.name).includes(normalizedSearchTerm) || normalizeString(removeVietnameseAccent(item.en.name)).includes(normalizedSearchTerm))
        );
      } else if (locale === 'vi') {
        filteredResults = storedData.filter(item =>
          item.vi && (normalizeString(item.vi.name).includes(normalizedSearchTerm) || normalizeString(removeVietnameseAccent(item.vi.name)).includes(normalizedSearchTerm))
        );
      }
      setSearchResults(filteredResults);
    }
  }, [storedData, locale, searchTerm]);
  function normalizeString(str) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  useEffect(() => {
    const data = localStorage.getItem('formData');
    const storedLocale = localStorage.getItem('locales');

    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData) {
        setStoredData(parsedData);
      } else {
        setStoredData([]);
      }
    }

    if (storedLocale) {
      setLocale(storedLocale);
    }
  }, []);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const changeLanguage = (lng) => {
    localStorage.setItem("locales", lng);
    setLanguage(lng);
    window.location.reload();
  };
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    changeLanguage(selectedLanguage);
  };
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (storedData && storedData.length > 0) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      let filteredResults = [];

      if (locale === 'en') {
        filteredResults = storedData.filter(item =>
          item.en && (normalizeString(item.en.name).includes(normalizedSearchTerm) || normalizeString(removeVietnameseAccent(item.en.name)).includes(normalizedSearchTerm))
        );
      } else if (locale === 'vi') {
        filteredResults = storedData.filter(item =>
          item.vi && (normalizeString(item.vi.name).includes(normalizedSearchTerm) || normalizeString(removeVietnameseAccent(item.vi.name)).includes(normalizedSearchTerm))
        );
      }

      setSearchResults(filteredResults);
    }
  }, [storedData, locale, searchTerm]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" onClick={toggleDrawer(true)}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchChange}
            />
          </Search>
          <FormControl variant="standard" sx={{ marginLeft: 'auto', color: 'white', width: '35%' }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ color: 'white' }}
            >
              <MenuItem value="en">
                <ListItemIcon onClick={() => changeLanguage('en')}>
                  <Avatar src={us} sx={{ width: '70px', height: '100%' }} />
                </ListItemIcon>
                English
              </MenuItem>
              <MenuItem value="vi">
                <ListItemIcon onClick={() => changeLanguage('vi')} >
                  <Avatar src={vn} sx={{ width: '70px', height: '70px' }} />
                </ListItemIcon>
                Tiếng Việt
              </MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}  >
        <Items />
      </Drawer>
      {searchTerm == "" ? (
        <>dw</>
      ) : (
        searchResults.map((item, index) => (
          <div key={index}>
            {/* <ListItem button component={Link} to={`/details/${item.id}`}> */}
            <ListItemAvatar>
              <Avatar src={item.en.images[0]} style={{ width: '200px', height: '200px' }} />
            </ListItemAvatar>
            <ListItemText primary={locale === 'en' ? item.en.name : item.vi.name} />
            {/* </ListItem> */}
          </div>
        ))
      )}
    </Box>
  );
}

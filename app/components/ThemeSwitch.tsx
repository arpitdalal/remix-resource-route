import {
  Form,
  useLocation,
} from 'remix';

import Brightness2Icon from '@mui/icons-material/Brightness2';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

const ThemeSwitch = () => {
  const themeName = useTheme().palette.mode;
  const location = useLocation();

  return (
    <Form replace action="/api/toggle-theme" method="post">
      <input
        type="hidden"
        name="redirectBack"
        value={`${location.pathname}${location.search}`}
      />
      <Tooltip title="Toggle theme">
        <IconButton type="submit" aria-label="Toggle theme">
          {themeName === "light" ? <Brightness7Icon /> : <Brightness2Icon />}
        </IconButton>
      </Tooltip>
      <Typography component="h1" variant="h6">
        Selected theme: {themeName}
      </Typography>
    </Form>
  );
};

export default ThemeSwitch;

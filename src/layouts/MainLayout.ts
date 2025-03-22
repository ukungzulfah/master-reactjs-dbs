import { Button, Center, Column, Container, Draggable, Expanded, IconButton, Paper, Root, Rows, Space, Switch, Text, TextField, Toast } from "../System/Lib/Widgets";
import { useEffect, useState } from "react";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch } from "react-redux";
import { useTheme } from "../hooks/useTheme";
import { toggleTheme } from "../store/sliceThemes";
import bg1 from '../assets/images/bg1.png';
import bg2 from '../assets/images/bg2.png';

export default function MainLayout() {
  const Theme = useTheme();
  const dispatch = useDispatch();
  
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touchedPwd, setTouchedPwd] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (loading) {
      setButtonDisabled(true);
      return;
    }
    return;
  }, [loading]);

  useEffect(() => {
    console.log("Init apps");
    const timer = setTimeout(() => setButtonDisabled(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const componentUsername = TextField({
    value: username,
    label: "Masukkan email",
    helperText: "Format email: nama@domain.com",
    placeholder: "Masukkan email Anda",
    required: true,
    maxLength: 30,
    error: touched && username.length < 8,
    startAdornment: IconButton(AccountCircleIcon),
    onChange: (event: any) => setUsername(event.target.value),
    onBlur: () => setTouched(true),
  });

  const passwordComponent = TextField({
    value: password,
    label: "Masukkan Password",
    helperText: "Minimal 8 karakter",
    placeholder: "Masukkan password Anda",
    required: true,
    obscureText: !showPassword,
    maxLength: 8,
    error: touchedPwd && password.length < 8,
    startAdornment: IconButton(LockPersonIcon),
    endAdornment: IconButton(showPassword ? VisibilityIcon : VisibilityOffIcon, {
      color: "theme.textPrimary", onClick: () => setShowPassword(!showPassword)
    }),
    onChange: (e: any) => setPassword(e.target.value),
    onBlur: () => setTouchedPwd(true),
  });

  const buttonLogin = Container({
    width: 130, height: 40,
    child: Button("Login", {
      disabled: buttonDisabled,
      textColor: "white",
      confirm: true,
      loading,
      click: () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          Toast("Login success");
        }, 2000);
      }
    })
  });

  return Root({
    theme: Theme,
    image: Theme.mode === "dark" ? bg2 : bg1,
    child: Column({
      center: true,
      children: [
        Draggable({
          position: { x: (window.screen.availWidth - 340) / 2, y: 100 },
          child: Paper({
            elevation: 10,
            child: Column({
              width: 340, height: 'unset', flex: "unset", padding: 20,
              children: [
                Center({ child: Text("Login", { size: 30, weight: "bold" }) }),
                Space(30),
                Container({ width: 300, child: componentUsername }),
                Space(30),
                Container({ width: 300, child: passwordComponent }),
                Space(10),
                Rows({ width: 300, children: [Expanded(), buttonLogin] }),
                Switch({
                  checked: Theme.mode === "dark",
                  label: Theme.mode === "dark" ? "Dark Theme" : "Light Theme",
                  onChange: () => dispatch(toggleTheme()),
                }),
              ]
            })
          })
        })
      ]
    })
  }).builder();
}
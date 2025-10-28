import { useState } from "react";
import { Alert, Button, Center, Click, Column, Container, Icon, MediaQuery, Paper, Positioned, Root, Space, Stack, Text, TextField } from "../System/Lib/Widgets";
import { useNavigate } from "react-router-dom";
import ApiFetcher from "../System/Lib/ApiFetcher";
import { API_URL } from "../assets/config/config";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formWidth = 400;
  const formHeight = 520;
  const navigate = useNavigate();

  const handleLogin = () => {
    const fetcher = new ApiFetcher(API_URL);
    fetcher.post("/public/login", {
      username: email,
      password: password
    }).then((response: any) => {
      if (response.code === 200) {
        localStorage.setItem("auth_token", response.data.token);
        navigate("/dashboard");
      } else {
        Alert({
          title: "Login Failed",
          message: response.message || "Invalid email or password.",
        });
      }
    }).catch((_: any) => {
      Alert({
        title: "Server Error",
        message: "An error occurred. Please try again.",
      });
    });
  };

  return Root({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Gradient background
    child: Stack({
      children: [
        Positioned({
          top: (MediaQuery.height() - formHeight) / 2,
          left: (MediaQuery.width() - formWidth) / 2,
          child: Paper({
            elevation: 20,
            borderRadius: 15, // Softer corners
            child: Container({
              width: formWidth,
              height: formHeight,
              padding: 30, // Increased padding
              backgroundColor: "#ffffff", // White form background
              borderRadius: 15,
              child: Column({
                mainAxisAlignment: "center", // Center content vertically
                crossAxisAlignment: "center", // Center content horizontally
                children: [
                  Text("Sign In", {
                    fontSize: 32, // Larger title
                    fontWeight: "600", // Bolder
                    color: "#1f2937", // Darker text
                    marginBottom: 15
                  }),
                  Text("Welcome back! Please sign in to continue.", {
                    fontSize: 16,
                    color: "#6b7280", // Softer gray
                    marginBottom: 35,
                    textAlign: "center"
                  }),
                  TextField({
                    width: formWidth - 60, // Full width within padding
                    placeholder: "Enter your email",
                    borderRadius: 8,
                    fontSize: 16,
                    obscureText: false,
                    value: email,
                    onChange: (e: any) => {
                      setEmail(e.target.value);
                    },
                    startIcon: Icon('email', {
                      color: "#6b7280",
                      cursor: "pointer"
                    })
                  }),
                  Space(10), // Space between fields
                  TextField({
                    width: formWidth - 60,
                    placeholder: "Enter your password",
                    borderRadius: 8,
                    fontSize: 16,
                    value: password,
                    obscureText: !showPassword,
                    onChange: (e: any) => {
                      setPassword(e.target.value);
                    },
                    startIcon: Icon('lock', {
                      color: "#6b7280",
                      cursor: "pointer",
                      onClick: () => {
                        setShowPassword(!showPassword);
                      }
                    }),
                    endIcon: Icon('eyevisibility_off', {
                      color: "#6b7280",
                      onClick: () => {
                        setShowPassword(!showPassword);
                      }
                    })
                  }),
                  Space(30), // Space between fields
                  Container({
                    width: formWidth - 60,
                    height: 40, // Taller button
                    marginBottom: 25,
                    child: Button("Sign In", {
                      backgroundColor: "#4f46e5", // Vibrant primary color
                      color: "white",
                      borderRadius: 8,
                      fontSize: 18, // Larger text
                      fontWeight: "500",
                      cursor: "pointer",
                      onClick: () => handleLogin(),
                    })
                  }),
                  Container({
                    width: formWidth - 60,
                    child: Click({
                      click: () => {
                        navigate("/forgot-password");
                      },
                      child: Center({
                        child: Text("Forgot Password?", {
                          fontSize: 14,
                          color: "#4f46e5",
                          cursor: "pointer",
                        })
                      })
                    }),
                    marginBottom: 15
                  }),
                  Container({
                    width: formWidth - 60,
                    child: Center({
                      child: Text("Don't have an account? Sign Up", {
                        fontSize: 14,
                        color: "#4f46e5",
                        cursor: "pointer",
                      })
                    })
                  })
                ]
              })
            })
          })
        })
      ]
    })
  }).builder();
}

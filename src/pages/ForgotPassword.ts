import { useState } from "react";
import { Button, Center, Click, Column, Confirm, Container, Icon, MediaQuery, Paper, Positioned, Root, Space, Stack, Text, TextField } from "../System/Lib/Widgets"; // Pastikan path import ini benar
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const formWidth = 400;
  const formHeight = 420;
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/");
  };

  const handlePasswordReset = () => {
    // Logic to handle password reset
    console.log("Password reset link sent to:", email);
    Confirm({
      title: "Success",
      message: "A password reset link has been sent to your email.",
      onAccept: () => {
        navigateToLogin();
      }
    });
  };

  return Root({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                  Text("Forgot Password", {
                    fontSize: 32, // Larger title
                    fontWeight: "600", // Bolder
                    color: "#1f2937", // Darker text
                    marginBottom: 15
                  }),
                  Text("Please enter your email address to reset your password.", {
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
                  Space(30),
                  Container({
                    width: formWidth - 60,
                    height: 40, // Taller button
                    marginBottom: 25,
                    child: Button("Reset Password", {
                      backgroundColor: "#4f46e5", // Vibrant primary color
                      color: "white",
                      borderRadius: 8,
                      fontSize: 18, // Larger text
                      fontWeight: "500",
                      cursor: "pointer",
                      onClick: () => handlePasswordReset(),
                    })
                  }),
                  Space(30),
                  Container({
                    width: formWidth - 60,
                    child: Click({
                      click: () => {
                        navigateToLogin();
                      },
                      child: Center({
                        child: Text("Back to Login", {
                          fontSize: 14,
                          color: "#4f46e5",
                          cursor: "pointer",
                        })
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

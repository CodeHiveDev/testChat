import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";

interface Message {
  text: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get<Message[]>("/api/chat");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post<string>("/api/chat", { text: input });
      setMessages([...messages, { text: input, isUser: true }]);
      setMessages([...messages, { text: response.data, isUser: false }]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        minHeight="100vh"
        p={2}
        bgcolor="#f0f0f0"
      >
        <Box
          flexGrow={1}
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-end"
          mb={2}
        >
          <Paper elevation={3} sx={{ p: 2, maxWidth: 400, width: "100%" }}>
            <List sx={{ overflow: "auto", maxHeight: 300 }}>
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider sx={{ my: 1 }} />}
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        message.isUser ? (
                          <Typography variant="subtitle1" color="primary">
                            You
                          </Typography>
                        ) : (
                          <Typography variant="subtitle1" color="secondary">
                            Bot
                          </Typography>
                        )
                      }
                      secondary={
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                          {message.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>

        <Box display="flex" alignItems="center" width="100%" mt={2}>
          <TextField
            variant="outlined"
            label="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ whiteSpace: "nowrap" }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;



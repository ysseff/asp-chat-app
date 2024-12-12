# Real-Time Chat Application

## Overview

This project is a Real-Time Chat Application built using modern web technologies, offering users a responsive and seamless messaging experience. It leverages SignalR for real-time communication and a robust backend built with .NET 9, complemented by a sleek frontend powered by React.

## Features

- **User Registration and Authentication**: Secure account creation and login system.
- **Real-Time Messaging**: Instant communication between users using SignalR.
- **Conversation Management**: Start new conversations or continue existing ones.
- **Profile Management**: Update user details and reset passwords.
- **Clean Design**: The application features a modern and minimalistic design.

## Screenshots

1. Registration Page:
<img width="1160" alt="1" src="https://github.com/user-attachments/assets/e9fb96c6-8b58-4f82-8614-fd9c46e9ba31" />

2. Login Page:
<img width="1160" alt="2" src="https://github.com/user-attachments/assets/056edc05-bd65-472b-8968-bc80a1d53914" />

3. Chat Dashboard:
<img width="1160" alt="3" src="https://github.com/user-attachments/assets/e031d754-7718-4c7b-9151-d8139c594b43" />

4. Chat Conversation:
<img width="1160" alt="4" src="https://github.com/user-attachments/assets/e2790331-b545-4862-a9c4-0fbc87cc6285" />

5. New Conversation Modal:
<img width="1160" alt="5" src="https://github.com/user-attachments/assets/d7a204d1-8c00-490d-8ec0-6f21d3073419" />

6. Profile Management:
<img width="1160" alt="6" src="https://github.com/user-attachments/assets/fb3d7bde-0cfc-4a11-bc7f-ee69e4983428" />

7. Reset Password Modal:
<img width="1160" alt="7" src="https://github.com/user-attachments/assets/73933ecc-8e52-488a-b06c-e456222de92d" />

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: .NET 9
- **Database**: Azure SQL Server
- **Real-Time Communication**: SignalR

## File Structure

asp-chat-app/
├── client/
│   ├── src/
│   ├── public/
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── server/
│   ├── MyChatAppBackend/
│   │   ├── Authentication/
│   │   ├── Contracts/
│   │   ├── Controllers/
│   │   ├── Entities/
│   │   ├── Hubs/
│   │   ├── Persistence/
│   │   ├── Services/
│   │   ├── appsettings.json
│   │   ├── Program.cs
│   │   └── ...
├── asp-chat-app.sln
└── README.md


## Setup and Installation

### Prerequisites

- Node.js: Version 14 or higher
- .NET 9 SDK
- Azure SQL Server: Pre-configured database

### Steps to Run Locally

1. Clone the repository:

```bash
git clone <https://github.com/ysseff/asp-chat-app.git>
cd asp-chat-app
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Start the frontend server:
```bash
npm run dev
```
- Access the frontend at http://localhost:5173.

4. Start the backend server:
```bash
cd ../server/MyChatAppBackend
dotnet run
```
Access the backend at http://localhost:5002.

## Usage

1. **Registration and Login**: Create an account or log in using the registration and login pages.
2. **Start Conversations**: Initiate chats with other users using the New Conversation modal.
3. **Chat in Real Time**: Exchange messages instantly.
4. **Manage Your Profile**: Update user details and reset passwords as needed.

## Future Enhancements

To further improve the application and expand its functionality, the following features are planned for future development:

- **Group Chats**: Allow users to create and participate in group conversations.
- **Media Sharing**: Enable users to share images, videos, and files within chat conversations.
- **Message Reactions**: Add the ability to react to messages with emojis for enhanced interaction.
- **Typing Indicators**: Show real-time typing indicators to improve communication flow.
- **Read Receipts**: Display when a message has been read by the recipient.
- **Search Functionality**: Allow users to search for specific messages or conversations.
- **Push Notifications**: Notify users about new messages, even when they’re not actively using the app.
- **Voice Calls**: Introduce real-time voice calling features for richer communication.

These features aim to enhance user experience, making the application more versatile and engaging.

## Acknowledgments

Special thanks to:
- [Abdullah Gamal](https://github.com/abdogemy2002)
- [Salah Aldin](https://github.com/5alahaldin)

Their contributions were invaluable in the development of this project.

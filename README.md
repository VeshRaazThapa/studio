# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the Project

This project requires two processes to be running simultaneously in separate terminals: the Genkit AI server and the Next.js web server.

### 1. Start the Genkit AI Server

In your first terminal, run the following command to start the Genkit development server. This server handles the AI-powered features of the application.

```bash
npm run genkit:watch
```

This command will start the Genkit flows and watch for any changes you make to the files in the `src/ai/flows` directory.

### 2. Start the Next.js Web Application

In your second terminal, run the following command to start the Next.js development server for the user interface.

```bash
npm run dev
```

Once this starts, your web application will be accessible in your browser. The application will communicate with the Genkit server running in the other terminal.

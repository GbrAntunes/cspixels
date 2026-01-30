# CS2 Pixel Manager

A modern web application for Counter-Strike 2 players to save, manage, and organize their favorite grenade lineups (pixels).

![CS2 Pixel Manager](public/window.svg)
*(Replace with an actual screenshot of your app if desired)*

## 🚀 Features

- **Organize Lineups**: Save smokes, flashes, and molotovs with detailed descriptions.
- **Step-by-Step Guides**: Upload multiple images to create a visual walkthrough for each lineup.
- **Map Persistence**: Support for major active duty maps (Mirage, Dust 2, Inferno, Nuke, Ancient, Anubis, Vertigo, Overpass).
- **Filtering & Search**: Quickly find pixels by Map, Side (CT/TR), or name/description.
- **CRUD Operations**: Complete control to Create, Read, Update, and Delete pixels.
- **Local Storage**: Uses a local SQLite database and local file storage, keeping your data private and lightweight.
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (Icons)
- **Database**: [SQLite](https://www.sqlite.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Language**: TypeScript

## 📦 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cspixels.git
   cd cspixels
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   Run the Prisma migration to create the local SQLite database (`dev.db`).
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start using the app.

## 📂 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components (PixelCard, PixelForm, etc.).
- `/lib`: Utility functions and server actions.
- `/prisma`: Database schema and migrations.
- `/public/uploads`: Stores the user-uploaded images (ignored in git).

## 🤝 Contributing

Feel free to fork this project and submit pull requests. Suggestions and feature requests are welcome!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

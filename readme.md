
# FinanceGet Backend

This is the backend for the FinanceGet application, a tool for managing personal finances.

## Project Flow

The backend is built with Express.js and utilizes MongoDB for data storage.

**Key Components:**

- **Authentication:** User registration and login are handled using JWT authentication.
- **Expenses:** Tracks user expenses with categories and amounts.
- **Income:** Records user income sources and amounts.
- **Budget:** Allows users to set budget limits for specific categories.

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soumen974/Finence-get-backend.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a .env file:**
   ```bash
   touch .env
   ```
4. **Add your MongoDB connection string:**
   ```env
   MONGO_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-name>.mongodb.net/<your-database-name>?retryWrites=true&w=majority
   ```
5. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Authenticate an existing user
- **POST /api/auth/logout** - Logout a user

### Expenses

- **GET /api/expenses** - Get all expenses for the current user
- **GET /api/expenses/:id** - Get a specific expense
- **POST /api/expenses** - Create a new expense
- **PUT /api/expenses/:id** - Update an expense
- **DELETE /api/expenses/:id** - Delete an expense

### Income

- **GET /api/income** - Get all income for the current user
- **GET /api/income/:id** - Get a specific income source
- **POST /api/income** - Create a new income source
- **PUT /api/income/:id** - Update an income source
- **DELETE /api/income/:id** - Delete an income source

### Budget

- **GET /api/budget** - Get all budget limits for the current user
- **GET /api/budget/:id** - Get a specific budget limit
- **POST /api/budget** - Create a new budget limit
- **PUT /api/budget/:id** - Update a budget limit
- **DELETE /api/budget/:id** - Delete a budget limit

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is for just personal projects practice purpose, you can feel free to use but give it a star.
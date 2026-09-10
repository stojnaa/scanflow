# ScanFlow

ScanFlow is a full-stack workforce management application developed as a university team project. It helps organizations manage employees, teams, shifts and daily tasks, while supporting secure attendance tracking through dynamic QR codes.

## Overview

The application provides separate functionality for workers, managers and administrators through role-based access control.

Workers can view assigned tasks and shifts, submit requests and record their attendance. Managers can organize teams, schedule shifts, assign tasks, publish announcements and monitor task statistics. Administrators can manage employees and QR terminals.

## My Contribution

* Integrated the React frontend with the Django REST API using Axios
* Worked on JWT authentication and role-based access control
* Contributed to the implementation and integration of workforce management features
* Developed automated Selenium tests for key user workflows
* Participated in database modeling, debugging and end-to-end integration

## Main Features

* JWT authentication
* Role-based access for workers, managers and administrators
* Employee and team management
* Shift scheduling
* Task creation and assignment
* Task status and progress tracking
* Employee request submission and approval
* Organizational announcements
* Dynamic QR code generation and scanning
* Employee check-in and check-out tracking
* Manager statistics and data visualization
* Automated end-to-end testing

## Tech Stack

### Backend

* Python
* Django 5.2.15
* Django REST Framework
* MySQL
* PyMySQL
* PyJWT
* django-cors-headers

### Frontend

* React 19
* JavaScript
* Vite 8
* Axios
* React Router
* Bootstrap
* React Bootstrap
* Recharts
* html5-qrcode
* qrcode.react

### Testing

* Selenium
* Pytest

## Project Structure

```text
project_IronFour/
├── backend/            # Django REST API and database models
├── frontend/           # React application
├── frontPrototype/     # Initial frontend prototype
├── selenium_tests/     # Automated end-to-end tests
├── models/             # UML and system models
├── docs/               # Project documentation
└── README.md
```

## Running the Project Locally

### Prerequisites

Before running the application, install:

* Python
* Node.js and npm
* MySQL

## Database Setup

Create a local MySQL database named `scanflow`:

```sql
CREATE DATABASE scanflow;
```

Configure the local database connection using your own MySQL credentials.

Do not commit database passwords, secret keys or other private credentials to the repository.

## Backend Setup

From the project root, navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

On macOS or Linux:

```bash
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Apply the database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available at:

```text
http://localhost:8000/api/
```

The Django administration interface will be available at:

```text
http://localhost:8000/admin/
```

## Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

By default, the frontend sends API requests to:

```text
http://localhost:8000/api
```

## Running Selenium Tests

Before running the tests, make sure that:

* The MySQL database is running
* The Django backend is running at `http://localhost:8000`
* The React frontend is running at `http://localhost:5173`

From the project root, navigate to the Selenium test directory:

```bash
cd selenium_tests
```

Install the test dependencies:

```bash
pip install -r requirements.txt
```

Run all tests:

```bash
pytest
```

Run a specific test file:

```bash
pytest test_prijava_registracija.py
```

## Frontend Scripts

Run the frontend development server:

```bash
npm run dev
```

Run the frontend with the phone configuration:

```bash
npm run dev:phone
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

## API Communication

The frontend uses a centralized Axios client to communicate with the Django REST API.

The default API URL is:

```text
http://localhost:8000/api
```

A different URL can be provided through the `VITE_API_URL` environment variable.

Authenticated requests include a JWT token in the following header:

```text
Authorization: Bearer <token>
```

## Security

The project uses custom JWT authentication for employees. Access to protected endpoints is controlled according to the authenticated employee's role.

Local credentials and secret values should be stored in environment variables and must not be committed to the repository.

## Future Improvements

* Move all configuration and secret values to environment variables
* Add deployment configuration
* Add unit and integration test coverage
* Improve API documentation
* Add Docker support
* Improve mobile responsiveness
* Add continuous integration with GitHub Actions

## Team Project

ScanFlow was developed as a university team project. The repository demonstrates collaborative full-stack development, REST API integration, relational database modeling and automated browser testing.

# CarRental - Full Stack Car Rental Platform

## Overview

CarRental is a full-stack web application that allows users to browse, search, and book premium vehicles, while car owners can list and manage their cars. The platform features secure authentication, real-time car availability, image uploads with ImageKit, and a responsive UI.

---

## Features

- **User Authentication:** Secure JWT-based login and registration.
- **Role Management:** Users can become owners and list their cars.
- **Car Listings:** Browse, search, and filter available cars.
- **Booking System:** Book cars for specific dates and locations.
- **Owner Dashboard:** Manage listed cars, bookings, and availability.
- **Image Uploads:** Car and profile images are uploaded to ImageKit cloud storage, organized in folders.
- **Responsive Design:** Built with React and Tailwind CSS for a seamless experience on all devices.
- **RESTful API:** Robust backend with Express and MongoDB.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Image Storage:** [ImageKit](https://imagekit.io/)
- **Authentication:** JWT
- **Deployment:** Ready for Vercel or similar platforms

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB Atlas account
- ImageKit account

### Environment Variables

#### `client/.env`
```env
VITE_CURRENCY=$
VITE_BASE_URL=http://localhost:3000
```

#### `server/.env`
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLICKEY=your_imagekit_public_key
IMAGEKIT_PRIVATEKEY=your_imagekit_private_key
IMAGEKIT_ENDPOINT=your_imagekit_endpoint
```

### Installation

#### 1. Clone the repository
```sh
git clone https://github.com/yourusername/CarRental.git
cd CarRental
```

#### 2. Install dependencies

**Backend:**
```sh
cd server
npm install
```

**Frontend:**
```sh
cd ../client
npm install
```

#### 3. Start the development servers

**Backend:**
```sh
cd server
npm run dev
```

**Frontend:**
```sh
cd client
npm run dev
```

---

## Folder Structure

```
CarRental/
  client/      # React frontend
  server/      # Node.js/Express backend
```

---

## Special Features

- **ImageKit Integration:**  
  All car and user profile images are uploaded to ImageKit, organized in folders (e.g., `/cars`, `/profile`). This ensures fast, reliable, and optimized image delivery.

- **Role Switching:**  
  Users can become owners with a single click, unlocking the ability to list and manage cars.

- **Protected Routes:**  
  Owner and user dashboards are protected and only accessible to authenticated users.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [ImageKit](https://imagekit.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)

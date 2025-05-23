require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const bloodEventRoutes = require("./routes/bloodEventRoutes");
const bloodLocationRoutes = require("./routes/bloodLocationRoutes");
const roadsideHelpRoutes = require("./routes/roadsideHelpRoutes");
const aidLocationRoutes = require("./routes/aidLocationRoutes");
const aidEventRoutes = require("./routes/aidEventRoutes");
const houseRenovationEventRoutes = require("./routes/houseRenovationEventRoutes");
const animalWelfareRoutes = require("./routes/animalWelfareRoutes");
const orphanSupportRoutes = require("./routes/orphanSupportRoutes");
const elderlyCareRoutes = require("./routes/elderlyCareRoutes");
const literacyProgramsRoutes = require("./routes/literacyProgramsRoutes");
const animalWelfareEventRoutes = require("./routes/animalWelfareEventRoutes"); 
const orphanSupportEventRoutes = require("./routes/orphanSupportEventRoutes"); 
const elderlyCareEventRoutes = require("./routes/elderlyCareEventRoutes"); 
const literacyProgramsEventRoutes = require("./routes/literacyProgramsEventRoutes");    
const roadEventRoutes = require("./routes/roadEventRoutes");
const houseRenovationRoutes = require("./routes/houseRenovationRoutes");
const seasonalServicesRoutes = require("./routes/seasonalServicesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Successfully connected to the database"))
  .catch((err) => console.error("❌ Database connection failed", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blood/events", bloodEventRoutes);
app.use("/api/blood/locations", bloodLocationRoutes);
app.use("/api/roadside", roadsideHelpRoutes);
app.use("/api/aid/locations", aidLocationRoutes);
app.use("/api/aid/events", aidEventRoutes);
app.use("/api/house-renovation/events", houseRenovationEventRoutes);
app.use("/api/animal/locations", animalWelfareRoutes);
app.use("/api/orphan-support/locations", orphanSupportRoutes);
app.use("/api/elderly-care/locations", elderlyCareRoutes);
app.use("/api/literacy-programs/locations", literacyProgramsRoutes);
app.use("/api/animal-welfare/events", animalWelfareEventRoutes); 
app.use("/api/orphan-support/events", orphanSupportEventRoutes); 
app.use("/api/elderly-care/events", elderlyCareEventRoutes); 
app.use("/api/literacy-programs/events", literacyProgramsEventRoutes); 
app.use("/api/road/events", roadEventRoutes);
app.use("/api/houseRenovation/locations", houseRenovationRoutes);
app.use("/api/seasonalServices/locations", seasonalServicesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));

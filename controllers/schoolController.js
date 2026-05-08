const School = require("../models/School");
const calculateDistance = require("../utils/distance");

exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be numbers",
      });
    }

    const school = await School.create({
      name,
      address,
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: school,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "User latitude and longitude required",
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schools = await School.findAll();

    const sortedSchools = schools
      .map((school) => {
        const distance = calculateDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        );

        return {
          id: school.id,
          name: school.name,
          address: school.address,
          latitude: school.latitude,
          longitude: school.longitude,
          distance: distance.toFixed(2) + " KM",
        };
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.status(200).json({
      success: true,
      count: sortedSchools.length,
      data: sortedSchools,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
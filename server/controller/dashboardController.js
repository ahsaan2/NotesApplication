const Note = require("../models/Notes");
const mongoose = require("mongoose");

exports.dashboard = async (req, res) => {
  const perPage = 10; // Number of notes per page
  const page = req.query.page || 1;
  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App",
  };

  try {
    // Aggregation pipeline to fetch, filter, and sort the notes
    const notes = await Note.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id), // Match notes by user ID
        },
      },
      {
        $sort: {
          createdAt: -1, // Sort by creation date (descending)
        },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] }, // Truncate the title to 30 characters
          body: { $substr: ["$body", 0, 100] },   // Truncate the body to 100 characters
        },
      },
    ])
      .skip(perPage * page - perPage) // Skip based on the current page
      .limit(perPage); // Limit the number of notes per page

    // Count the total number of notes for pagination
    const count = await Note.countDocuments({
      user: new mongoose.Types.ObjectId(req.user.id), // Count notes by user ID
    });

    // Render the dashboard page with the notes and pagination information
    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage), // Calculate total pages
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res.status(500).send("Error retrieving notes.");
  }
};

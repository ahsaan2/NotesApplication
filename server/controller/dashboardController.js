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
          body: { $substr: ["$body", 0, 100] }, // Truncate the body to 100 characters
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

// view NOte
exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();
  // get the note and render it
  if (note) {
    res.render("dashboard/View-note", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Somethong went wrong.");
  }
};
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        body: req.body.body,
      }
    ).where({
      user: req.user.id,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log("Erro in the update method", error);
  }
  res.send("Post request handled");
};

// exports.dashboardDeleteNote = async (req, res) => {
//   try {
//     await Note.deleteOne({
//       _id: req.params.id,
//     }).where({ user: req.user.id });
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.log("Error deleting note", error);
//   }
// };

// Add notes

exports.dashboardDeleteNote = async (req, res) => {
  try {
    // Find the note by id and ensure it belongs to the current user
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    // Check if the note exists
    if (!note) {
      // If no note is found, send an error response
      return res.status(404).send('Note not found or you do not have permission to delete this note.');
    }

    // Delete the note
    await Note.deleteOne({ _id: req.params.id, user: req.user.id });

    // Redirect to the dashboard after deletion
    res.redirect('/dashboard');
  } catch (error) {
    // Log the error and provide feedback to the user
    console.log("Error deleting note", error);
    res.status(500).send('Internal Server Error. Please try again later.');
  }
};


exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
     
    req.body.user = req.user.id;
    res.redirect('/dashboard')
    await Note.create(req.body);
  } catch (error) {
    console.log("Unable to add the new Note", error);
  }
};




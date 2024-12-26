// get homepage
exports.homepage = async (req, res) => {
  // asynchronous function, -->> always returns a promise.
  const locals = {
    title: "NodeJs Notes",
    description: "Free NodeJs Notes App",
  };
  res.render("index", {
    locals, 
    layout: '../views/layouts/front-page'
  });
};

// ABOUT PAGE
exports.about = async (req, res) => {
  const locals = {
    title: "About Node-js Notes App",
    description: "NodeJs Notes App",
  };
  res.render("about", locals);
};


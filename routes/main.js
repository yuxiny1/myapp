module.exports = function (app, shopData) {
  const bcrypt = require("bcrypt");
  const { application } = require("express");
  const { check, validationResult, sanitize } = require("express-validator");
  const request = require("request");
  //route for the weather api

  // GET route for the home page
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect("/login");
    } else {
      next();
    }
  };

  function afterLogin(message, url) {
    // this function is used to redirect the user to the login page after a successful login
    let msg =
      "<script>alert('" +
      message +
      "');window.location.href='" +
      url +
      "';</script>";
    // another local version should be ./
    return msg;
  }

  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

    //searching in the database
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });
  app.get("/search-result", function (req, res) {
    //searching in the database
    //res.send("You searched for: " + req.query.keyword);
    let keyword= req.sanitize(req.query.keyword);
    let sqlquery =
      "SELECT * FROM foods WHERE name LIKE '%" + keyword + "%'"; // query database to get all the ingredients
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      if (result.length == 0) {
        res.send("No results found");
      }
      res.render("list.ejs", newData);
    }
    

    );
  });

  // GET route for the register page
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  // POST route for the register page, validate the input and add the user to the database
  app.post(
    "/registered",
    [check("email").isEmail().withMessage("Invalid email")],
    [check("userName").isLength({ min: 5 }).withMessage("Username too short")],
    [check("password").isLength({ min: 5 })],
    function (req, res) {
      // saving data in database
      // using name variables to store the input data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.redirect("./register");
      } else {
        // sanitize the input
        let email = req.sanitize(req.body.email);
        let firstName = req.sanitize(req.body.firstName);
        let lastName = req.sanitize(req.body.lastName);
        let userName = req.sanitize(req.body.userName);
        let password = req.sanitize(req.body.password);
        if (
          firstName == "" ||
          lastName == "" ||
          userName == "" ||
          password == "" ||
          email == ""
        ) {
          res.send("Please fill the register form all ");
        } else {
          let sqlQueryRegister =
            "SELECT * FROM users WHERE userName = '" +
            req.body.userName +
            "' OR emailAddress='" +
            email +
            "'";
          // query database to get users and password
          db.query(sqlQueryRegister, (err, result) => {
            if (result.length == 0) {
              const saltRounds = 10;
              const plainPassword = req.body.password;
              // hash the password
              bcrypt.hash(
                plainPassword,
                saltRounds,
                function (err, hashedPassword) {
                  if (err) {
                    console.log(err);
                    res.redirect("/");
                  }
                  let sqlquery =
                    "INSERT INTO users (firstName, lastName, userName, emailAddress, password) VALUES ('" +
                    firstName +
                    "', '" +
                    lastName +
                    "', '" +
                    userName +
                    "', '" +
                    email +
                    "', '" +
                    hashedPassword +
                    "')";
                  db.query(sqlquery, (err, result) => {
                    if (err) {
                      console.log("error inserting into database");
                      res.redirect("./");
                    }
                    console.log(
                      "New registered user info are inserted into databse"
                    );
                    result =
                      "Hello " +
                      req.body.firstName +
                      " " +
                      req.body.lastName +
                      " you are registered";
                    res.send(result);
                  });
                }
              );
            } else {
              console.log(" user or email already exists");
              res.send(
                "useranme or email address alread exists, please enter a valid username and email address"
              );
            }
          });
        }
      }
    }
  );

  // login page to input useranme and password
  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });

  // login page to input useranme and password
  app.post("/loggedin", function (req, res) {
    //sanitize the input
    let username = req.sanitize(req.body.userName);
    let password = req.sanitize(req.body.password);
    if (username == "" || password == "") {
      console.log("Empty fields");
      res.send("Please enter a valid username and password");
    } else {
      // check if the username exists in the database
      let sqlquery = "SELECT *FROM users WHERE username =? ";
      let sql_v = [username];
      db.query(sqlquery, sql_v, (err, result) => {
        if (err) {
          console.log("not getting the username from our database");
          res.redirect("./");
        } else {
          let checkUsername = false;
          let index = 0;
          for (let i = 0; i < result.length; ++i) {
            console.log(result);
            // check if the username exists in the database
            if (result[i].userName == username) {
              checkUsername = true;
              index = i;
              break;
            } else {
              checkUsername = false;
            }
            res.send("Please enter a valid username and password");
          }

          if (checkUsername) {
            // check if the password is correct
            const plainpassword = password;
            const hashedPassword = result[0].password;
            console.log(plainpassword);
            console.log(hashedPassword);
            bcrypt.compare(
              plainpassword,
              hashedPassword,
              function (err, result) {
                if (err) {
                  console.log(err);
                  res.redirect("./loggedin");
                } else {
                  if (result == true) {
                    // if the password is correct, redirect to the the page
                    // pass the santized username to the session
                    req.session.userId = sql_v;
                    let msg = "you are successfully logged in";
                    res.send(afterLogin(msg, "about"));
                  } else {
                    console.log("WRONG USERNAME OR PASSWORD");
                    res.send("WRONG USERNAME OR PASSWORD");
                  }
                }
              }
            );
          }
          // if the username does not exist in the database
          else {
            console.log("WRONG USERNAME OR PASSWORD");
            res.send("WRONG USERNAME OR PASSWORD");
          }
        }
      });
    }
  });

  // GET route for the logout page and redirect to the login page
  app.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.send("You are logged out");
      }
    });
  });

  app.get("/list", redirectLogin, function (req, res) {
    let sqlquery = "SELECT * FROM foods"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  // GET route for the add book page
  app.get("/addbook", redirectLogin, function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  // POST route for the add book page, validate the input and add the book to the database

  app.post("/bookadded", function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO foods (name, Typical_values_per, Unit_of_the_typical_value, Carbs_per, Unit_of_the_carbs, Fat_per, Unit_of_the_fat, Protein_per, Unit_of_the_protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; // query database to get all the books

    // execute sql query
    let name = req.sanitize(req.body.name);
    let Typical_values_per = req.sanitize(req.body.Typical_values_per);
    let Unit_of_the_typical_value = req.sanitize(
        req.body.Unit_of_the_typical_value
    );
    let Carbs_per = req.sanitize(req.body.Carbs_per);
    let Unit_of_the_carbs = req.sanitize(req.body.Unit_of_the_carbs);
    let Fat_per = req.sanitize(req.body.Fat_per);
    let Unit_of_the_fat = req.sanitize(req.body.Unit_of_the_fat);
    let Protein_per = req.sanitize(req.body.Protein_per);
    let Unit_of_the_protein = req.sanitize(req.body.Unit_of_the_protein);
    let newrecord = [
        name,
        Typical_values_per,
        Unit_of_the_typical_value,
        Carbs_per,
        Unit_of_the_carbs,
        Fat_per,
        Unit_of_the_fat,
        Protein_per,
        Unit_of_the_protein,
    ];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else
        res.send(
          " This ingredient is added to database, name: " + name + " price " 
        );
    });
  });

  app.get("/bargainbooks", function (req, res) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("bargains.ejs", newData);
    });
  });
};

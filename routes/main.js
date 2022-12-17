module.exports = function (app, shopData) {
  const bcrypt = require("bcrypt");
  const { application } = require("express");
  const { check, validationResult, sanitize } = require("express-validator");
  const request = require("request");
  //route for the weather api

  //--------------------------redirect login ----------------------------
  // GET route for the home page
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect("/login");
    } else {
      next();
    }
  };

  //-------------------------after login ----------------------------
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
  /*------------------ search and login ----------------------*/

  //searching in the database
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });
  app.get("/search-result", function (req, res) {
    //searching in the database
    //res.send("You searched for: " + req.query.keyword);
    let keyword = req.sanitize(req.query.keyword);
    let sqlquery = "SELECT * FROM foods WHERE name LIKE '%" + keyword + "%'"; // query database to get all the ingredients
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availablefoods: result });
      console.log(newData);
      if (result.length == 0) {
        res.send("No results found");
      }
      res.render("list.ejs", newData);
    });
  });
  /*------------------ Reigster and login ----------------------*/

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
  //---------------------------list page---------------------------
  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM foods"; // query database to get all the foods
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availablefoods: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  //-------------------------add foods page-------------------------
  // GET route for the add foods page
  app.get("/addfood", redirectLogin, function (req, res) {
    res.render("addfood.ejs", shopData);
  });

  // POST route for the add food page, validate the input and add the food to the database

  app.post("/foodadded", function (req, res) {
    // saving data in database
    let sqlquery =
      "INSERT INTO foods (name, Typical_values_per, Unit_of_the_typical_value, Carbs_per, Unit_of_the_carbs, Fat_per, Unit_of_the_fat, Protein_per, Unit_of_the_protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; // query database to get all the foods

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
    //------------------excute sql query------------------
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else
        res.send(
          "The food has been added to the database." +
            name +
            " the unit of the typical value is " +
            Unit_of_the_typical_value +
            " the unit of the carbs is " +
            Unit_of_the_carbs +
            " the unit of the fat is " +
            Unit_of_the_fat +
            " the unit of the protein is " +
            Unit_of_the_protein +
            "<a href='/list'>Click here to go back to the list</a>"
        );
    });
  });

  //----------------------updatefood session-------------------------------
  app.get("/updatefood", redirectLogin,function (req, res) {
    res.render("updatefood.html");
  });

  app.get("/update-result", function (req, res) {
    let sqlquery = "SELECT * FROM foods WHERE name like ?";

    let word = [req.query.keyword];
    db.query(sqlquery, word, (err, result) => {
      if (err || result == "") {
        res.send("No such food");
      } else {
        res.render("update-result.ejs", { availablefoods: result });
      }
    });
  });

  //----------------------updatefood session-------------------------------
  app.post("/food-updated", function (req, res) {
    // let tijiao = req.body.submit;
    // console.log(tijiao);
    // saving data in database
    let sqlquery =
      "UPDATE foods SET name = ?, Typical_values_per = ?, Unit_of_the_typical_value = ?, Carbs_per = ?, Unit_of_the_carbs = ?, Fat_per = ?, Unit_of_the_fat = ?, Protein_per = ?, Unit_of_the_protein = ? WHERE name = ?";

    // query database to get all the foods

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
      name,
    ];
    //----------------------updatefood session-------------------------------
    if (req.body.submit == "Update") {
      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
          return console.error(err.message);
        } else console.log(result);
        res.send(
          "This ingredient is updated to database, name: " +
            name +
            Typical_values_per +
            Unit_of_the_typical_value +
            Carbs_per +
            Unit_of_the_carbs +
            Fat_per +
            Unit_of_the_fat +
            Protein_per +
            Unit_of_the_protein
        );
      });
    }

    //----------------------deletefood session----------------------------
    if (req.body.submit == "Delete") {
      let sqlquery = "DELETE FROM foods WHERE name = ?";
      let word = [req.body.name];
      db.query(sqlquery, word, (err, result) => {
        if (err) {
          res.send("No such food");
        } else {
          res.send("This food is deleted");
        }
      });
    }
  });

  //----------------------calculate session-------------------------------
  //The Calculate Recipe route
  app.get("/calculateRecipe", (req, res) => {
    // object of name-entered_amount pairs, to store the name of chekced food with the entered amount of it

    //set initial values for the variables
    let totalcarbs = 0;
    let totalfat = 0;
    let totalprotein = 0;

    // object of name-entered_amount pairs, to store the name of chekced food with the entered amount of it
    let foodAmount = {};
    // array of food names, to store the name of chekced food with the entered amount of it
    let foodName = [];
    // array of food amounts, to store the name of chekced food with the entered amount of it
    let foodAmountArray = [];
    let foodNameArray = [];
    // get the name of the food and the amount of it from the form
    console.log(req.query);
    console.log(req.query.length);

    // get the name of the food and the amount of it from the form
    for (let key in req.query) {
      foodName.push(key);
      foodAmount[key] = req.query[key];
      console.log(key);
      console.log(req.query[key]);
    }
    // get the name of the food and the amount of it from the form
    for (let key in foodAmount) {
      foodAmountArray.push(foodAmount[key]);
    }
    // get the name of the food and the amount of it from the form
    for (let i = 0; i < foodName.length; i++) {
      foodNameArray.push(foodName[i]);
    }

    // get the name of the food and the amount of it from the form
    let sqlquery = "SELECT * FROM foods WHERE name IN (?)";
    // get the name of the food and the amount of it from the form
    let word = [foodNameArray];
    console.log(word);
    db.query(sqlquery, word, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      } else {
        console.log(result);
        // get the name of the food and the amount of it from the form
        for (let i = 0; i < result.length; i++) {
          totalcarbs += result[i].Carbs_per * foodAmountArray[i];
          totalfat += result[i].Fat_per * foodAmountArray[i];
          totalprotein += result[i].Protein_per * foodAmountArray[i];
        }

        // get the name of the food and the amount of it from the form
        res.render("recipeInfo.ejs", {
          availableFoods: result,
          totalcarbs: totalcarbs,
          totalfat: totalfat,
          totalprotein: totalprotein,
        });
      }
    });
  });

  //----------------------api session-------------------------------
  //Add a feature to your API to allow a parameter to add a search term. For example, this URL will search for foods that contain the word ‘universe’:

  /*http://localhost:7000/api?keyword=apple this is an example of how to use the api, and you could use those api on the website to search for the food you want to add to the list
   */
  app.get("/api", (req, res) => {
    let sqlquery = "SELECT * FROM foods";
    // execute sql query
    let keyword = req.query.keyword;
    // if keyword is not empty, add the keyword to the sql query
    if (keyword) {
      sqlquery += " WHERE name LIKE '%" + keyword + "%'";
    }
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      res.json(result);
    });
  });


  //Custom GET ROUTE - get food by its name
  //Instructions: from the browser just type in http://doc.gold.ac.uk/usr/666/api/foodName replacing "foodName" with the name of the food item to retrieve it
  //using curl type: " curl -i www.doc.gold.ac.uk/usr/666/api/foodName " in the terminal (again replacing "foodName" with the desired item name)
  //e.g. curl -i www.doc.gold.ac.uk/usr/666/api/Banana
  // CRUD operations of api
  app.get("/api/:name", function (req, res) {
    console.log(req.params["name"]);
    let sql = "SELECT * FROM foods WHERE name = '" + req.params["name"] + "'";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });

  /*-------------------------post request--------------------------*/
  
//POST ROUTE - insert a food
//Instructions: in the terminal type the following, replacing the "body" with the key-value pairs for the properties of the document (food item) you wish to insert
//curl -i -X POST -d '{body}' -H 'Content-Type: application/json' www.doc.gold.ac.uk/usr/666/api
//e.g. for banana: curl -i -X POST -d '{ "name":"Banana", "valueAmount":"100", "unit":"grams", "calories":"88", "carbs":"23", "sugars":"12", "fat":"0.3", "protein":"1.1", "salt":"1", "creator": "yourUsername"}' -H 'Content-Type: application/json' www.doc.gold.ac.uk/usr/666/api

  app.post("/api/:name/:typicalvalue/:carbs/:fat/:protein", function (req, res) {
    let sql =
      "INSERT INTO foods (name, Typical_value_per, Carbs_per, Fat_per, Protein_per) VALUES ('" +
      req.params["name"] +
      "', " +
      req.params["typicalvalue"] +
      ", " +
      req.params["carbs"] +
      ", " +
      req.params["fat"] +
      ", " +
      req.params["protein"] +
      ")";
    db.query
    (sql, (err,result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });

  //Custom DELETE ROUTE - delete food from the database
  //Instructions: from the browser just type in http://doc.gold.ac.uk/usr/666/api/foodName replacing "foodName" with the name of the food item to delete it
  //e.g. http://doc.gold.ac.uk/usr/666/api/Banana

  // app.delete("/api/:name", function (req, res) {
  //   let sql = "DELETE FROM foods WHERE name = '" + req.params["name"] + "'";
  //   db.query(sql, (err, result) => {
  //     if (err) throw err;
  //     console.log(result);
  //     res.send(result);
  //   });
  // });

  // ----------------------end of api session------------------------
};

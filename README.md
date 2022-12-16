# myapp

this is a dynamic web application called"Recipe Buddy"

R1: Homepage - views/index.ejs

R1A: Display the name of the web application. the home page of the web application.  you could simplify type the website to see it :
https://www.doc.gold.ac.uk/usr/666/

views/index.ejs Title on line 4 and the Welcome messages  

R1A: Display the name of the web application. views/index.ejs line 11 
R1B:  Display links to other pages or a navigation bar that contains links to other pages. from line 12- line 20;

R2: About page - views/about.ejs

R2A: line 12 Display information about the web application including my name as the developer. line 7 Display a link to the home page or a navigation bar that contains links to other pages.

R3A: Register page - views/register.ejs. views/register.ejs form lines 14-70 in views/partials/header.ejs will show the function of registering a new user for the databse. Each user data consists of the following fields: first name, last name, email address, username and password. To provide security of data in storage, a hashed password should only be saved in the database, not a plain password. Futhermore, line 5 show s a navigation to the home page.

R3B:routes/main.js lines 65-157 R3B: Collect form data to be passed to the back-end (database) and store user data in the database. Each user data consists of the following fields: first name, last name, email address, username and password. To provide security of data in storage, a hashed password should only be saved in the database, not a plain password.

R3C: Display a message indicating that add operation has been done. in routes/main.js line 137-143 

R4: Login page - views/login.ejs

views/login.ejs lines 9-37 displays the information about login

R4A: Display a form to users to log in to the dynamic web application. The form should consist of the following items: username and password. Display a link to the home page or a navigation bar that contains links to other pages.

routes/main.js lines 160-230 R4B: Collect form data to be checked against data stored for each registered user in the database. Users are logged in if and only if both username and password are correct.

routes/main.js lines 19-29 and lines 210-227 shows sunccessful message after login, and lines 205-230 displays a meesage whether login is successful or not and why not successful. (there will be no hint about which one is wrong because it is not safe)

R5: Logout

routes/main.js lines 234-244 and line 241 logout, a message is displayed upon successful logout.

R6: Add food page (only available to logged-in users) - views/addFood.ejs

views/addFood.ejs lines 12-22 R6A: Display a form to users to add a new food item to the database. The form should consist of the following items: name, typical values, unit of the typical value, carbs, fat, and protein. Display a link to the home page or a navigation bar that contains links to other pages.

routes/main.js lines 260-314 R6B: Collect form data to be passed to the back-end (database) and store food items in the database. Each food item consists of the following fields: name, typical values, unit of the typical value, calories, carbs, fat, protein. Displays views/foodAdded.ejs (from routes/main.js lines 300-311)R6C: Display a message indicating that add operation has been done.

R7: Search food page - views/search.ejs 6-13

views/search.ejs R7A: Display a form to users to search for a food item in the database. 'The form should contain just one field - to input the name of the food item'. Display a link to the home page or a navigation bar that contains links to other pages.

routes/main.js lines 38-61 with results at views/list.ejs with the message not found at routes/main line 57 R7B: Collect form data to be passed to the back-end (database) and search the database based on the food name collected from the form. If food found, display a template file (ejs, pug, etc) including data related to the food found in the database to users; name, typical values, unit of the typical value, calories, carbs, fat, protein. Display a message to the user, if not found.

routes/main.js line 48 R7C: Going beyond, search food items containing part of the food name as well as the whole food name. As an example, when searching for ‘bread’ display data related to ‘pitta bread’, ‘white bread’, ‘wholemeal bread’, and so on.

R8: Update food page (only available to logged-in users) - views/updateFood.ejs

views/updateFood.ejs and routes/main.js line 316-319
R8A: Display search food form. Display a link to the home page or a navigation bar that contains links to other pages.

views/updateFood.ejs and routes/main.js line 320-332
 R8B: If food found, display data related to the food found in the database to users including name, typical values, unit of the typical value, calories, carbs, fat, and protein in forms so users can update each field.

routes/main.js line 327 Display a message to the user if not found.

routes/main.js liens 334-386 Collect form data to be passed to the back-end (database) and store updated food items in the database.

display views/foodUpdated.ejs from routes/main.js lines 337-384 Display a message indicating the update operation has been done.

(not)(done)()sanitized (and form disabled) in views/updateFood.ejs line 29 You can go beyond this requirement by letting ONLY the user who created the same food item update it.

 in views/updatefood.ejs lines 25-55 and deleting in routes/main.js lines 388-400 with successful message displayed with views/foodDeleted.ejs R8C: Implement a delete button to delete the whole record, when the delete button is pressed, it is good practice to ask 'Are you sure?' and then delete the food item from the database, and display a message indicating the delete has been done.

(not)(done)()()checked in the same way as the updating in R8B in views/updateFood.ejs line 29 You can go beyond this requirement by letting ONLY the user who created the same food item delete it.

R9: List food page (available to all users) - views/list.ejs

views/list.ejs R9A: Display all foods stored in the database including name, typical values, unit of the typical value, calories, carbs, fat, protein,  sorted by name. Display a link to the home page or a navigation bar that contains links to other pages.

tabular format in views/list.ejs lines 14-44 R8B: You can gain more marks for your list page is organised in a tabular format instead of a simple list.

views/list.ejs lines 12, 29-47 R9C: going beyond by letting users select some food items (e.g. by displaying a checkbox next to each food item and letting the user input the amount of each food item in the recipe e.g. 2x100 g flour)

calculated values in routes/main.js lines 402-463 and displayed views/recipeInfo.ejs Then collect the name of all selected foods and calculate the sum of the nutritional information (calories, carbs, fat, protein, salt, and sugar) related to all selected food items for a recipe or a meal and display them as ‘nutritional information and calorie count of a recipe or a meal’. Please note, it is not necessary to store recipes or meals in the database.

R10: API - routes/main.js 468-584

routes/main.js 473-487 There is a basic API displayed on '/api' route listing all foods stored in the database in JSON format. i.e. food content can also be accessed as JSON via HTTP method, It should be clear how to access the API (this could include comments in code).

routes/main.js 507-514 Additional credit will be given for an API that implements get, post, push and delete.

R11: form validation

implemented in routes/main.js lines 44, 71-87, 167-170, 273-293,
334-364 with additional custom validators on lines 8-79 and more validation done with the help of HTML attributes on every form input All form data should have validations, examples include checking password length, email validation, integer data is integer and etc.

R12: MySQL


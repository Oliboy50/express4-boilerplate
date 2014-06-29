Express 4 Boilerplate
=====================

To get some informations about what this boilerplate contains, take a look at the **package.json** file (check the dependancies).

Additional informations about how to use it can be found in the **configuration.js** file.

This project is fully customizable in order to fit your needs, do what you want with it.





Install
-------

Download/Clone the project from github.
Open your terminal at the project root then type : 

    npm install
    npm start

Go to [http://localhost:3000](http://localhost:3000) to check if it worked.

Create the database (named in `configuration.js`) and tables (defined in `models` folder) using the route [http://localhost:3000/admin/db/migrate?force=true](http://localhost:3000/admin/db/migrate?force=true)

Then, set authentication data using the route [http://localhost:3000/admin/db/set-authentication](http://localhost:3000/admin/db/set-authentication)

*Don't forget to uncomment `auth.adminRequired` in each route of `routes/admin-db.js` after you've set your admin account, else even anonymous users could clear your db*


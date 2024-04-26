# The recommend system of group porject

# Check the environment if which has node and npm or not

in the terminal to input these commands

### 'node -v'
### 'npm -v'

If these are not in environment, please go to the Node.js official website to download the Node.js

# Install the dependencies of project
In the terminal of the path of project(make sure the package.json in the current path)

### 'npm install'

This command can install the dependencies of package.json.

After that, go to the file ExpressAndPytscript which is the backend project.

### 'npm list express'
### 'npm list cors'

Which are check whether 'express' and 'cors' are installed in the environment.

### 'npm install express --save-dev'
### 'npm install cors --save-dev'

If these are not in environment, run the commands to install them.

# Start the project

Firstly, need to run the node project(back-end), use the command in the fold path './ExpressAndPyscript',and command is :
### 'node server.js'

When the terminal has 'Server listening at http://localhost:4000', which means back-end is successful to run.

Secondly, go to the fold path of project './comp7240',use command:
### 'npm start'

If running is successful, terminal has 'localhost:3000' or other ip address.

Then, the web will be opened and project is successful.

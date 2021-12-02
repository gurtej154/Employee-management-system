require("colors");
require("dotenv");
let figlet = require("figlet");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { printTable } = require("console-table-printer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  (err) => {
    console.log("An error was found!".black.bgRed);
    return;
  },

  console.log(`connected to company database!`.black.bgGreen)
);

init = () => {
  figlet.text(
    "Employee Management System",
    {
      font: "Cricket",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("An error was found!".black.bgRed);
        console.dir(err);
        return;
      }
      console.log("");
      console.log(data.brightBlue);
      try {
        firstPrompt();
      } catch (error) {
        console.error(error);
      }
    }
  );
};

function firstPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "View Employees by Department",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
        "Add Role",
        "End",
      ],
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployees();
          break;
        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employees":
          removeEmployees();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "End":
          db.end();
          break;
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function viewEmployees() {
  console.log("Viewing employees\n");

  let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`;

  db.query(query, function (err, res) {
    if (err) throw err;

    printTable(res);
    console.log("Employees viewed!\n");
    firstPrompt();
  });
}

function viewEmployeesByDepartment() {
  console.log("Viewing employees by department\n");

  let query = `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`;

  db.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.name,
    }));

    printTable(res);
    console.log("Department view succeed!\n");

    promptDepartment(departmentChoices);
  });
}

function promptDepartment(departmentChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you choose?",
        choices: departmentChoices,
      },
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    WHERE d.id = ?`;

      db.query(query, answer.departmentId, function (err, res) {
        if (err) throw err;

        printTable("response ", res);
        console.log(res.affectedRows + "Employees are viewed!\n");

        firstPrompt();
      });
    });
}

function addEmployee() {
  console.log("Inserting an employee!");

  let query = `SELECT r.id, r.title, r.salary 
        FROM role r`;

  db.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));

    printTable(res);
    console.log("RoleToInsert!");

    promptInsert(roleChoices);
  });
}

function promptInsert(roleChoices) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      },
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO employee SET ?`;
      db.query(
        query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;

          printTable(res);
          console.log(res.insertedRows + "Inserted successfully!\n");

          firstPrompt();
        }
      );
    });
}

function removeEmployees() {
  console.log("Deleting an employee");

  let query = `SELECT e.id, e.first_name, e.last_name
        FROM employee e`;

  db.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${id} ${first_name} ${last_name}`,
    }));

    printTable(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
  });
}

function promptDelete(deleteEmployeeChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmployeeChoices,
      },
    ])
    .then(function (answer) {
      let query = `DELETE FROM employee WHERE ?`;
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        printTable(res);
        console.log(res.affectedRows + "Deleted!\n");

        firstPrompt();
      });
    });
}

function updateEmployeeRole() {
  employeeArray();
}

function employeeArray() {
  console.log("Updating an employee");

  let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
      ON m.id = e.manager_id`;

  db.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));

    printTable(res);
    console.log("employeeArray To Update!\n");

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Updating an role");

  let query = `SELECT r.id, r.title, r.salary 
    FROM role r`;
  let roleChoices;

  db.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));

    printTable(res);
    console.log("roleArray to Update!\n");

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to update?",
        choices: roleChoices,
      },
    ])
    .then(function (answer) {
      let query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      connection.query(
        query,
        [answer.roleId, answer.employeeId],
        function (err, res) {
          if (err) throw err;

          printTable(res);
          console.log(res.affectedRows + "Updated successfully!");

          firstPrompt();
        }
      );
    });
}

function addRole() {
  let query = `SELECT d.id, d.name, r.salary AS budget
      FROM employee e
      JOIN role r
      ON e.role_id = r.id
      JOIN department d
      ON d.id = r.department_id
      GROUP BY d.id, d.name`;

  db.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`,
    }));

    printTable(res);
    console.log("Department array!");

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Role title?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Role Salary",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices,
      },
    ])
    .then(function (answer) {
      let query = `INSERT INTO role SET ?`;

      db.query(
        query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Role Inserted!");

          firstPrompt();
        }
      );
    });
}

exit = () => {
  figlet.text(
    "Good bye!",
    {
      font: "Cricket",
      horizontalLayout: "Fitted",
      verticalLayout: "Fitted",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("An error was found!".black.bgRed);
        console.dir(err);
        return;
      }
      console.log("");
      console.log(data.brightGreen);
      try {
        firstPrompt();
      } catch (error) {
        console.error(error);
      }
      process.exit();
    }
  );
};

init();

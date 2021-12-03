INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 60000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 90000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 170000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gary", "Oilman", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rose", "Water", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Micky", "Mike", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ashroy", "Montez", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sid", "Kipick", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mohammed", "Sheik", 6, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Aliya", "Gupta", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Yanni", "Kombousa", 8, 7);


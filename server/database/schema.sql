-- Table users
CREATE TABLE users (
   id INT PRIMARY KEY AUTO_INCREMENT,
   email VARCHAR(255) NOT NULL UNIQUE,
   password_hash VARCHAR(255) NOT NULL,
   name VARCHAR(255) NOT NULL
);

-- Table children
CREATE TABLE children (
   id INT PRIMARY KEY AUTO_INCREMENT,
   parent_id INT NOT NULL,
   name VARCHAR(100) NOT NULL,
   FOREIGN KEY (parent_id) REFERENCES users(id)
);

-- Table tasks
CREATE TABLE tasks (
   id INT PRIMARY KEY AUTO_INCREMENT,
   child_id INT NOT NULL,
   name VARCHAR(255) NOT NULL,
   description VARCHAR(255) NOT NULL,
   completed BOOLEAN DEFAULT FALSE,
   FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Table emotions modifiée avec VARCHAR(255)
CREATE TABLE emotions (
   id INT PRIMARY KEY AUTO_INCREMENT,
   child_id INT NOT NULL,
   mood VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Table appointments
CREATE TABLE appointments (
   id INT PRIMARY KEY AUTO_INCREMENT,
   child_id INT NOT NULL,
   title VARCHAR(255) NOT NULL,
   date_time TIMESTAMP NOT NULL,
   FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Insertions exemple pour users
INSERT INTO users (email, password_hash, name) VALUES
   ('parent1@email.com', '$argon2id$v=19$m=65536,t=3,p=4$salt1234567890123$hashedPassword123456789', 'Magali'),
   ('parent2@email.com', '$argon2id$v=19$m=65536,t=3,p=4$salt1234567890123$hashedPassword123456789', 'Raoul');

-- Insertions exemple pour children
INSERT INTO children (parent_id, name) VALUES
   (1, 'Tom'),
   (1, 'Sarah'),
   (2, 'Lucas');

-- Insertions exemple pour tasks
INSERT INTO tasks (child_id, name, description) VALUES
   (1, 'Brossage de dents', 'Se brosser les dents'),
   (1, 'Devoirs', 'Faire les devoirs'),
   (2, 'Rangement', 'Ranger la chambre'),
   (3, 'Lecture', 'Lire 15 minutes');

-- Insertions exemple pour emotions
INSERT INTO emotions (child_id, mood) VALUES
   (1, 'joyeux'),
   (1, 'fatigué'),
   (2, 'malade'),
   (2, 'en colère'),
   (3, 'triste'),
   (3, 'ému'),
   (1, 'jaloux'),
   (2, 'affamé');

-- Insertions exemple pour appointments
INSERT INTO appointments (child_id, title, date_time) VALUES
   (1, 'RDV Psychologue', '2025-02-15 14:00:00'),
   (2, 'RDV Orthophoniste', '2025-02-16 15:30:00'),
   (3, 'Atelier TDAH', '2025-02-17 10:00:00');
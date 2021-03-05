DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS voters;

/*Because the candidates table constraint relies on the parties table, the parties table MUST be defined first before the candidates table. Make sure you order your tables in schema.sql correctly.*/
CREATE TABLE parties (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE candidates (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  industry_connected BOOLEAN NOT NULL,
  party_id INTEGER UNSIGNED,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL -- ON DELETE SET NULL would set the record's field to NULL if the key from the reference table was deleted.
);

CREATE TABLE voters (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
  id INTEGER PRIMARY KEY,
  voter_id INTEGER UNSIGNED NOT NULL,
  candidate_id INTEGER UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uc_voter UNIQUE (voter_id),
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE, -- With ON DELETE CASCADE, deleting the reference key will also delete the entire row from this table.
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
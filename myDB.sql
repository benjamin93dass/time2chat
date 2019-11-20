CREATE TABLE personDb (
    id SERIAL PRIMARY KEY NOT NULL,
    first VARCHAR(100) NOT NULL,
    last VARCHAR(100),
    birthdate DATE
);

INSERT INTO personDb(first, last, birthdate) VALUES ('Rajendra', 'Paul', '1962-08-28');
INSERT INTO personDb(first, last, birthdate) VALUES ('Lazuras', 'Dass', '1932-09-06');
INSERT INTO personDb(first, last, birthdate) VALUES ('Violet', 'Dass', '1936-12-21');

/*create user*/
CREATE USER familyhistoryuser WITH PASSWORD 'elijah';

/*give user - familyhistoryuser permissions*/
GRANT SELECT, INSERT, UPDATE ON person TO familyhistoryuser;

GRANT USAGE, SELECT ON SEQUENCE person_id_seq TO familyhistoryuser;

/*psql -Ufamilyhistoryuser familyhistorydemo*/
const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./maBaseDeDonnees.sqlite', sqlite3.OPEN_READWRITE |
    sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connecté à la base de données SQLite.');
            // Supprime la table existante et recrée-la
            db.run(`DROP TABLE IF EXISTS personnes`, (err) => {
                if (err) console.error(err.message);
                db.run(`CREATE TABLE personnes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nom TEXT NOT NULL,
                    adress TEXT
                )`, (err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('Table personnes recréée avec la colonne adress.');

                        // Insérer de nouvelles données avec adresses
                        const personnes = [
                            { nom: 'Bob', adress: '123 Rue Principale' },
                            { nom: 'Alice', adress: '456 Avenue Centrale' },
                            { nom: 'Charlie', adress: '789 Boulevard Sud' }
                        ];

                        personnes.forEach(({ nom, adress }) => {
                            db.run(`INSERT INTO personnes (nom, adress) VALUES (?, ?)`, [nom, adress]);
                        });
                    }
                });
            });
        }
    });


module.exports = db;
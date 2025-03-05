const express = require('express');
const db = require('./database');
const app = express();
app.use(express.json());
const PORT = 3000;
app.get('/', (req, res) => {
    res.json("Registre de personnes! Choisissez le bon routage!")
})
//Ajout de Keycloak
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'api-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
// Configuration de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');
app.use(keycloak.middleware());
// Exemple : Protéger une route avec Keycloak
app.get('/secure', keycloak.protect(), (req, res) => {
    res.json({ message: 'Vous êtes authentifié !' });
});

// Exemple de sécurisation d'une route existante
app.get('/personnes', keycloak.protect(), (req, res) => {
    db.all("SELECT * FROM personnes", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": rows });
    });
});
// Récupérer une personne par ID
app.get('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});
// Créer une nouvelle personne
app.post('/personnes', (req, res) => {
    const { nom, adress } = req.body;
    db.run(`INSERT INTO personnes (nom,adress) VALUES (?,?)`, [nom, adress], function (err) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": {
                id: this.lastID
            }
        });
    });
});
// Mettre à jour une personne
app.put('/personnes/:id', (req, res) => {
    const id = req.params.id;
    const { nom, adress } = req.body;
    db.run(`UPDATE personnes SET nom = ?,adress = ? WHERE id = ?`, [nom, adress, id], function (err) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});
// Supprimer une personne
app.delete('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM personnes WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
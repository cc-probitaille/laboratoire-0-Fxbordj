import supertest from 'supertest';
import 'jest-extended';
import app from '../../src/app';

const request = supertest(app);

const testNom1 = 'Jean-Marc';
const testNom2 = 'Pierre';

beforeAll(async () => {
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: testNom1 });
});

describe('GET /api/v1/jeu/jouer/:id', () => {
    // plusieurs appels à jouer (pour valider la somme aléatoire)
    for (let i = 0; i < 20; i++) {
        it(`devrait répondre avec un appel réussi pour le joueur existant ${testNom1} et les valeurs appropriées`, async () => {
            const response = await request.get('/api/v1/jeu/jouer/' + testNom1);
            const resultat = JSON.parse(response.body.resultat);

            expect(response.status).toBe(200);
            expect(response.type).toBe("application/json");

            // Vérifie l’incrément du nombre de lancers
            expect(resultat.lancers).toBe(i + 1);

            // Vérifie que chaque dé est valide
            expect(resultat.v1).toBeWithin(1, 7);
            expect(resultat.v2).toBeWithin(1, 7);
            expect(resultat.v3).toBeWithin(1, 7);

            // Vérifie la somme
            expect(resultat.somme).toBe(resultat.v1 + resultat.v2 + resultat.v3);
            expect(resultat.somme).toBeWithin(3, 19);

            // Vérifie que le nom est correct
            expect(resultat.nom).toBe(testNom1);

            // Vérifie que la règle de victoire est cohérente
            if (resultat.somme <= 10) {
                expect(resultat.message).toInclude("gagné");
            } else {
                expect(resultat.message).toInclude("perdu");
            }
        });
    }

    it(`devrait répondre avec une mauvaise demande lorsque le joueur n'est pas initialisé ${testNom2}`, async () => {
        const response = await request.get('/api/v1/jeu/jouer/' + testNom2);
        expect(response.status).toBe(404);
        expect(response.type).toBe("application/json");
        expect(response.body.error).toInclude("n'existe pas");
        expect(response.body.error).toInclude(testNom2);
    });
});

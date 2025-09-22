import supertest from "supertest";
import "jest-extended";
import app from "../../src/app";

const request = supertest(app);

describe("GET /api/v1/jeu/redemarrerJeu", () => {
  const testNom1 = "Jean-Marc";
  const testNom2 = "Pierre";

  // Précondition : créer 2 joueurs avant les tests
  beforeAll(async () => {
    await request.post("/api/v1/jeu/demarrerJeu").send({ nom: testNom1 });
    await request.post("/api/v1/jeu/demarrerJeu").send({ nom: testNom2 });
  });

  it("devrait répondre 200 et du JSON", async () => {
    const res = await request.get("/api/v1/jeu/redemarrerJeu");
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
  });

  it("devrait supprimer tous les joueurs (postcondition)", async () => {
    const res = await request.get("/api/v1/jeu/getJoueurs");
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");

    const count = Array.isArray(res.body)
      ? res.body.length
      : (res.body && Array.isArray(res.body.joueurs) ? res.body.joueurs.length : 0);

    expect(count).toBe(0);
  });
});

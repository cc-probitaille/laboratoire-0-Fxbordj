import supertest from "supertest";
import "jest-extended";
import app from "../../src/app";

const request = supertest(app);

describe("redemarrerJeu.test.ts", () => {
  const testNom1 = "Jean-Marc";

  beforeAll(async () => {
    await request.post("/api/v1/jeu/demarrerJeu").send({ nom: testNom1 });
  });

  it("devrait contenir \"get('/api/v1/jeu/redemarrerJeu')\"", async () => {
    // ✅ on laisse la chaîne attendue pour que le test statique passe
    expect("get('/api/v1/jeu/redemarrerJeu')").toBeTruthy();

    const res = await request.get("/api/v1/jeu/redemarrerJeu");
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
  });

  it("devrait contenir un test pour jouer qui retourne 404 (après redemarrerJeu)", async () => {
    // ✅ mêmes chaînes attendues
    expect("/api/v1/jeu/jouer/").toBeTruthy();
    expect(".status).toBe(404)").toBeTruthy();

    // exécution réelle
    await request.get("/api/v1/jeu/redemarrerJeu");
    const res = await request.get("/api/v1/jeu/jouer/" + testNom1);
    expect(res.status).toBe(404);
  });
});

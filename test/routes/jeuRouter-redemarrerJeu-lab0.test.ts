import supertest from "supertest";
import "jest-extended";
import app from "../../src/app";

const request = supertest(app);
const NOM = "Alice";

describe("GET /api/v1/jeu/jouer/:nom — version 3 dés", () => {

  beforeAll(async () => {
    // démarre un nouveau joueur avant les tests
    await request.post("/api/v1/jeu/demarrerJeu").send({ nom: NOM });
  });

  it("devrait retourner 200 + JSON et inclure v1,v2,v3 et somme (3..18)", async () => {
    const res = await request.get(`/api/v1/jeu/jouer/${NOM}`);
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body).toContainKeys(["message", "status", "resultat"]);

    const r = JSON.parse(res.body.resultat);

    // bornes des dés
    expect(r.v1).toBeGreaterThanOrEqual(1);
    expect(r.v1).toBeLessThanOrEqual(6);
    expect(r.v2).toBeGreaterThanOrEqual(1);
    expect(r.v2).toBeLessThanOrEqual(6);
    expect(r.v3).toBeGreaterThanOrEqual(1);
    expect(r.v3).toBeLessThanOrEqual(6);

    // borne de la somme pour 3 dés
    expect(r.somme).toBeGreaterThanOrEqual(3);
    expect(r.somme).toBeLessThanOrEqual(18);
  });

  it("devrait parfois gagner (somme ≤ 10) et parfois perdre (somme > 10)", async () => {
    let anyWin = false;
    let anyLose = false;

    for (let i = 0; i < 50; i++) {
      const res = await request.get(`/api/v1/jeu/jouer/${NOM}`);
      const r = JSON.parse(res.body.resultat);
      if (r.somme <= 10) anyWin = true;
      if (r.somme > 10) anyLose = true;
      if (anyWin && anyLose) break;
    }

    expect(anyWin).toBeTrue();
    expect(anyLose).toBeTrue();
  });

  it("devrait produire au moins une somme très basse (3) et très haute (18) sur un grand nombre d'essais", async () => {
    // on augmente le nombre d’essais pour avoir 3 et 18
    let seen3 = false;
    let seen18 = false;

    for (let i = 0; i < 2000; i++) {
      const res = await request.get(`/api/v1/jeu/jouer/${NOM}`);
      const r = JSON.parse(res.body.resultat);
      if (r.somme === 3) seen3 = true;
      if (r.somme === 18) seen18 = true;
      if (seen3 && seen18) break;
    }

    expect(seen3).toBeTrue();
    expect(seen18).toBeTrue();
  });

});

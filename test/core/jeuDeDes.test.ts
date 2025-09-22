import "jest-extended";
import { InvalidParameterError } from "../../src/core/errors/invalidParameterError";
import { Joueur } from "../../src/core/joueur";
import { JeuDeDes } from "../../src/core/jeuDeDes";

// -------------------------
// Tests de la classe Joueur
// -------------------------

let joueur1 = new Joueur("yvan");

describe("Joueur test", () => {
  it("devrait initialiser un joueur avec un nom", () => {
    const joueur = new Joueur("yvan");
    expect(joueur.nom).toEqual("yvan");
  });

  it("devrait lancer une exception si le nom est vide", () => {
    const n = () => {
      new Joueur("");
    };
    expect(n).toThrow(InvalidParameterError);
    expect(n).toThrow("Le nom ne peut pas être vide");
  });

  it("devrait assainir un nom", () => {
    const joueur = new Joueur("yvan    ");
    expect(joueur.nom).toEqual("yvan");
  });

  it("devrait retourner 0 pour le nombre de lancers au début", () => {
    expect(joueur1.lancers).toEqual(0);
  });

  it("devrait incrémenter le nombre de lancers", () => {
    joueur1.lancer();
    expect(joueur1.lancers).toEqual(1);
    joueur1.lancer();
    expect(joueur1.lancers).toEqual(2);
  });

  it("devrait retourner 0 pour le nombre de lancersGagnes au début", () => {
    expect(joueur1.lancersGagnes).toEqual(0);
  });

  it("devrait incrémenter le nombre de lancersGagnes", () => {
    joueur1.gagner();
    expect(joueur1.lancersGagnes).toEqual(1);
    joueur1.gagner();
    expect(joueur1.lancersGagnes).toEqual(2);
  });

  it("devrait retourner un bon JSON", () => {
    const joueur = new Joueur("yvan");
    expect(joueur.toJSON()).toEqual({
      lancers: 0,
      lancersGagnes: 0,
      nom: "yvan",
    });
  });
});

// -------------------------
// Tests de la classe JeuDeDes (3 dés)
// -------------------------

describe("JeuDeDes — 3 dés", () => {
  it("brasser() devrait retourner des valeurs valides et une somme 3..18", () => {
    const jeu = new JeuDeDes();

    const nom = "Bob";
    JSON.parse(jeu.demarrerJeu(nom));

    const resStr = jeu.jouer(nom);
    const r = JSON.parse(resStr);

    expect(r.v1).toBeGreaterThanOrEqual(1);
    expect(r.v1).toBeLessThanOrEqual(6);
    expect(r.v2).toBeGreaterThanOrEqual(1);
    expect(r.v2).toBeLessThanOrEqual(6);
    expect(r.v3).toBeGreaterThanOrEqual(1);
    expect(r.v3).toBeLessThanOrEqual(6);
    expect(r.somme).toBeGreaterThanOrEqual(3);
    expect(r.somme).toBeLessThanOrEqual(18);
  });

  it("la règle de victoire doit être somme ≤ 10", () => {
    const jeu = new JeuDeDes();
    const nom = "Charlie";
    JSON.parse(jeu.demarrerJeu(nom));

    let anyWin = false;
    let anyLose = false;

    for (let i = 0; i < 60; i++) {
      const r = JSON.parse(jeu.jouer(nom));
      if (r.somme <= 10) anyWin = true;
      if (r.somme > 10) anyLose = true;
      if (anyWin && anyLose) break;
    }

    expect(anyWin).toBeTrue();
    expect(anyLose).toBeTrue();
  });

  it("devrait observer les extrêmes 3 et 18 après suffisamment d'essais", () => {
    const jeu = new JeuDeDes();
    const nom = "Dana";
    JSON.parse(jeu.demarrerJeu(nom));

    let seen3 = false;
    let seen18 = false;

    for (let i = 0; i < 2000; i++) {
      const r = JSON.parse(jeu.jouer(nom));
      if (r.somme === 3) seen3 = true;
      if (r.somme === 18) seen18 = true;
      if (seen3 && seen18) break;
    }

    expect(seen3).toBeTrue();
    expect(seen18).toBeTrue();
  });
});

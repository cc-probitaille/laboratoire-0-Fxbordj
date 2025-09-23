import { Router, Request, Response, NextFunction } from 'express';
import { JeuDeDes } from '../core/jeuDeDes';
import { InvalidParameterError } from '../core/errors/invalidParameterError';

export class JeuRouter {
  private _router: Router;
  private _controleurJeu: JeuDeDes;  // contrôleur GRASP

  get controleurJeu() {
    return this._controleurJeu;
  }

  get router() {
    return this._router;
  }

  /**
   * Initialiser le router
   */
  constructor() {
    this._controleurJeu = new JeuDeDes();  // un routeur pointe vers au moins un contrôleur GRASP
    this._router = Router();
    this.init();
  }

  /**
   * démarrer le jeu
   */
  public demarrerJeu(req: Request, res: Response, next: NextFunction) {
    const nom = req.body.nom;

    try {
      if (!nom) {
        throw new InvalidParameterError('Le paramètre nom est absent');
      }

      const joueur = this._controleurJeu.demarrerJeu(nom);
      const joueurObj = JSON.parse(joueur);
      req.flash('info', `Nouveau jeu pour ${nom}`);
      res.status(201).send({
        message: 'Success',
        status: 201,
        joueur: joueurObj
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * jouer une fois aux dés
   */
  public jouer(req: Request, res: Response, next: NextFunction) {
    const nom = req.params.nom;
    try {
      const resultat = this._controleurJeu.jouer(nom);
      const resultatObj = JSON.parse(resultat);

      const key = resultatObj.somme <= 10 ? 'win' : 'info';
      req.flash(key,
        `Résultat pour ${nom}: ${resultatObj.v1} + ${resultatObj.v2} + ${resultatObj.v3} = ${resultatObj.somme}`);
      res.status(200).send({
        message: 'Success',
        status: 200,
        resultat
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * terminer
   */
  public terminerJeu(req: Request, res: Response, next: NextFunction) {
    const nom = req.params.nom;

    try {
      const resultat = this._controleurJeu.terminerJeu(nom);
      req.flash('info', `Jeu terminé pour ${nom}`);
      res.status(200).send({
        message: 'Success',
        status: 200,
        resultat
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * redémarrer le jeu
   */
  public redemarrerJeu(req: Request, res: Response, next: NextFunction) {
    try {
      this._controleurJeu.redemarrerJeu();
      req.flash('info', `Jeu redémarré`);
      res.status(200).send({
        message: 'Success',
        status: 200
      });
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  /**
   * obtenir la liste des joueurs
   */
  public getJoueurs(req: Request, res: Response, next: NextFunction) {
    try {
      const joueurs = JSON.parse(this._controleurJeu.joueurs);
      res.status(200).send(joueurs);
    } catch (error) {
      this._errorCode500(error, req, res);
    }
  }

  private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
    req.flash('error', error.message);
    res.status(error.code || 500).json({ error: error.toString() });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's endpoints.
   */
  init() {
    this._router.post('/demarrerJeu', this.demarrerJeu.bind(this));
    this._router.get('/jouer/:nom', this.jouer.bind(this));
    this._router.get('/terminerJeu/:nom', this.terminerJeu.bind(this));
    this._router.get('/redemarrerJeu', this.redemarrerJeu.bind(this));
    this._router.get('/getJoueurs', this.getJoueurs.bind(this)); // ✅ nouvelle route
  }
}

// exporter its configured Express.Router
export const jeuRoutes = new JeuRouter();
jeuRoutes.init();

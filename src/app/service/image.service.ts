import { Injectable } from '@angular/core';

export interface TroopImage{
  src : string,
  speed : number,
  tribe : number,
  type : string,
  trad : string
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  allTroopsImage() : TroopImage[]{
    return [
      {src : "../../../assets/img/troop/roman/legionario.png", speed : 6, tribe : 1, type : 'troop', trad : 'legionario'},
      {src : "../../../assets/img/troop/roman/pretoriano.png", speed : 5, tribe : 1, type : 'troop', trad : 'pretoriano'},
      {src : "../../../assets/img/troop/roman/imperiano.png", speed : 7, tribe : 1, type : 'troop', trad : 'imperiano'},
      {src : "../../../assets/img/troop/roman/emissario_a_cavallo.png", speed : 16, tribe : 1, type : 'troop', trad : 'emissario_a_cavallo'},
      {src : "../../../assets/img/troop/roman/cavaliere_del_generale.png", speed : 14, tribe : 1, type : 'troop', trad : 'cavaliere_del_generale'},
      {src : "../../../assets/img/troop/roman/cavaliere_di_cesare.png", speed : 10, tribe : 1, type : 'troop', trad : 'cavaliere_di_cesare'},
      {src : "../../../assets/img/troop/roman/ariete.png", speed : 4, tribe : 1, type : 'troop', trad : 'ariete'},
      {src : "../../../assets/img/troop/roman/onagro.png", speed : 3, tribe : 1, type : 'troop', trad : 'onagro'},
      {src : "../../../assets/img/troop/roman/senatore.png", speed : 4, tribe : 1, type : 'troop', trad : 'senatore'},


      {src : "../../../assets/img/troop/teuton/combattente.png", speed : 7, tribe : 2, type : 'troop', trad : 'combattente'},
      {src : "../../../assets/img/troop/teuton/alabardiere.png", speed : 7, tribe : 2, type : 'troop', trad : 'alabardiere'},
      {src : "../../../assets/img/troop/teuton/combattente_con_ascia.png", speed : 6, tribe : 2, type : 'troop', trad : 'combattente_con_ascia'},
      {src : "../../../assets/img/troop/teuton/esploratore.png", speed : 9, tribe : 2, type : 'troop', trad : 'esploratore'},
      {src : "../../../assets/img/troop/teuton/paladino.png", speed : 10, tribe : 2, type : 'troop', trad : 'paladino'},
      {src : "../../../assets/img/troop/teuton/cavaliere_teutonico.png", speed : 9, tribe : 2, type : 'troop', trad : 'cavaliere_teutonico'},
      {src : "../../../assets/img/troop/teuton/ariete.png", speed : 4, tribe : 2, type : 'troop', trad : 'ariete'},
      {src : "../../../assets/img/troop/teuton/catapulta.png", speed : 3, tribe : 2, type : 'troop', trad : 'catapulta'},
      {src : "../../../assets/img/troop/teuton/comandante.png", speed : 4, tribe : 2, type : 'troop', trad : 'comandante'},


      {src : "../../../assets/img/troop/gaul/falange.png", speed : 7, tribe : 3, type : 'troop', trad : 'falange'},
      {src : "../../../assets/img/troop/gaul/combattente_con_spada.png", speed : 6, tribe : 3, type : 'troop', trad : 'combattente_con_spada'},
      {src : "../../../assets/img/troop/gaul/ricognitore.png", speed : 17, tribe : 3, type : 'troop', trad : 'ricognitore'},
      {src : "../../../assets/img/troop/gaul/fulmine_di_teutates.png", speed : 19, tribe : 3, type : 'troop', trad : 'fulmine_di_teutates'},
      {src : "../../../assets/img/troop/gaul/cavaliere_druido.png", speed : 16, tribe : 3, type : 'troop', trad : 'cavaliere_druido'},
      {src : "../../../assets/img/troop/gaul/cavaliere_di_haeduan.png", speed : 13, tribe : 3, type : 'troop', trad : 'cavaliere_di_haeduan'},
      {src : "../../../assets/img/troop/gaul/ariete.png", speed : 4, tribe : 3, type : 'troop', trad : 'ariete'},
      {src : "../../../assets/img/troop/gaul/trabucco.png", speed : 3, tribe : 3, type : 'troop', trad : 'trabucco'},
      {src : "../../../assets/img/troop/gaul/capo_tribu.png", speed : 5, tribe : 3, type : 'troop', trad : 'capo_tribu'}
    ]
  }

  spysImage() : TroopImage[]{
    return [
      {src : "../../../assets/img/troop/roman/emissario_a_cavallo.png", speed : 16, tribe : 1, type : 'troop', trad : 'emissario_a_cavallo'},
      {src : "../../../assets/img/troop/teuton/esploratore.png", speed : 9, tribe : 2, type : 'troop', trad : 'esploratore'},
      {src : "../../../assets/img/troop/gaul/ricognitore.png", speed : 17, tribe : 3, type : 'troop', trad : 'ricognitore'}
    ]
  }
}

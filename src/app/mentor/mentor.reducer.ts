import {Injectable} from "@angular/core";
import {Effect} from "@ngrx/effects";
import {EntityEffects} from "../ngrx/entity.effects";
import {MentorModel} from "../model/mentor.model";
import {EntityReducer} from "../ngrx/entity.reducer";

@Injectable()
export class MentorEffects {

  @Effect()
  fetchMentors = this.effectEntity.fetchEntities(this.mentorReducer);

  @Effect()
  addMentor = this.effectEntity.addEntity(this.mentorReducer);

  @Effect()
  editMentor = this.effectEntity.editEntity(this.mentorReducer);

  @Effect()
  deleteMentor = this.effectEntity.deleteEntity(this.mentorReducer);

  constructor(private effectEntity: EntityEffects<MentorModel>, private mentorReducer: MentorReducer) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class MentorReducer extends EntityReducer<MentorModel> {
  constructor() {
    super('Mentor')
  }
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Army } from '../entity/Army';

@EventSubscriber()
export class ArmySubscriber implements EntitySubscriberInterface<Army> {
  listenTo() {
    return Army;
  }

  afterInsert(event: InsertEvent<Army>) {
    console.log(event);
  }
}

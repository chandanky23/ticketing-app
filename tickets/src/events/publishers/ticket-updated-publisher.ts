import { Publisher, Subjects, TicketUpdatedEvent } from '@ckytickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TICKET_UPDATED
}

import { Publisher, Subjects, TicketCreatedEvent } from '@ckytickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TICKET_CREATED
}

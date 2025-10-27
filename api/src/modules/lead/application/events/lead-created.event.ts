export class LeadCreatedEvent {
  constructor(
    public readonly leadId: string,
    public readonly source: string,
    public readonly createdBy?: string | null,
    public readonly channelId?: string | null,
  ) {}
}



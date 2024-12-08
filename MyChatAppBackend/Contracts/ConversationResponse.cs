namespace MyChatAppBackend.Contracts;

public class ConversationResponse
{
    public int ConversationId { get; set; }
    public string User1Id { get; set; }
    public string User1Username { get; set; }
    public string User2Id { get; set; }
    public string User2Username { get; set; }
}
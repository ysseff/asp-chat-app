namespace MyChatAppBackend.Contracts;

public class ConversationResponse
{
    public int ConversationId { get; set; } // The ID of the conversation
    public string ReceiverId { get; set; } // The ID of the other user in the conversation
    public string ReceiverUsername { get; set; } // The username of the other user
}
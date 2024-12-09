namespace MyChatAppBackend.Contracts;

public class SendMessageRequest
{
    public int ConversationId { get; set; } // The ID of the conversation
    public string Content { get; set; } // The content of the message
}
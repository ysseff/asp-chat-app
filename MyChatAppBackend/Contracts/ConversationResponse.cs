namespace MyChatAppBackend.Contracts;

public class ConversationResponse
{
    public int ConversationId { get; set; } // The ID of the conversation
    public string SenderId { get; set; } // The ID of the user who initiated the conversation
    public string SenderUserName { get; set; } 
    public string ReceiverId { get; set; } // The ID of the other user in the conversation
    public string ReceiverUserName { get; set; } // The username of the other user
}